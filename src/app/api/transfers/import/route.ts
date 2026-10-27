import { withServices } from "@/server/services";
import { requestActor } from "@/server/auth/policy";
import { jsonData } from "@/server/api/http";
import { requireSameOrigin } from "@/server/security/origin";
import { readImportBody, transferFormat } from "@/server/transfers/http";
export function POST(request: Request) { return withServices(async ({ transfers, auth, config }) => {
  requireSameOrigin(request, config.appOrigin); const actor = await requestActor(request, auth);
  const format = transferFormat(new URL(request.url), true);
  return jsonData(await transfers.import(actor, await readImportBody(request, format), format), 201);
}); }
