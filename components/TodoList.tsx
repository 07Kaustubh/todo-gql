'use client';

import React, { useState } from 'react';
import { 
  useGetTodosQuery,
  useCreateTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation
} from '../generated/graphql';
import { Todo } from '../types/todo';
import { cn } from '../lib/utils';

export const TodoList: React.FC = () => {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  
  const { data, loading, error } = useGetTodosQuery();
  const [createTodo] = useCreateTodoMutation({
    refetchQueries: ['GetTodos']
  });
  const [updateTodo] = useUpdateTodoMutation();
  const [deleteTodo] = useDeleteTodoMutation({
    refetchQueries: ['GetTodos']
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;

    try {
      await createTodo({
        variables: { title: newTodoTitle }
      });
      setNewTodoTitle('');
    } catch (err) {
      console.error('Failed to create todo:', err);
    }
  };

  const handleToggle = async (id: string, completed: boolean) => {
    try {
      await updateTodo({
        variables: { id, completed: !completed }
      });
    } catch (err) {
      console.error('Failed to update todo:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTodo({
        variables: { id }
      });
    } catch (err) {
      console.error('Failed to delete todo:', err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Todo List</h1>
        
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={!newTodoTitle.trim()}
              className={cn(
                "px-6 py-3 rounded-lg font-medium transition-colors",
                newTodoTitle.trim()
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              )}
            >
              Add Todo
            </button>
          </div>
        </form>

        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">
            Error: {error.message}
          </div>
        )}

        <ul className="space-y-3">
          {data?.todos.map((todo: Todo) => (
            <li
              key={todo.id}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggle(todo.id, todo.completed)}
                className="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
              />
              <span
                className={cn(
                  "flex-1 text-gray-900 transition-all",
                  todo.completed && "line-through text-gray-500"
                )}
              >
                {todo.title}
              </span>
              <button
                onClick={() => handleDelete(todo.id)}
                className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 focus:opacity-100 transition-opacity"
                aria-label="Delete todo"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </li>
          ))}
        </ul>

        {data?.todos.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No todos yet. Add one above!
          </div>
        )}
      </div>
    </div>
  );
};

