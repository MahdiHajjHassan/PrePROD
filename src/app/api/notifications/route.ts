import { withServices } from "@/server/services";
import { requestActor } from "@/server/auth/policy";
import { jsonData } from "@/server/api/http";
export function GET(request: Request) { return withServices(async ({ notifications, auth }) => jsonData(await notifications.list(await requestActor(request, auth)))); }
