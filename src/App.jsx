import { useState, useEffect } from "react";
import TodoInput from "./components/TodoInput";
import TodoFilter from "./components/TodoFilter";
import TodoList from "./components/TodoList";
import TodoDateNav from "./components/TodoDateNav"; // [신규 의존성 추가]

/**
 * Date 객체를 시스템 표준 포맷인 'YYYY-MM-DD' 문자열로 변환하는 전역 헬퍼 함수
 */
const formatDateToString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function App() {
  // [영속성 관리] 로컬스토리지에 저장된 기존 할 일이 있다면 복원, 없다면 빈 배열 기동
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem("todos");
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  // [필터 상태 관리] 현재 화면에 표시할 완료 상태 조건 (기본값: 'all')
  const [currentFilter, setCurrentFilter] = useState("all");

  // [신규: 날짜 상태 관리] 현재 선택된 일간 뷰 날짜 상태 (초기값: 오늘 날짜 'YYYY-MM-DD')
  const [currentDate, setCurrentDate] = useState(() => formatDateToString(new Date()));

  // [영속성 관리] todos 상태가 변경될 때마다 자동으로 로컬스토리지에 동기화
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  /**
   * 1. Create: 새로운 할 일을 배열에 추가하는 함수
   * (현재 선택되어 띄워져 있는 currentDate 정보를 매핑하여 저장합니다)
   */
  const handleCreateTodo = (text) => {
    const newTodo = {
      id: Date.now(), // 고유 식별용 타임스탬프
      text: text,
      completed: false,
      date: currentDate, // [신규 변동] 할 일이 귀속될 날짜 정보 주입
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
   * [신규: 날짜 조정 핸들러] 일수를 더하거나 빼서 날짜 상태를 유기적으로 변경하는 함수
   * @param {number} daysOffset - 변동할 일수 (이전 하루는 -1, 다음 하루는 1)
   */
  const handleNavigateDate = (daysOffset) => {
    const [year, month, day] = currentDate.split("-").map(Number);
    // 자바스크립트 Date의 월 매개변수는 0부터 시작하므로 1을 차감하여 객체 생성
    const targetDate = new Date(year, month - 1, day);
    
    // 날짜 연산 시 브라우저가 월말/월초 연산을 자동으로 안전하게 처리해줍니다.
    targetDate.setDate(targetDate.getDate() + daysOffset);
    
    // 연산된 결과를 다시 표준 문자열 포맷으로 변환하여 상태 갱신
    setCurrentDate(formatDateToString(targetDate));
  };

  /**
   * [데이터 필터링 이중 파이프라인] 
   * 1차 연산: 선택된 날짜와 일치하는 일기장 서랍을 먼저 필터링합니다.
   * 2차 연산: 서랍 안에서 전체 / 진행 중 / 완료 조건 탭에 매칭되는 데이터만 최종 추출합니다.
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
        
        {/* 헤더 타이틀 타이포그래피 */}
        <header className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Task Manager</h1>
          <p className="text-xs text-gray-400 mt-1">지속 가능한 하루의 몰입을 서포트합니다.</p>
        </header>

        {/* [신규 제어 장치] 일간 뷰 날짜 제어 탭 내비게이션 */}
        <TodoDateNav 
          currentDate={currentDate} 
          onNavigateDate={handleNavigateDate} 
        />

        {/* 할 일 입력 컨트롤러 */}
        <TodoInput onCreateTodo={handleCreateTodo} />

        {/* 상태별 필터 제어 탭 배너 */}
        <TodoFilter
          currentFilter={currentFilter}
          onChangeFilter={setCurrentFilter}
        />

        {/* 할 일 리스트 보드 (더블 필터링이 완료된 정제 배열 주입) */}
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