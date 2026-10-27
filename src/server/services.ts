import { getDb } from "./db";
import { loadConfig } from "./config";
import { createAuthService } from "./auth/service";
import { createAuthHandlers } from "./auth/http";
import { apiError } from "./api/http";

async function buildServices() {
  const db = await getDb();
  const config = loadConfig(process.env);
  return { auth: createAuthService(db), config };
}
let services: ReturnType<typeof buildServices> | undefined;
export function getServices() {
  services ??= buildServices().catch((error) => { services = undefined; throw error; });
  return services;
}
export async function handleAuth(action: keyof ReturnType<typeof createAuthHandlers>, request: Request): Promise<Response> {
  try {
    const current = await getServices();
    return createAuthHandlers(current.auth, current.config)[action](request);
  } catch (error) { return apiError(error); }
}
