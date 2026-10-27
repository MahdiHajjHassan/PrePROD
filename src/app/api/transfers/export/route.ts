import { withServices } from "@/server/services";
import { requestActor } from "@/server/auth/policy";
import { parseTaskQuery } from "@/server/tasks/query";
import { transferFormat } from "@/server/transfers/http";
export function GET(request: Request) { return withServices(async ({ transfers, auth }) => {
  await requestActor(request, auth); const url = new URL(request.url); const format = transferFormat(url); url.searchParams.delete("format");
  const result = await transfers.export(parseTaskQuery(url.searchParams), format);
  return new Response(Buffer.from(result.bytes), { headers: { "Content-Type": result.contentType, "Content-Disposition": `attachment; filename="tasks.${format}"`, "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" } });
}); }
