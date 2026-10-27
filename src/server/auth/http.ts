import type { Actor } from "@/shared/tasks";
import type { AuthService } from "./service";
import type { ServerConfig } from "../config";
import { DomainError } from "../errors";
import { clientKey, readJson, requireSameOrigin } from "../security/origin";
import { handleApi, jsonData } from "../api/http";

const cookieName = "__Host-taskboard_session";
function readToken(request: Request): string | null {
  const matches = (request.headers.get("Cookie") ?? "").split(";").map((item) => item.trim()).filter((item) => item.startsWith(`${cookieName}=`));
  return matches.length === 1 ? matches[0].slice(cookieName.length + 1) : null;
}
function setSession(response: Response, token: string, expiresAt: Date): Response {
  response.headers.set("Set-Cookie", `${cookieName}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800; Expires=${expiresAt.toUTCString()}`);
  return response;
}
function clearedSession(): Response {
  return new Response(null, { status: 204, headers: {
    "Cache-Control": "private, no-store",
    "Set-Cookie": `${cookieName}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
  } });
}

export function createAuthHandlers(auth: AuthService, config: Pick<ServerConfig, "appOrigin">) {
  async function actor(request: Request): Promise<Actor> {
    const current = await auth.resolveSession(readToken(request));
    if (!current) throw new DomainError("UNAUTHENTICATED");
    return current;
  }
  async function body(request: Request) { requireSameOrigin(request, config.appOrigin); return readJson(request); }
  return {
    register(request: Request) { return handleApi(async () => jsonData(await auth.register(await body(request), clientKey(request)), 201)); },
    login(request: Request) { return handleApi(async () => {
      const result = await auth.login(await body(request), clientKey(request));
      return setSession(jsonData(result.user), result.token, result.expiresAt);
    }); },
    logout(request: Request) { return handleApi(async () => { await body(request); await auth.logout(readToken(request)); return clearedSession(); }); },
    account(request: Request) { return handleApi(async () => jsonData(await auth.account(await actor(request)))); },
    updateAccount(request: Request) { return handleApi(async () => {
      const input = await body(request);
      return jsonData(await auth.updateAccount(await actor(request), input));
    }); },
    changePassword(request: Request) { return handleApi(async () => {
      const input = await body(request);
      await auth.changePassword(await actor(request), input);
      return clearedSession();
    }); },
  };
}
