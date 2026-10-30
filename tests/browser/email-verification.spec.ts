import { test, expect, t, credentials } from "./fixtures";
import { inboxCode } from "../helpers/mailbox";

test("signup requires a delivered code before account login and game access", async ({ page }) => {
  await page.goto("/en/register");
  await page.getByLabel(t.displayName, { exact: true }).fill("Verified player");
  await page.getByLabel(t.email, { exact: true }).fill("verified-player@example.test");
  await page.getByLabel(t.password, { exact: true }).fill(credentials().password);
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: t.register, exact: true }).click();
  await expect(page).toHaveURL(/\/en\/verify-email$/);
  expect((await page.request.get("/api/account")).status()).toBe(401);
  const code = await inboxCode("verified-player@example.test");
  await page.getByLabel("Verification code", { exact: true }).fill(code);
  await page.getByRole("button", { name: "Verify email", exact: true }).click();
  await expect(page).toHaveURL(/\/en\/login\?notice=verified$/);
  await page.getByLabel(t.email, { exact: true }).fill("verified-player@example.test");
  await page.getByLabel(t.password, { exact: true }).fill(credentials().password);
  await page.getByRole("button", { name: t.login, exact: true }).click();
  await expect(page).toHaveURL(/\/en\/play$/);
});
