import { useState, useEffect } from "react";
import TodoInput from "./components/TodoInput";
import TodoFilter from "./components/TodoFilter";
import TodoList from "./components/TodoList";
import TodoDateNav from "./components/TodoDateNav";

// 리팩토링으로 신설한 유틸리티 및 커스텀 훅 임포트
import { formatDateToString, getMondayOfDate } from "./utils/date";
import { useTodos } from "./hooks/useTodos";

export default function App() {
  // [비즈니스 로직 레이어 분리] 데이터와 핵심 액션을 훅에서 가져옵니다.
  const { todos, createTodo, toggleComplete, updateText, deleteTodo } = useTodos();

  // [UI 상태 관리] 화면 전환에 필요한 순수 기획 상태들만 잔존
  const [currentDate, setCurrentDate] = useState(() => formatDateToString(new Date()));
  const [currentFilter, setCurrentFilter] = useState("all");
  const [weekStartDate, setWeekStartDate] = useState(() => {
    const savedWeekStart = localStorage.getItem("weekStartDate");
    return savedWeekStart || formatDateToString(getMondayOfDate(new Date()));
  });

  // 주간 뷰 기준일 로컬스토리지 동기화
  useEffect(() => {
    localStorage.setItem("weekStartDate", weekStartDate);
  }, [weekStartDate]);

  /**
   * 주차 이동 핸들러 (연산 로직을 유틸리티 함수를 활용해 명확하게 리팩토링)
   */
  const handleNavigateWeek = (daysOffset) => {
    const [year, month, day] = weekStartDate.split("-").map(Number);
    const nextWeekStart = new Date(year, month - 1, day);
    nextWeekStart.setDate(nextWeekStart.getDate() + daysOffset);
    setWeekStartDate(formatDateToString(nextWeekStart));
  };

  /**
   * [이중 필터링 데이터 파이프라인] 화면 렌더링용 실시간 정제 데이터 연산
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

        {/* 주간 캘린더 내비게이션 바 */}
        <TodoDateNav
          currentDate={currentDate}
          weekStartDate={weekStartDate}
          todos={todos}
          onSelectDate={setCurrentDate}
          onNavigateWeek={handleNavigateWeek}
        />

        {/* 할 일 입력 컨트롤러 (현재 선택 날짜를 인자로 함께 주입하도록 훅과 연동) */}
        <TodoInput onCreateTodo={(text) => createTodo(text, currentDate)} />

        {/* 상태별 필터 제어 탭 배너 */}
        <TodoFilter currentFilter={currentFilter} onChangeFilter={setCurrentFilter} />

        {/* 할 일 리스트 보드 */}
        <TodoList
          todos={filteredTodos}
          onToggleComplete={toggleComplete}
          onUpdateText={updateText}
          onDelete={deleteTodo}
        />
        
      </div>
    </div>
  );
}