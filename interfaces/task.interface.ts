export interface ITask {
  title: string;
  description: string;
  status: "TODO" | "IN_PROGRESS" | "COMPLETED";
  priority: "NORMAL" | "HIGH" | "LOW";
  dueDate: Date;
}
