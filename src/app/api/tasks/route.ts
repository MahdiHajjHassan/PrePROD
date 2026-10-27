import { handleTask } from "@/server/services";
export function GET(request: Request) { return handleTask("list", request); }
export function POST(request: Request) { return handleTask("create", request); }
