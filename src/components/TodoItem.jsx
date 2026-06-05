import { useState } from "react";

/**
 * 개별 Todo 항목을 렌더링하고 관리하는 컴포넌트
 */
export default function TodoItem({ todo, onToggleComplete, onUpdateText, onDelete }) {
  // 현재 항목이 수정 모드인지 여부를 관리하는 상태
  const [isEditing, setIsEditing] = useState(false);
  // 수정 중인 텍스트를 임시로 담아두는 상태
  const [editValue, setEditValue] = useState(todo.text);

  /**
   * 수정 완료 버튼을 누르거나 엔터를 쳤을 때 변경 사항을 저장하는 함수
   */
  const handleSave = () => {
    if (!editValue.trim()) {
      alert("내용을 입력해주세요!");
      return;
    }
    onUpdateText(todo.id, editValue.trim());
    setIsEditing(false); // 수정 모드 종료
  };

  /**
   * 키보드 Enter 입력 시 저장을 유도하는 헬퍼 함수
   */
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSave();
  };

  return (
    <li className={`flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl shadow-xs transition-all hover:translate-y-[-1px] hover:shadow-md ${todo.completed ? "bg-gray-50 opacity-70" : ""}`}>
      
      {/* 왼쪽: 체크박스 + 텍스트 영역 */}
      <div className="flex items-center flex-1 min-w-0 gap-3">
        {/* 완료 토글 체크박스 */}
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggleComplete(todo.id)}
          className="w-5 h-5 rounded-md border-gray-300 text-brand focus:ring-brand accent-brand cursor-pointer"
        />

        {/* 조건부 렌더링: 수정 모드일 때는 input창, 아닐 때는 text 노출 */}
        {isEditing ? (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-brand"
            autoFocus
          />
        ) : (
          <span className={`text-sm text-gray-700 truncate ${todo.completed ? "line-through text-gray-400" : ""}`}>
            {todo.text}
          </span>
        )}
      </div>

      {/* 오른쪽: 액션 버튼 그룹 */}
      <div className="flex gap-1 ml-4 shrink-0">
        {isEditing ? (
          <button
            onClick={handleSave}
            className="px-2.5 py-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors"
          >
            저장
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            disabled={todo.completed}
            className="px-2.5 py-1.5 text-xs font-medium text-brand bg-purple-50 hover:bg-purple-100 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            수정
          </button>
        )}

        <button
          onClick={() => onDelete(todo.id)}
          className="px-2.5 py-1.5 text-xs font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-md transition-colors"
        >
          삭제
        </button>
      </div>
    </li>
  );
}