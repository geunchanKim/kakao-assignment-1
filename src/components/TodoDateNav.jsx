/**
 * 주간 뷰를 그리드로 렌더링하고 일자별 통계 및 선택을 제어하는 내비게이션 컴포넌트
 */
export default function TodoDateNav({
  currentDate,
  weekStartDate,
  todos,
  onSelectDate,
  onNavigateWeek,
}) {
  const daysOfWeek = ["월", "화", "수", "목", "금", "토", "일"];

  /**
   * 포맷팅 유틸리티: Date 객체를 YYYY-MM-DD 문자열로 스크리닝
   */
  const formatDateToString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  /**
   * 주간 날짜 배열 생성 알고리즘 (월요일 기점 + 7일 가중치 분배)
   */
  const generateWeekDays = () => {
    const baseDate = new Date(weekStartDate);
    return Array.from({ length: 7 }).map((_, index) => {
      const loopDate = new Date(baseDate);
      loopDate.setDate(baseDate.getDate() + index);
      return loopDate;
    });
  };

  const weekDays = generateWeekDays();
  const todayStr = formatDateToString(new Date()); // 시스템 오늘 날짜 추적

  return (
    <div className="mb-6 bg-purple-50/40 p-4 rounded-2xl border border-purple-100/30">
      
      {/* 1. 상단 라인: 주차 이동 컨트롤러 및 현재 년/월 표시 */}
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-sm font-bold text-gray-700 tracking-wide">
          {new Date(weekStartDate).getFullYear()}년 {new Date(weekStartDate).getMonth() + 1}월
        </h2>
        <div className="flex gap-1.5">
          <button
            onClick={() => onNavigateWeek(-7)}
            className="px-2.5 py-1 text-xs font-semibold text-gray-500 bg-white hover:text-brand rounded-lg shadow-xs border border-gray-100 transition-all cursor-pointer"
          >
            이전 주
          </button>
          <button
            onClick={() => onNavigateWeek(7)}
            className="px-2.5 py-1 text-xs font-semibold text-gray-500 bg-white hover:text-brand rounded-lg shadow-xs border border-gray-100 transition-all cursor-pointer"
          >
            다음 주
          </button>
        </div>
      </div>

      {/* 2. 하단 라인: 가로형 7일 주간 달력 그리드 보드 */}
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((dateObj, idx) => {
          const dateStr = formatDateToString(dateObj);
          
          const isSelected = currentDate === dateStr; // 현재 유저가 클릭해 채택한 날짜인가?
          const isToday = todayStr === dateStr;       // 실제 달력 기준 오늘인가?

          // [시계열 통계] 원본 데이터 풀에서 해당 요일 날짜 문자열과 부합하는 투두 개수 실시간 연산
          const dayTodoCount = todos.filter((todo) => todo.date === dateStr).length;

          return (
            <button
              key={dateStr}
              onClick={() => onSelectDate(dateStr)}
              className={`flex flex-col items-center py-2.5 rounded-xl transition-all cursor-pointer ${
                isSelected
                  ? "bg-brand text-white shadow-md transform scale-102" // 선택 상태
                  : isToday
                  ? "bg-purple-100/70 text-brand font-bold border border-purple-200/50" // 실제 오늘 날짜
                  : "hover:bg-gray-100/70 text-gray-600" // 평상시 기본 스타일
              }`}
            >
              {/* 요일 타이틀 (월~일) */}
              <span className={`text-[10px] uppercase tracking-wider mb-1 ${isSelected ? "text-purple-200" : "text-gray-400"}`}>
                {daysOfWeek[idx]}
              </span>
              
              {/* 일자 숫자 */}
              <span className="text-sm font-bold tracking-tight">
                {dateObj.getDate()}
              </span>

              {/* [실시간 데이터 집계 배지] 등록된 할 일이 있을 때만 표출 */}
              {dayTodoCount > 0 && (
                <span className={`inline-block w-4 h-4 text-[9px] font-extrabold rounded-full mt-1.5 flex items-center justify-center ${
                  isSelected ? "bg-white text-brand" : "bg-brand text-white"
                }`}>
                  {dayTodoCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

    </div>
  );
}