import { useState, useEffect } from "react";

/**
 * Todo 데이터의 상태 관리 및 로컬스토리지 동기화를 전담하는 커스텀 훅
 */
export function useTodos() {
  // 1. 로컬스토리지 기반 초기 상태 로딩
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem("todos");
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  // 2. 데이터 변경 시 자동 동기화 펙터
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // 3. CRUD 액션 비즈니스 로직들
  const createTodo = (text, date) => {
    const newTodo = {
      id: Date.now(),
      text,
      completed: false,
      date,
    };
    setTodos((prev) => [...prev, newTodo]);
  };

  const toggleComplete = (id) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
    );
  };

  const updateText = (id, newText) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, text: newText } : todo))
    );
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  return { todos, createTodo, toggleComplete, updateText, deleteTodo };
}