import React, { useState } from 'react';

interface TaskInputProps {
  onAddTodo: (title: string) => void;
}

export function TaskInput({ onAddTodo }: TaskInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    if (inputValue.trim()) {
      onAddTodo(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  return (
    <div className="flex gap-3 mb-8">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Что нужно сделать?"
        className="flex-grow px-5 py-3 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500 transition-all shadow-sm"
      />
      <button
        onClick={handleAdd}
        className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-md"
      >
        Добавить
      </button>
    </div>
  );
}
