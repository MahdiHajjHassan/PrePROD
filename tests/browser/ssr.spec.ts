import { test, expect, t } from "./fixtures";
test.use({ javaScriptEnabled: false });
test("task text, metadata and useful filter links exist before JavaScript", async ({ page }) => {
  const response = await page.goto("/en/tasks"); expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { name: "Demo task 59", exact: true })).toBeVisible();
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", t.metadataDescription);
  await page.getByRole("link", { name: t.next, exact: true }).click(); await expect(page).toHaveURL(/page=2/);
  await expect(page.locator("li.task-row")).toHaveCount(25);
});
