import type { TaskService } from "./service";
import type { AuthService } from "../auth/service";
import type { ServerConfig } from "../config";
import { requestActor } from "../auth/policy";
import { handleApi, jsonData } from "../api/http";
import { DomainError } from "../errors";
import { readJson, requireSameOrigin } from "../security/origin";
import { parseInput } from "../validation";
import { taskDeleteBodySchema, taskUpdateBodySchema } from "./schema";

export function createTaskHandlers(tasks: TaskService, auth: AuthService, config: Pick<ServerConfig, "appOrigin">) {
  async function body(request: Request) { requireSameOrigin(request, config.appOrigin); return readJson(request); }
  return {
    list(request: Request) { return handleApi(async () => {
      // Query parsing and full search/filter/sort/pagination are Joseph J03.
      if ([...new URL(request.url).searchParams].length) throw new DomainError("VALIDATION", { query: ["unavailable"] });
      return jsonData(await tasks.list());
    }); },
    read(_request: Request, id: string) { return handleApi(async () => jsonData(await tasks.read(id))); },
    create(request: Request) { return handleApi(async () => {
      const input = await body(request);
      return jsonData(await tasks.create(await requestActor(request, auth), input), 201);
    }); },
    update(request: Request, id: string) { return handleApi(async () => {
      const { version, ...patch } = parseInput(taskUpdateBodySchema, await body(request));
      return jsonData(await tasks.update(await requestActor(request, auth), id, patch, version));
    }); },
    remove(request: Request, id: string) { return handleApi(async () => {
      const { version } = parseInput(taskDeleteBodySchema, await body(request));
      await tasks.remove(await requestActor(request, auth), id, version);
      return new Response(null, { status: 204, headers: { "Cache-Control": "private, no-store" } });
    }); },
  };
}
