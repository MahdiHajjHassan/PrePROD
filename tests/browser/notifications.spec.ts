import { test, expect, t, loginUi, createTask } from "./fixtures";
test("domain actions update notifications and immutable personal activity, including deleted tasks", async ({ page }) => {
  await loginUi(page); await page.goto("/en/activity"); await expect(page.getByRole("heading", { name: t.noActivity, exact: true })).toBeVisible();
  await page.goto("/en/tasks"); await createTask(page, "Activity browser task");
  const row = page.locator("li.task-row").filter({ has: page.getByRole("heading", { name: "Activity browser task", exact: true }) });
  await row.getByRole("button", { name: t.markDone, exact: true }).click(); await expect(row.getByRole("button", { name: t.reopen, exact: true })).toBeVisible();
  await row.getByRole("button", { name: t.delete, exact: true }).click(); await page.getByRole("dialog").getByRole("button", { name: t.confirmDelete, exact: true }).click();
  await expect(page.getByRole("heading", { name: "Activity browser task", exact: true })).toHaveCount(0);
  await page.goto("/en/notifications"); await expect(page.locator("li").filter({ hasText: "Activity browser task" })).toHaveCount(3);
  await page.getByRole("button", { name: t.markAllRead, exact: true }).click(); await expect(page.getByText(`${t.unread}: 0`, { exact: true })).toBeVisible();
  await page.goto("/en/activity"); await expect(page.locator(".activity-summary .metric")).toHaveText(["1", "1", "1"]);
  await expect(page.getByRole("table").getByRole("row")).toHaveCount(8);
});
