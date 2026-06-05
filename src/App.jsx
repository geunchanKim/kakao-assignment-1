import { useState, useEffect } from "react";
import TodoInput from "./components/TodoInput";
import TodoFilter from "./components/TodoFilter";
import TodoList from "./components/TodoList";

export default function App() {
  // [영속성 관리] 로컬스토리지에 저장된 기존 할 일이 있다면 복원, 없다면 빈 배열 기동
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem("todos");
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  // [필터 상태 관리] 현재 화면에 표시할 필터 조건 상태 (기본값: 'all')
  const [currentFilter, setCurrentFilter] = useState("all");

  // [영속성 관리] todos 상태가 변경될 때마다 자동으로 로컬스토리지에 동기화
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  /**
   * 1. Create: 새로운 할 일을 배열에 추가하는 함수
   * (추가 후에도 currentFilter 상태가 유지되므로 보던 화면이 유지됩니다)
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

  /**
   * [데이터 필터링 파이프라인] 
   * 원본 데이터(todos)를 훼손하지 않고, 현재 필터 상태에 맞는 항목만 실시간 계산하여 추출
   */
  const filteredTodos = todos.filter((todo) => {
    if (currentFilter === "active") return !todo.completed;   // 진행 중: 완료되지 않은 것만
    if (currentFilter === "completed") return todo.completed; // 완료: 완료된 것만
    return true; // 전체(all): 조건 없이 전부 반환
  });

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

        {/* [신규 추가] 상태별 필터 제어 탭 배너 */}
        <TodoFilter
          currentFilter={currentFilter}
          onChangeFilter={setCurrentFilter}
        />

        {/* 할 일 리스트 보드 (원본 todos 대신 필터링된 filteredTodos를 주입) */}
        <TodoList
          todos={filteredTodos}
          onToggleComplete={handleToggleComplete}
          onUpdateText={handleUpdateText}
          onDelete={handleDeleteTodo}
        />
        
      </div>
    </div>
  );
}