import type { PrismaClient } from "@/generated/prisma/client";
import type { ServerConfig } from "../config";
import { createApiAuthenticator } from "./api-key";
import { handleApi, jsonData } from "./http";
import { createTaskService } from "../tasks/service";
import { parseTaskQuery } from "../tasks/query";
import { taskDeleteBodySchema, taskUpdateBodySchema } from "../tasks/schema";
import { readJson } from "../security/origin";
import { parseInput } from "../validation";

export function createPublicApiHandlers(db: PrismaClient, config: Pick<ServerConfig, "publicApiKey" | "apiActorEmail">) {
  const authenticate = createApiAuthenticator(db, config); const tasks = createTaskService(db);
  return {
    list(request: Request) { return handleApi(async () => { await authenticate(request); return jsonData(await tasks.list(parseTaskQuery(new URL(request.url).searchParams))); }); },
    read(request: Request, id: string) { return handleApi(async () => { await authenticate(request); return jsonData(await tasks.read(id)); }); },
    create(request: Request) { return handleApi(async () => { const actor = await authenticate(request); return jsonData(await tasks.create(actor, await readJson(request)), 201); }); },
    update(request: Request, id: string) { return handleApi(async () => {
      const actor = await authenticate(request); const { version, ...patch } = parseInput(taskUpdateBodySchema, await readJson(request));
      return jsonData(await tasks.update(actor, id, patch, version));
    }); },
    remove(request: Request, id: string) { return handleApi(async () => {
      const actor = await authenticate(request); const { version } = parseInput(taskDeleteBodySchema, await readJson(request));
      await tasks.remove(actor, id, version); return new Response(null, { status: 204, headers: { "Cache-Control": "private, no-store" } });
    }); },
  };
}
