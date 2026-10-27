"use client";
import { useState } from "react";
export class RequestError extends Error {
  constructor(public code: string, public fields?: Record<string, string[]>) { super(code); }
}
export async function request<T = unknown>(url: string, method: string, data?: unknown): Promise<T> {
  let response: Response;
  try { response = await fetch(url, { method, credentials: "same-origin", headers: { "Content-Type": "application/json" }, ...(data === undefined ? {} : { body: JSON.stringify(data) }) }); }
  catch { throw new RequestError("NETWORK"); }
  return decodeResponse<T>(response);
}
export async function decodeResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) return undefined as T;
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new RequestError(result.error?.code ?? "INTERNAL", result.error?.fields);
  return result.data as T;
}
export function useMutation() {
  const [pending, setPending] = useState(false); const [error, setError] = useState<RequestError | null>(null); const [success, setSuccess] = useState(false);
  async function run(action: () => Promise<void>) {
    setPending(true); setError(null); setSuccess(false);
    try { await action(); setSuccess(true); } catch (error) { setError(error instanceof RequestError ? error : new RequestError("NETWORK")); }
    finally { setPending(false); }
  }
  return { pending, error, success, run, clear: () => { setError(null); setSuccess(false); } };
}
