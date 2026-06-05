import { useState, useEffect } from "react";
import TodoInput from "./components/TodoInput";
import TodoList from "./components/TodoList";

export default function App() {
  // [초기화] 로컬스토리지에 저장된 기존 할 일이 있다면 복원, 없다면 빈 배열로 기동
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem("todos");
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  // [영속성 관리] todos 상태가 변경될 때마다 자동으로 로컬스토리지에 동기화
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  /**
   * 1. Create: 새로운 할 일을 배열 추가하는 함수
   */
  const handleCreateTodo = (text) => {
    const newTodo = {
      id: Date.now(), // 고유 식별을 위한 타임스탬프 ID 생성
      text: text,
      completed: false,
    };
    setTodos((prevTodos) => [...prevTodos, newTodo]);
  };

  /**
   * 2. Update (Toggle): 완료 여부를 반전시키는 토글 함수
   */
  const handleToggleComplete = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  /**
   * 3. Update (Text): 내용을 수정하는 텍스트 갱신 함수
   */
  const handleUpdateText = (id, newText) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, text: newText } : todo
      )
    );
  };

  /**
   * 4. Delete: 특정 항목을 식별해 배열에서 완전히 삭제하는 함수
   */
  const handleDeleteTodo = (id) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="min-h-screen flex items-start justify-center px-4 py-16">
      <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl border border-gray-50">
        
        {/* 헤더 타이틀 타이포그래피 */}
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Task Manager</h1>
          <p className="text-xs text-gray-400 mt-1">오늘도 몰입하는 하루를 만들어 볼까요?</p>
        </header>

        {/* 할 일 입력 컨트롤러 */}
        <TodoInput onCreateTodo={handleCreateTodo} />

        {/* 할 일 리스트 보드 */}
        <TodoList
          todos={todos}
          onToggleComplete={handleToggleComplete}
          onUpdateText={handleUpdateText}
          onDelete={handleDeleteTodo}
        />
        
      </div>
    </div>
  );
}