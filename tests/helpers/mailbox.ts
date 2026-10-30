import { expect } from "@playwright/test";
import { testSettings } from "./e2e-environment";

export async function inboxCode(email: string) {
  let code = "";
  await expect
    .poll(async () => {
      const base = `http://127.0.0.1:${testSettings().mailPort}`;
      const listing = await (await fetch(`${base}/api/v1/messages`)).json();
      const message = listing.messages?.find((message: { To: Array<{ Address: string }> }) =>
        message.To.some((to) => to.Address === email),
      );
      if (!message) return false;
      const content = await (await fetch(`${base}/api/v1/message/${message.ID}`)).json();
      code = content.Text?.match(/\b\d{6}\b/)?.[0] ?? "";
      return Boolean(code);
    })
    .toBe(true);
  return code;
}
