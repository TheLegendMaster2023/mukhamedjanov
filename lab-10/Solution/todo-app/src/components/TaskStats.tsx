import React from 'react';
import { TodoItem } from './types';

interface TaskStatsProps {
  todos: TodoItem[];
}

export function TaskStats({ todos }: TaskStatsProps) {
  const total = todos.length;
  const completed = todos.filter(t => t.isDone).length;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <div className="flex justify-between items-center mb-2">
        <p className="text-gray-600 font-medium">Статистика выполнения:</p>
        <p className="text-indigo-600 font-bold">{completed} / {total}</p>
      </div>
      
      {/* Прогресс-бар */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2 overflow-hidden">
        <div 
          className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-xs text-gray-500 text-right">{progress}% завершено</p>
    </div>
  );
}
