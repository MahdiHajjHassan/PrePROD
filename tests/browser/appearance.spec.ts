import { test, expect, t } from "./fixtures";
import { dictionaries } from "../../src/i18n/dictionaries";
import { resolve } from "node:path";
test("themes/locales persist through SSR; Arabic mirrors at mobile and desktop without overflow", async ({ page }, info) => {
  await page.goto("/en/tasks"); await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.getByRole("button", { name: t.dark, exact: true }).click(); await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload(); await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByLabel(t.language, { exact: true }).selectOption("fr"); await expect(page).toHaveURL(/\/fr\/tasks/);
  await expect(page.locator("html")).toHaveAttribute("lang", "fr"); await expect(page.getByRole("heading", { name: dictionaries.fr.board, exact: true })).toBeVisible();
  await page.getByLabel(dictionaries.fr.language, { exact: true }).selectOption("ar"); await expect(page).toHaveURL(/\/ar\/tasks/);
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl"); await expect(page.getByRole("heading", { name: dictionaries.ar.board, exact: true })).toBeVisible();
  for (const width of [360, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.screenshot({ path: resolve(`.superpowers/sdd/2026-10-26-taskboard/${info.project.name}-ar-dark-${width}.png`), fullPage: true });
  }
  await page.getByRole("button", { name: dictionaries.ar.light, exact: true }).click(); await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.screenshot({ path: resolve(`.superpowers/sdd/2026-10-26-taskboard/${info.project.name}-ar-light-1280.png`), fullPage: true });
  await page.goto("/"); await expect(page).toHaveURL(/\/ar\/tasks/);
  await page.goto("/en/privacy"); await expect(page.getByRole("heading", { name: t.privacy, exact: true })).toBeVisible();
  await page.goto("/en/terms"); await expect(page.getByRole("heading", { name: t.terms, exact: true })).toBeVisible();
});
