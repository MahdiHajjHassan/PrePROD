import { z } from "zod";
import { withServices } from "@/server/services";
import { requestActor } from "@/server/auth/policy";
import { readJson, requireSameOrigin } from "@/server/security/origin";
import { parseInput } from "@/server/validation";
type Context = { params: Promise<{ id: string }> };
export function PATCH(request: Request, context: Context) { return withServices(async ({ notifications, auth, config }) => {
  requireSameOrigin(request, config.appOrigin); parseInput(z.object({}).strict(), await readJson(request));
  await notifications.markRead(await requestActor(request, auth), (await context.params).id);
  return new Response(null, { status: 204, headers: { "Cache-Control": "private, no-store" } });
}); }
