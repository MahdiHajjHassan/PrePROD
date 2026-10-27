import { parse } from "csv-parse/sync";
import { z } from "zod";
import { DomainError } from "../errors";
import { parseInput } from "../validation";
import { taskPortableSchema } from "../tasks/schema";

export const formatSchema = z.enum(["json", "csv"]);
export const portableColumns = ["title", "description", "status", "priority"];
export function parseTaskImport(bytes: Uint8Array, rawFormat: unknown) {
  const format = parseInput(formatSchema, rawFormat);
  if (bytes.byteLength > 256 * 1024) throw new DomainError("VALIDATION", { file: ["too_large"] });
  let text: string;
  try { text = new TextDecoder("utf-8", { fatal: true }).decode(bytes); }
  catch { throw new DomainError("VALIDATION", { file: ["invalid_utf8"] }); }
  let rows: unknown;
  try {
    rows = format === "json" ? JSON.parse(text) : parse(text, { bom: true, skip_empty_lines: true, columns: (headers: string[]) => {
      if (headers.length !== portableColumns.length || headers.some((value, index) => value !== portableColumns[index])) throw new DomainError("VALIDATION", { file: ["invalid_columns"] });
      return headers;
    } });
  } catch (error) {
    if (error instanceof DomainError) throw error;
    throw new DomainError("VALIDATION", { file: [format === "json" ? "invalid_json" : "invalid_csv"] });
  }
  return parseInput(z.array(taskPortableSchema).min(1).max(200), rows);
}
