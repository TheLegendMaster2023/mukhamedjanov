import React from 'react';
import { TodoItem as TodoItemType } from './types';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  todos: TodoItemType[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskList({ todos, onToggle, onDelete }: TaskListProps) {
  if (todos.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
        <p className="text-gray-500 text-lg">Список задач пуст</p>
        <p className="text-gray-400 text-sm mt-2">Самое время добавить что-то новое!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {todos.map((todo) => (
        <TaskItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
