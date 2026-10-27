import { test, expect, t, loginUi, loginApi } from "./fixtures";
import { testSettings } from "../helpers/e2e-environment";
test("401 and 403 clear previously rendered private data after revocation", async ({ page, context, browser, expectedFailures }) => {
  const origin = testSettings().values.APP_ORIGIN;
  await loginUi(page, "admin"); const own = (await (await context.request.get("/api/account")).json()).data;
  const users = (await (await context.request.get("/api/admin/users")).json()).data.items as Array<{ id: string; email: string }>;
  const a = users.find((user) => user.email === "member-a@example.test")!; const b = users.find((user) => user.email === "member-b@example.test")!;
  expect((await context.request.put(`/api/admin/users/${b.id}`, { data: { role: "ADMIN" }, headers: { Origin: origin } })).status()).toBe(200);
  await page.goto("/en/admin/users"); await expect(page.getByRole("table")).toBeVisible();
  const second = await browser.newContext({ baseURL: origin, ignoreHTTPSErrors: true });
  try {
    await loginApi(second.request, "b"); expect((await second.request.put(`/api/admin/users/${own.id}`, { data: { role: "MEMBER" }, headers: { Origin: origin } })).status()).toBe(200);
    expectedFailures.push({ path: `/api/admin/users/${a.id}`, status: 403 });
    const row = page.getByRole("row").filter({ hasText: a.email }); await row.getByRole("button", { name: t.edit, exact: true }).click();
    await row.getByLabel(t.displayName, { exact: true }).fill("Denied stale edit"); await row.getByRole("button", { name: t.save, exact: true }).click();
    await expect(page).toHaveURL(/\/en\/tasks$/); await expect(page.getByText(a.email, { exact: true })).toHaveCount(0);
    await page.goto("/en/account"); await context.clearCookies();
    expectedFailures.push({ path: "/api/account", status: 401 });
    await page.getByLabel(t.displayName, { exact: true }).fill("Expired request"); await page.getByRole("button", { name: t.save, exact: true }).click();
    await expect(page).toHaveURL(/\/en\/login$/); await expect(page.getByLabel(t.email, { exact: true })).toHaveValue("");
  } finally { await second.close(); }
});
test("admin roles revoke immediately, deletion cascades, and final administrator stays protected", async ({ page, browser, expectedFailures }) => {
  await loginUi(page, "admin"); const admin = (await (await page.request.get("/api/account")).json()).data;
  await page.goto("/en/admin/users");
  let row = page.getByRole("row").filter({ hasText: "member-b@example.test" });
  await row.getByRole("button", { name: t.edit, exact: true }).click(); await row.getByLabel(t.role, { exact: true }).selectOption("ADMIN");
  await row.getByRole("button", { name: t.save, exact: true }).click(); await expect(row.getByText(t.ADMIN, { exact: true })).toBeVisible();
  const second = await browser.newContext({ baseURL: testSettings().values.APP_ORIGIN, ignoreHTTPSErrors: true });
  try {
    await loginApi(second.request, "b"); expect((await second.request.get("/api/admin/users")).status()).toBe(200);
    await row.getByRole("button", { name: t.edit, exact: true }).click(); await row.getByLabel(t.role, { exact: true }).selectOption("MEMBER");
    await row.getByRole("button", { name: t.save, exact: true }).click(); await expect(row.getByText(t.MEMBER, { exact: true })).toBeVisible();
    expect((await second.request.get("/api/admin/users")).status()).toBe(403);
    row = page.getByRole("row").filter({ hasText: "member-a@example.test" });
    await row.getByRole("button", { name: t.delete, exact: true }).click(); await page.getByRole("dialog").getByRole("button", { name: t.confirmDelete, exact: true }).click();
    await expect(page.getByRole("row").filter({ hasText: "member-a@example.test" })).toHaveCount(0);
    expect((await (await page.request.get("/api/tasks")).json()).data.total).toBe(5);
    row = page.getByRole("row").filter({ hasText: testSettings().values.ADMIN_EMAIL });
    expectedFailures.push({ path: `/api/admin/users/${admin.id}`, status: 409 });
    await row.getByRole("button", { name: t.edit, exact: true }).click(); await row.getByLabel(t.role, { exact: true }).selectOption("MEMBER");
    await row.getByRole("button", { name: t.save, exact: true }).click(); await expect(page.getByRole("alert").getByText(t.CONFLICT, { exact: true })).toBeVisible();
    expect((await (await page.request.get("/api/account")).json()).data.role).toBe("ADMIN");
  } finally { await second.close(); }
});
