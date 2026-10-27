import { stringify } from "csv-stringify/sync";
import type { PrismaClient } from "@/generated/prisma/client";
import type { Actor } from "@/shared/tasks";
import { createTaskService } from "../tasks/service";
import { readAllTasks } from "../tasks/query";
import { parseInput } from "../validation";
import { formatSchema, parseTaskImport, portableColumns } from "./schema";

function spreadsheetSafe(value: string) { return /^[\s\uFEFF]*[=+\-@]/.test(value) || /^[\t\r\n]/.test(value) ? `'${value}` : value; }
export function createTransferService(db: PrismaClient) {
  const tasks = createTaskService(db);
  return {
    async import(actor: Actor | null, bytes: Uint8Array, format: unknown) { return tasks.importMany(actor, parseTaskImport(bytes, format)); },
    async export(query: unknown, rawFormat: unknown) {
      const format = parseInput(formatSchema, rawFormat);
      const tasks = await readAllTasks(db, query);
      const rows = tasks.map(({ title, description, status, priority }) => ({ title, description, status, priority }));
      const text = format === "json" ? JSON.stringify(rows, null, 2) : stringify(rows.map((row) => ({ ...row, title: spreadsheetSafe(row.title), description: spreadsheetSafe(row.description) })), { header: true, columns: portableColumns, record_delimiter: "\r\n" });
      return { bytes: new TextEncoder().encode(text), contentType: format === "json" ? "application/json; charset=utf-8" : "text/csv; charset=utf-8" };
    },
  };
}
