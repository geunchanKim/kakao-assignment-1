import TodoItem from "./TodoItem";

/**
 * Todo 리스트 배열을 순회하며 목록을 렌더링하는 컴포넌트
 */
export default function TodoList({ todos, onToggleComplete, onUpdateText, onDelete }) {
  // 등록된 할 일이 없을 경우 미니멀한 대체 가이드 UI 출력
  if (todos.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm text-gray-400">등록된 할 일이 없습니다.</p>
        <p className="text-xs text-gray-300 mt-1">새로운 작업을 추가해 생산성을 높여보세요!</p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggleComplete={onToggleComplete}
          onUpdateText={onUpdateText}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}