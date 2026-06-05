import { useState, useEffect } from "react";
import TodoInput from "./components/TodoInput";
import TodoFilter from "./components/TodoFilter";
import TodoList from "./components/TodoList";
import TodoDateNav from "./components/TodoDateNav";

/**
 * 전역 헬퍼: Date 인스턴스를 'YYYY-MM-DD' 스트링으로 캐싱
 */
const formatDateToString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * 알고리즘: 인계받은 타겟 날짜의 해당 주차 월요일 날짜 객체를 깊은 복사 기반 추출
 */
const getMondayOfDate = (date) => {
  const target = new Date(date);
  const day = target.getDay(); // 0(일) ~ 6(토)
  // 월요일과의 간격 도출 (일요일일 경우 이전 주 월요일(-6)로 상쇄 처리)
  const diff = target.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(target.setDate(diff));
};

export default function App() {
  // [영속성] 기존 할 일 목록 바인딩 복원
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem("todos");
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  // [영속성 및 상태] 현재 포커싱된 특정 일자 (기본값: 오늘)
  const [currentDate, setCurrentDate] = useState(() => formatDateToString(new Date()));

  // [필터 상태] 완료 여부 파티셔닝 조건
  const [currentFilter, setCurrentFilter] = useState("all");

  // [신규: 주간 영속성 상태 제어] 이번 주 월요일 기준일 상태 관리 (새로고침 대응 영속화 구조)
  const [weekStartDate, setWeekStartDate] = useState(() => {
    const savedWeekStart = localStorage.getItem("weekStartDate");
    if (savedWeekStart) return savedWeekStart;
    
    // 저장된 주차가 없을 시 현시점 오늘 기준 주차의 월요일 연산 후 초기화
    return formatDateToString(getMondayOfDate(new Date()));
  });

  // [영속성 동기화 파이프라인] 할 일 데이터 상태 변동 시 로컬 캐시 자동 보존
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // [신규: 주간 기준일 동기화] 주차 스위칭 발생 시 로컬스토리지 데이터 자동 백업
  useEffect(() => {
    localStorage.setItem("weekStartDate", weekStartDate);
  }, [weekStartDate]);

  /**
   * 1. Create: 선택된 날짜(currentDate) 메타데이터를 매핑하여 할 일 추가
   */
  const handleCreateTodo = (text) => {
    const newTodo = {
      id: Date.now(),
      text: text,
      completed: false,
      date: currentDate,
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
   * [신규: 주차 점프 핸들러] 이전 주 / 다음 주로 주차 틀을 완전히 리매핑하는 가감 연산 함수
   * @param {number} daysOffset - 일주일 기준 이동량 (-7 또는 7)
   */
  const handleNavigateWeek = (daysOffset) => {
    const [year, month, day] = weekStartDate.split("-").map(Number);
    const nextWeekStart = new Date(year, month - 1, day);
    
    nextWeekStart.setDate(nextWeekStart.getDate() + daysOffset);
    setWeekStartDate(formatDateToString(nextWeekStart));
  };

  /**
   * [이중 조건 데이터 정제 파이프라인]
   * 캘린더에서 유저가 콕 집은 선택 일자(currentDate) 매칭 후 완료 유무 필터링 순차 연산
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

        {/* [업그레이드 완료] 주간 그리드 제어식 캘린더 내비게이션 바 컴포넌트 */}
        <TodoDateNav
          currentDate={currentDate}
          weekStartDate={weekStartDate}
          todos={todos}
          onSelectDate={setCurrentDate}
          onNavigateWeek={handleNavigateWeek}
        />

        <TodoInput onCreateTodo={handleCreateTodo} />

        <TodoFilter currentFilter={currentFilter} onChangeFilter={setCurrentFilter} />

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