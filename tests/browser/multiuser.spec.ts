import { test, expect, t, loginApi } from "./fixtures";
import { testSettings } from "../helpers/e2e-environment";
test("two sessions share tasks, reject foreign writes, and recover a stale edit without overwriting", async ({ page, context, browser, expectedFailures }) => {
  const origin = testSettings().values.APP_ORIGIN; await loginApi(context.request, "a");
  const second = await browser.newContext({ baseURL: origin, ignoreHTTPSErrors: true });
  try {
    await loginApi(second.request, "b");
    const [aResponse, bResponse] = await Promise.all([
      context.request.post("/api/tasks", { data: { title: "Session A task" }, headers: { Origin: origin } }),
      second.request.post("/api/tasks", { data: { title: "Session B task" }, headers: { Origin: origin } }),
    ]);
    expect(aResponse.status()).toBe(201); expect(bResponse.status()).toBe(201); const task = (await aResponse.json()).data;
    await page.goto("/en/tasks"); await expect(page.getByRole("heading", { name: "Session B task", exact: true })).toBeVisible();
    const foreign = page.locator("li.task-row").filter({ has: page.getByRole("heading", { name: "Session B task", exact: true }) });
    await expect(foreign.getByRole("button")).toHaveCount(0);
    expect((await second.request.put(`/api/tasks/${task.id}`, { data: { title: "Forbidden", version: 1 }, headers: { Origin: origin } })).status()).toBe(403);
    expect((await context.request.put(`/api/tasks/${task.id}`, { data: { status: "DONE", version: 1 }, headers: { Origin: origin } })).status()).toBe(200);
    expectedFailures.push({ path: `/api/tasks/${task.id}`, status: 409 });
    const own = page.locator("li.task-row").filter({ has: page.getByRole("heading", { name: "Session A task", exact: true }) });
    await own.getByRole("button", { name: t.markDone, exact: true }).click(); await expect(own.getByRole("alert").getByText(t.CONFLICT, { exact: true })).toBeVisible();
    await own.getByRole("alert").getByRole("button", { name: t.refresh, exact: true }).click(); await expect(own.getByRole("button", { name: t.reopen, exact: true })).toBeVisible();
    expect((await (await context.request.get(`/api/tasks/${task.id}`)).json()).data.version).toBe(2);
    const payload = '<img src=x onerror="window.taskboardXss=true">';
    expect((await context.request.post("/api/tasks", { data: { title: payload }, headers: { Origin: origin } })).status()).toBe(201);
    await page.reload(); await expect(page.getByRole("heading", { name: payload, exact: true })).toBeVisible();
    expect(await page.evaluate(() => (window as unknown as Record<string, unknown>).taskboardXss)).toBeUndefined();
    await expect(page.locator("li.task-row img")).toHaveCount(0);
  } finally { await second.close(); }
});
