import { handleTask } from "@/server/services";
type Context = { params: Promise<{ id: string }> };
export async function GET(request: Request, context: Context) { return handleTask("read", request, (await context.params).id); }
export async function PUT(request: Request, context: Context) { return handleTask("update", request, (await context.params).id); }
export async function DELETE(request: Request, context: Context) { return handleTask("remove", request, (await context.params).id); }
