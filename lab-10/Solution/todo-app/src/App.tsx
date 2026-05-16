import React, { useState } from 'react';
import { TodoItem } from './components/types';
import { TaskInput } from './components/TaskInput';
import { TaskList } from './components/TaskList';
import { TaskStats } from './components/TaskStats';

function App() {
  // Инициализируем состояние. useState возвращает массив: [текущееЗначение, функцияОбновления].
  // Важно: в React мы никогда не мутируем состояние напрямую (например, todos.push()),
  // мы всегда используем setTodos для передачи нового массива, что вызывает рендер компонента.
  const [todos, setTodos] = useState<TodoItem[]>([
    { id: '1', title: 'Ознакомиться с React хуками', isDone: true },
    { id: '2', title: 'Создать To-Do List для лабы', isDone: false },
  ]);

  // Добавление новой задачи
  const addTodo = (title: string) => {
    const newTodo: TodoItem = {
      id: crypto.randomUUID(), // Генерируем уникальный ID
      title,
      isDone: false,
    };
    // Создаем новый массив на основе старого, добавляя в конец новый элемент (неизменяемый подход)
    setTodos([...todos, newTodo]);
  };

  // Удаление задачи
  const deleteTodo = (id: string) => {
    // filter() возвращает новый массив, исключая элементы, не прошедшие проверку
    // Таким образом мы соблюдаем принцип неизменяемости
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // Переключение статуса
  const toggleTodo = (id: string) => {
    // map() проходит по всем элементам и возвращает новый массив.
    // Если id совпадает, возвращаем новый объект задачи (...todo) с измененным статусом.
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isDone: !todo.isDone } : todo
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-white/50 p-8">
        <h1 className="text-4xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
          ✨ Мои Задачи
        </h1>

        <TaskInput onAddTodo={addTodo} />
        
        <TaskList 
          todos={todos} 
          onToggle={toggleTodo} 
          onDelete={deleteTodo} 
        />
        
        <TaskStats todos={todos} />
      </div>
    </div>
  );
}

export default App;
