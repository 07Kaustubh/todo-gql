export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TodosData {
  todos: Todo[];
}

export interface TodoVars {
  title: string;
}

export interface UpdateTodoVars {
  id: string;
  completed: boolean;
}

export interface DeleteTodoVars {
  id: string;
} 