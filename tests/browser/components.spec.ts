import { test, expect, t, loginUi } from "./fixtures";
test("shared controls support keyboard focus and tab semantics", async ({ page }) => {
  await page.goto("/en/login"); await page.keyboard.press("Tab"); await expect(page.getByRole("link", { name: t.skip, exact: true })).toBeFocused();
  await loginUi(page); await page.goto("/en/transfers");
  const json = page.getByRole("tab", { name: t.json, exact: true }); const csv = page.getByRole("tab", { name: t.csv, exact: true });
  await json.focus(); await page.keyboard.press("ArrowRight"); await expect(csv).toHaveAttribute("aria-selected", "true"); await expect(csv).toBeFocused();
  await expect(page.getByRole("tabpanel")).toBeVisible(); await expect(page.getByRole("checkbox")).toHaveAccessibleName(t.appendAccept);
});
