/**
 * 상단 날짜 표시 및 이전/다음 날짜 이동을 제어하는 내비게이션 컴포넌트
 */
export default function TodoDateNav({ currentDate, onNavigateDate }) {
  
  /**
   * YYYY-MM-DD 형식을 보기 좋은 한국어 날짜 형식으로 파싱하는 함수
   * 예: "2026-06-05" -> "2026년 06월 05일"
   */
  const formatKoreanDate = () => {
    const [year, month, day] = currentDate.split("-");
    return `${year}년 ${month}월 ${day}일`;
  };

  return (
    <div className="flex items-center justify-between mb-5 bg-purple-50/60 p-3 rounded-xl border border-purple-100/30">
      {/* 이전 날짜 이동 버튼 (-1일) */}
      <button
        onClick={() => onNavigateDate(-1)}
        className="p-2 text-gray-600 hover:text-brand hover:bg-white rounded-lg transition-all cursor-pointer shadow-xs border border-transparent hover:border-gray-100 font-semibold text-sm"
      >
        이전
      </button>

      {/* 현재 선택된 날짜 레이블 */}
      <span className="text-sm font-bold text-gray-800 tracking-wide">
        {formatKoreanDate()}
      </span>

      {/* 다음 날짜 이동 버튼 (+1일) */}
      <button
        onClick={() => onNavigateDate(1)}
        className="p-2 text-gray-600 hover:text-brand hover:bg-white rounded-lg transition-all cursor-pointer shadow-xs border border-transparent hover:border-gray-100 font-semibold text-sm"
      >
        다음
      </button>
    </div>
  );
}