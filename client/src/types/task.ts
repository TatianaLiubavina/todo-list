export type TaskStatus = "todo" | "in_progress" | "done";

export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  deadline: string;
  created_at?: string;
  // UI-only convenience flag (derived from status)
  isDone?: boolean;
}

export type TaskCreateInput = Omit<Task, "id" | "created_at">;

export type TaskUpdateInput = Partial<TaskCreateInput>;

