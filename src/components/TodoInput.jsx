import { useState } from "react";

/**
 * 새로운 Todo 항목 생성을 담당하는 입력 폼 컴포넌트
 */
export default function TodoInput({ onCreateTodo }) {
  // 사용자가 입력 필드에 작성 중인 텍스트 상태
  const [inputValue, setInputValue] = useState("");

  /**
   * 폼이 제출(Submit)되었을 때 실행되는 핸들러 함수
   */
  const handleSubmit = (e) => {
    e.preventDefault(); // 기본 새로고침 이벤트 동작 방지

    // 공백 제외 검사 (비어있을 시 안내 메시지 출력)
    if (!inputValue.trim()) {
      alert("할 일을 입력해주세요! 빈 값은 저장할 수 없습니다.");
      return;
    }

    // 부모 컴포넌트에서 내려받은 등록 함수 실행
    onCreateTodo(inputValue.trim());
    
    // 입력창 초기화
    setInputValue("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="오늘의 할 일을 입력하세요..."
        className="flex-1 px-4 py-3 text-sm bg-white border border-gray-200 rounded-xl outline-none transition-all focus:border-brand focus:ring-1 focus:ring-brand"
      />
      <button
        type="submit"
        className="px-5 py-3 text-sm font-semibold text-white bg-brand hover:bg-brand-hover rounded-xl transition-colors shadow-xs"
      >
        추가
      </button>
    </form>
  );
}