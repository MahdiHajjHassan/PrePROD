import { DomainError } from "../errors";
import { parseInput } from "../validation";
import { formatSchema } from "./schema";

export function transferFormat(url: URL, importOnly = false) {
  if (url.searchParams.getAll("format").length !== 1 || (importOnly && [...url.searchParams.keys()].some((key) => key !== "format"))) throw new DomainError("VALIDATION", { format: ["invalid"] });
  return parseInput(formatSchema, url.searchParams.get("format"));
}
export async function readImportBody(request: Request, format: "json" | "csv") {
  const contentType = request.headers.get("Content-Type")?.split(";")[0].trim().toLowerCase();
  if (contentType !== (format === "json" ? "application/json" : "text/csv")) throw new DomainError("VALIDATION", { file: ["invalid_content_type"] });
  const max = 256 * 1024; const length = request.headers.get("Content-Length");
  if (length && (!/^[0-9]+$/.test(length) || Number(length) > max)) throw new DomainError("VALIDATION", { file: ["too_large"] });
  if (!request.body) throw new DomainError("VALIDATION", { file: ["empty"] });
  const reader = request.body.getReader(); const chunks: Uint8Array[] = []; let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read(); if (done) break;
      size += value.byteLength; if (size > max) { await reader.cancel(); throw new DomainError("VALIDATION", { file: ["too_large"] }); }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size); let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    return bytes;
  } finally { reader.releaseLock(); }
}
