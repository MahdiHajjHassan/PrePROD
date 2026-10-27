import { z } from "zod";
import { withServices } from "@/server/services";
import { requestActor } from "@/server/auth/policy";
import { readJson, requireSameOrigin } from "@/server/security/origin";
import { parseInput } from "@/server/validation";
export function POST(request: Request) { return withServices(async ({ notifications, auth, config }) => {
  requireSameOrigin(request, config.appOrigin); parseInput(z.object({}).strict(), await readJson(request));
  await notifications.markAllRead(await requestActor(request, auth));
  return new Response(null, { status: 204, headers: { "Cache-Control": "private, no-store" } });
}); }
