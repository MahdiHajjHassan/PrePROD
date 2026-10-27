import { getDb } from "./db";
import { loadConfig } from "./config";
import { createAuthService } from "./auth/service";
import { createAuthHandlers } from "./auth/http";
import { apiError } from "./api/http";
import { createTaskService } from "./tasks/service";
import { createTaskHandlers } from "./tasks/http";
import { createUserService } from "./users/service";
import { handleApi } from "./api/http";

async function buildServices() {
  const db = await getDb();
  const config = loadConfig(process.env);
  return { db, auth: createAuthService(db), tasks: createTaskService(db), users: createUserService(db), config };
}
export async function handleTask(action: keyof ReturnType<typeof createTaskHandlers>, request: Request, id?: string): Promise<Response> {
  try {
    const current = await getServices();
    const handlers = createTaskHandlers(current.tasks, current.auth, current.config);
    if (action === "read" || action === "update" || action === "remove") return handlers[action](request, id ?? "");
    return handlers[action](request);
  } catch (error) { return apiError(error); }
}
let services: ReturnType<typeof buildServices> | undefined;
export function getServices() {
  services ??= buildServices().catch((error) => { services = undefined; throw error; });
  return services;
}
export function withServices(operation: (current: Awaited<ReturnType<typeof getServices>>) => Promise<Response>) {
  return handleApi(async () => operation(await getServices()));
}
export async function handleAuth(action: keyof ReturnType<typeof createAuthHandlers>, request: Request): Promise<Response> {
  try {
    const current = await getServices();
    return createAuthHandlers(current.auth, current.config)[action](request);
  } catch (error) { return apiError(error); }
}
