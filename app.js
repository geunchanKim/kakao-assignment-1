// --- 상태 관리 (State) ---
// Todo 데이터를 저장할 배열 객체
let todos = [];

// --- DOM 요소 선택 ---
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

// --- 핵심 기능 함수 (Functions) ---

/**
 * 상태 데이터를 기준으로 화면을 그리는 함수 (Render)
 */
function renderTodos() {
  // 기존 리스트 항목을 모두 비우기
  todoList.innerHTML = '';

  // todos 배열을 순회하며 HTML 요소 생성
  todos.forEach(todo => {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;

    // 내부 텍스트 노드 생성
    const span = document.createElement('span');
    span.className = 'todo-text';
    span.textContent = todo.text;
    li.appendChild(span);

    // 버튼 그룹 생성
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'button-group';

    // 1. 완료/취소 버튼
    const completeBtn = document.createElement('button');
    completeBtn.className = 'action-btn complete-btn';
    completeBtn.textContent = todo.completed ? '취소' : '완료';
    completeBtn.addEventListener('click', () => toggleTodoComplete(todo.id));
    buttonGroup.appendChild(completeBtn);

    // 2. 수정 버튼
    const editBtn = document.createElement('button');
    editBtn.className = 'action-btn edit-btn';
    editBtn.textContent = '수정';
    editBtn.addEventListener('click', () => editTodoText(todo.id));
    buttonGroup.appendChild(editBtn);

    // 3. 삭제 버튼
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'action-btn delete-btn';
    deleteBtn.textContent = '삭제';
    deleteBtn.addEventListener('click', () => deleteTodo(todo.id));
    buttonGroup.appendChild(deleteBtn);

    li.appendChild(buttonGroup);
    todoList.appendChild(li);
  });
}

/**
 * 새로운 Todo를 추가하는 함수 (Create)
 */
function addTodo(event) {
  // 폼 제출 시 페이지 새로고침 방지
  event.preventDefault();

  const text = todoInput.value.trim();

  // 유효성 검사: 빈 값 입력 차단
  if (!text) {
    alert('할 일을 입력해주세요!');
    todoInput.focus();
    return;
  }

  // 새로운 Todo 객체 정의
  const newTodo = {
    id: Date.now(), // 고유 ID값 생성용 타임스탬프
    text: text,
    completed: false
  };

  // 데이터 추가 및 화면 갱신
  todos.push(newTodo);
  renderTodos();

  // 입력창 초기화
  todoInput.value = '';
}

/**
 * Todo 완료 상태를 토글하는 함수 (Update - Toggle)
 */
function toggleTodoComplete(id) {
  todos = todos.map(todo => 
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
  renderTodos();
}

/**
 * Todo 내용을 수정하는 함수 (Update - Text)
 */
function editTodoText(id) {
  const targetTodo = todos.find(todo => todo.id === id);
  if (!targetTodo) return;

  // Prompt 창을 이용해 미니멀하게 새 텍스트 입력 유도
  const newText = prompt('수정할 내용을 입력하세요:', targetTodo.text);

  // 취소 버튼을 누르거나 공백만 입력한 경우 무시
  if (newText === null) return;
  if (!newText.trim()) {
    alert('내용을 입력해야 수정할 수 있습니다.');
    return;
  }

  targetTodo.text = newText.trim();
  renderTodos();
}

/**
 * Todo를 삭제하는 함수 (Delete)
 */
function deleteTodo(id) {
  todos = todos.filter(todo => todo.id !== id);
  renderTodos();
}

// --- 이벤트 리스너 등록 ---
todoForm.addEventListener('submit', addTodo);