export type Role = "MEMBER" | "ADMIN";
export type Actor = { id: string; role: Role };
export type TaskInput = {
  title: string; description: string;
  status: "OPEN" | "DONE"; priority: "LOW" | "NORMAL" | "HIGH";
};
export type TaskPatch = Partial<TaskInput>;
export type TaskDTO = TaskInput & {
  id: string; owner: { id: string; displayName: string };
  version: number; createdAt: string; updatedAt: string;
};
export type TaskQuery = {
  q?: string; status?: TaskInput["status"]; priority?: TaskInput["priority"];
  ownerId?: string;
  sort: "created_desc" | "created_asc" | "updated_desc" | "title_asc";
  page: number;
};
export type PaginatedTasks = { items: TaskDTO[]; total: number; page: number; pageSize: 25 };
