import { withServices } from "@/server/services";
import { createPublicApiHandlers } from "@/server/api/public";
export function GET(request: Request) { return withServices(async ({ db, config }) => createPublicApiHandlers(db, config).list(request)); }
export function POST(request: Request) { return withServices(async ({ db, config }) => createPublicApiHandlers(db, config).create(request)); }
