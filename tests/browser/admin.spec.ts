import { test, expect, t, loginUi, loginApi } from "./fixtures";
import { testSettings } from "../helpers/e2e-environment";
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
