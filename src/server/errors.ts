import type { ErrorCode, ErrorFields } from "@/shared/errors";

export class DomainError extends Error {
  constructor(public readonly code: ErrorCode, public readonly fields?: ErrorFields) {
    super(code);
    this.name = "DomainError";
  }
}
