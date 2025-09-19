export interface Todo {
  id: number;
  text: string;
  isCompleted: boolean;
  createdBy: number;
  createdByUsername?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
