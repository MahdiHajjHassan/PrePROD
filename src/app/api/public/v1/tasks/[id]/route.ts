import { withServices } from "@/server/services";
import { createPublicApiHandlers } from "@/server/api/public";
type Context = { params: Promise<{ id: string }> };
export function GET(request: Request, context: Context) { return withServices(async ({ db, config }) => createPublicApiHandlers(db, config).read(request, (await context.params).id)); }
export function PUT(request: Request, context: Context) { return withServices(async ({ db, config }) => createPublicApiHandlers(db, config).update(request, (await context.params).id)); }
export function DELETE(request: Request, context: Context) { return withServices(async ({ db, config }) => createPublicApiHandlers(db, config).remove(request, (await context.params).id)); }
