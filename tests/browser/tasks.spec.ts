import { test, expect, t, loginUi, createTask } from "./fixtures";
test("task create/edit/complete/delete UI and keyboard confirmation", async ({ page }) => {
  await loginUi(page); await createTask(page, "Browser lifecycle task");
  let row = page.locator("li.task-row").filter({ has: page.getByRole("heading", { name: "Browser lifecycle task", exact: true }) });
  await row.getByRole("button", { name: t.edit, exact: true }).click();
  await row.getByLabel(t.title, { exact: true }).fill("Renamed lifecycle task");
  await row.getByRole("button", { name: t.save, exact: true }).click();
  row = page.locator("li.task-row").filter({ has: page.getByRole("heading", { name: "Renamed lifecycle task", exact: true }) });
  await row.getByRole("button", { name: t.markDone, exact: true }).click(); await expect(row.getByRole("button", { name: t.reopen, exact: true })).toBeVisible();
  await row.getByRole("button", { name: t.delete, exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible(); await page.keyboard.press("Escape"); await expect(page.getByRole("dialog")).not.toBeVisible();
  await row.getByRole("button", { name: t.delete, exact: true }).click(); await page.getByRole("button", { name: t.confirmDelete, exact: true }).click();
  await expect(page.getByRole("heading", { name: "Renamed lifecycle task", exact: true })).toHaveCount(0);
});
test("combined filters and pagination use real server-rendered task data", async ({ page }) => {
  await page.goto("/en/tasks"); await page.getByLabel(t.search, { exact: true }).fill("Demo task");
  await page.locator('select[name="status"]').selectOption("OPEN"); await page.locator('select[name="priority"]').selectOption("HIGH");
  await page.locator('select[name="ownerId"]').selectOption({ label: "Member A" }); await page.locator('select[name="sort"]').selectOption("created_asc");
  await page.getByRole("button", { name: t.apply, exact: true }).click();
  await expect(page.getByRole("heading", { name: `${t.results}: 40`, exact: true })).toBeVisible();
  await expect(page.locator("li.task-row")).toHaveCount(25);
  await page.getByRole("link", { name: t.next, exact: true }).click(); await expect(page.locator("li.task-row")).toHaveCount(15);
  await expect(page.getByRole("heading", { name: "Demo task 25", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: t.newTask, exact: true })).toHaveCount(0);
});
