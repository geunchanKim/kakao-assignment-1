import { useState, useEffect } from "react";
import TodoInput from "./components/TodoInput";
import TodoFilter from "./components/TodoFilter";
import TodoList from "./components/TodoList";
import TodoDateNav from "./components/TodoDateNav";

// 1단계에서 만든 날짜 유틸리티 함수 임포트
import { formatDateToString, getMondayOfDate } from "./utils/date";

export default function App() {
  // [영속성] 기존 할 일 목록 로컬스토리지 복원
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem("todos");
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  // [UI 상태] 현재 포커싱된 특정 일자 (기본값: 오늘)
  const [currentDate, setCurrentDate] = useState(() => formatDateToString(new Date()));

  // [UI 상태] 완료 여부 필터 조건 ('all', 'active', 'completed')
  const [currentFilter, setCurrentFilter] = useState("all");

  // [UI 상태] 주간 뷰 기준일 상태 관리 (새로고침 대응 영속화)
  const [weekStartDate, setWeekStartDate] = useState(() => {
    const savedWeekStart = localStorage.getItem("weekStartDate");
    return savedWeekStart || formatDateToString(getMondayOfDate(new Date()));
  });

  // 할 일 목록 데이터 변경 시 로컬스토리지 자동 저장
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // 주간 뷰 기준일 변경 시 로컬스토리지 자동 저장
  useEffect(() => {
    localStorage.setItem("weekStartDate", weekStartDate);
  }, [weekStartDate]);

  /**
   * 1. Create: 선택된 날짜(currentDate)를 주입하여 새로운 할 일 추가
   */
  const handleCreateTodo = (text) => {
    const newTodo = {
      id: Date.now(),
      text: text,
      completed: false,
      date: currentDate, // 할 일이 어떤 날짜에 생성되었는지 기록
    };
    setTodos((prevTodos) => [...prevTodos, newTodo]);
  };

  const handleToggleComplete = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
    );
  };

  const handleUpdateText = (id, newText) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) => (todo.id === id ? { ...todo, text: newText } : todo))
    );
  };

  const handleDeleteTodo = (id) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  /**
   * 주차 이동 핸들러 (유틸리티 함수를 기반으로 깔끔하게 처리)
   */
  const handleNavigateWeek = (daysOffset) => {
    const [year, month, day] = weekStartDate.split("-").map(Number);
    const nextWeekStart = new Date(year, month - 1, day);
    
    nextWeekStart.setDate(nextWeekStart.getDate() + daysOffset);
    setWeekStartDate(formatDateToString(nextWeekStart));
  };

  /**
   * [이중 필터링 파이프라인] 선택 날짜 필터링 -> 완료 상태 필터링
   */
  const filteredTodos = todos
    .filter((todo) => todo.date === currentDate)
    .filter((todo) => {
      if (currentFilter === "active") return !todo.completed;
      if (currentFilter === "completed") return todo.completed;
      return true;
    });

  return (
    <div className="min-h-screen flex items-start justify-center px-4 py-16">
      <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl border border-gray-50">
        
        <header className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Task Manager</h1>
          <p className="text-xs text-gray-400 mt-1">지속 가능한 하루의 몰입을 서포트합니다.</p>
        </header>

        {/* 주간 그리드 캘린더 내비게이션 바 */}
        <TodoDateNav
          currentDate={currentDate}
          weekStartDate={weekStartDate}
          todos={todos}
          onSelectDate={setCurrentDate}
          onNavigateWeek={handleNavigateWeek}
        />

        {/* 할 일 입력 컨트롤러 */}
        <TodoInput onCreateTodo={handleCreateTodo} />

        {/* 상태별 필터 탭 바 */}
        <TodoFilter currentFilter={currentFilter} onChangeFilter={setCurrentFilter} />

        {/* 할 일 목록 보드 */}
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