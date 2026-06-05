/**
 * Todo 목록의 필터 상태(전체/진행 중/완료)를 변경하는 탭 컴포넌트
 */
export default function TodoFilter({ currentFilter, onChangeFilter }) {
  // 탭 메뉴 구성을 위한 설정 배열 (필터 키값과 화면에 보여줄 이름)
  const filterTabs = [
    { key: "all", label: "전체" },
    { key: "active", label: "진행 중" },
    { key: "completed", label: "완료" },
  ];

  return (
    <div className="flex bg-gray-100/80 p-1 rounded-xl mb-5">
      {filterTabs.map((tab) => {
        // 현재 순회 중인 탭이 활성화된 탭인지 여부 판별
        const isActive = currentFilter === tab.key;

        return (
          <button
            key={tab.key}
            onClick={() => onChangeFilter(tab.key)}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
              isActive
                ? "bg-brand text-white shadow-xs" // 활성화 탭: 메인 브랜드 컬러 배경 + 흰색 글씨 + 은은한 그림자
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50" // 비활성화 탭: 회색 글씨 + 마우스 호버 효과
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}