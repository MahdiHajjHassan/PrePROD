import { withServices } from "@/server/services";
import { requestActor } from "@/server/auth/policy";
import { jsonData } from "@/server/api/http";
import { parseUserQuery } from "@/server/users/service";
export function GET(request: Request) { return withServices(async ({ users, auth }) => jsonData(await users.listUsers(await requestActor(request, auth), parseUserQuery(new URL(request.url).searchParams)))); }
