// --- 상태 관리 (State) ---
let todos = [];
// 현재 어떤 필터가 선택되어 있는지 저장하는 상태 추가 ('all', 'active', 'completed')
let currentFilter = 'all';

// --- DOM 요소 선택 ---
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
// 필터 버튼들을 모두 선택
const filterButtons = document.querySelectorAll('.filter-btn');

// --- 핵심 기능 함수 (Functions) ---

/**
 * 상태 데이터를 기준으로 화면을 그리는 함수 (Render)
 */
function renderTodos() {
  // 기존 리스트 항목을 모두 비우기
  todoList.innerHTML = '';

  // 현재 필터 상태에 맞게 데이터 필터링
  const filteredTodos = todos.filter(todo => {
    if (currentFilter === 'active') return !todo.completed;   // 진행 중: 완료되지 않은 것만
    if (currentFilter === 'completed') return todo.completed; // 완료: 완료된 것만
    return true;                                              // 전체: 모두 반환
  });

  // 필터링된 배열을 순회하며 HTML 요소 생성
  filteredTodos.forEach(todo => {
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
  event.preventDefault();

  const text = todoInput.value.trim();

  if (!text) {
    alert('할 일을 입력해주세요!');
    todoInput.focus();
    return;
  }

  const newTodo = {
    id: Date.now(),
    text: text,
    completed: false
  };

  todos.push(newTodo);
  renderTodos();

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

  const newText = prompt('수정할 내용을 입력하세요:', targetTodo.text);

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

/**
 * 필터 탭을 변경하고 스타일을 갱신하는 함수
 */
function changeFilter(event) {
  // 클릭된 버튼의 data-filter 값 가져오기
  currentFilter = event.target.dataset.filter;

  // 모든 필터 버튼에서 active 클래스 제거 후, 클릭된 버튼에만 추가
  filterButtons.forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');

  // 필터가 변경되었으므로 리스트 다시 그리기
  renderTodos();
}

// --- 이벤트 리스너 등록 ---
todoForm.addEventListener('submit', addTodo);

// 각 필터 버튼에 클릭 이벤트 리스너 일괄 등록
filterButtons.forEach(btn => {
  btn.addEventListener('click', changeFilter);
});