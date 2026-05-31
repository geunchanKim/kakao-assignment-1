// --- 상태 관리 (State) ---
// [수정] 앱이 실행될 때 로컬스토리지에서 기존 데이터를 파싱하여 불러옴. 데이터가 없다면 빈 배열 초기화.
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';
let currentDate = new Date();

// --- DOM 요소 선택 ---
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const filterButtons = document.querySelectorAll('.filter-btn');

const dateDisplay = document.getElementById('current-date-display');
const prevDateBtn = document.getElementById('prev-date-btn');
const nextDateBtn = document.getElementById('next-date-btn');

// --- 유틸리티 함수 (Utility Functions) ---

/**
 * [추가] 현재 todos 배열의 상태를 문자열로 직렬화하여 로컬스토리지에 영구 저장하는 함수
 */
function saveTodosToLocalStorage() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

/**
 * Date 객체를 고유 식별용 'YYYY-MM-DD' 문자열 포맷으로 변환하는 함수
 */
function formatDateToString(dateObj) {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Date 객체를 화면 표시용 포맷('YYYY년 MM월 DD일 (요일)')으로 변환하는 함수
 */
function formatDateToDisplay(dateObj) {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
  const dayOfWeek = weekDays[dateObj.getDay()];
  
  return `${year}년 ${month}월 ${day}일 (${dayOfWeek})`;
}

/**
 * 상단 날짜 텍스트 뷰를 동기화하는 함수
 */
function updateDateView() {
  dateDisplay.textContent = formatDateToDisplay(currentDate);
}

// --- 핵심 기능 함수 (Functions) ---

/**
 * 날짜 및 탭 필터 상태를 기준으로 화면을 그리는 함수 (Render)
 */
function renderTodos() {
  todoList.innerHTML = '';

  const targetDateStr = formatDateToString(currentDate);

  const filteredTodos = todos.filter(todo => {
    if (todo.date !== targetDateStr) return false;
    
    if (currentFilter === 'active') return !todo.completed;
    if (currentFilter === 'completed') return todo.completed;
    return true;
  });

  filteredTodos.forEach(todo => {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;

    const span = document.createElement('span');
    span.className = 'todo-text';
    span.textContent = todo.text;
    li.appendChild(span);

    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'button-group';

    const completeBtn = document.createElement('button');
    completeBtn.className = 'action-btn complete-btn';
    completeBtn.textContent = todo.completed ? '취소' : '완료';
    completeBtn.addEventListener('click', () => toggleTodoComplete(todo.id));
    buttonGroup.appendChild(completeBtn);

    const editBtn = document.createElement('button');
    editBtn.className = 'action-btn edit-btn';
    editBtn.textContent = '수정';
    editBtn.addEventListener('click', () => editTodoText(todo.id));
    buttonGroup.appendChild(editBtn);

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
    completed: false,
    date: formatDateToString(currentDate)
  };

  todos.push(newTodo);
  
  // 데이터 변경에 따른 로컬스토리지 저장 및 화면 동기화
  saveTodosToLocalStorage();
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
  
  // 데이터 변경에 따른 로컬스토리지 저장 및 화면 동기화
  saveTodosToLocalStorage();
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
  
  // 데이터 변경에 따른 로컬스토리지 저장 및 화면 동기화
  saveTodosToLocalStorage();
  renderTodos();
}

/**
 * Todo를 삭제하는 함수 (Delete)
 */
function deleteTodo(id) {
  todos = todos.filter(todo => todo.id !== id);
  
  // 데이터 변경에 따른 로컬스토리지 저장 및 화면 동기화
  saveTodosToLocalStorage();
  renderTodos();
}

/**
 * 필터 탭을 변경하고 스타일을 갱신하는 함수
 */
function changeFilter(event) {
  currentFilter = event.target.dataset.filter;
  filterButtons.forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  renderTodos();
}

/**
 * 이전/다음 날짜로 상태를 이동시키는 함수
 */
function handleDateNavigate(offset) {
  currentDate.setDate(currentDate.getDate() + offset);
  updateDateView();
  renderTodos();
}

// --- 이벤트 리스너 등록 ---
todoForm.addEventListener('submit', addTodo);

filterButtons.forEach(btn => {
  btn.addEventListener('click', changeFilter);
});

prevDateBtn.addEventListener('click', () => handleDateNavigate(-1));
nextDateBtn.addEventListener('click', () => handleDateNavigate(1));

// --- 초기화 구문 (App Init) ---
updateDateView();
// [설명] 로컬스토리지로부터 파싱되어 셋업된 초기 todos 데이터를 바인딩하여 첫 렌더링 수행
renderTodos();