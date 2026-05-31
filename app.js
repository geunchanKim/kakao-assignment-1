// --- 상태 관리 (State) ---
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

// 현재 사용자가 선택하여 조회 중인 상세 날짜 (기본값: 오늘)
let currentDate = new Date();
// 현재 주간 뷰의 기준이 되는 날짜 (주차 네비게이션용 변수)
let currentWeekPivot = new Date();

// --- DOM 요소 선택 ---
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const filterButtons = document.querySelectorAll('.filter-btn');

// 주간 뷰 관련 DOM 요소 선택
const monthDisplay = document.getElementById('month-display');
const daysContainer = document.getElementById('days-container');
const prevWeekBtn = document.getElementById('prev-week-btn');
const nextWeekBtn = document.getElementById('next-week-btn');

// --- 유틸리티 함수 (Utility Functions) ---

/**
 * 현재 todos 배열의 상태를 로컬스토리지에 영구 저장하는 함수
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
 * 특정 날짜가 속한 주의 월요일 Date 객체를 찾아 반환하는 함수
 */
function getMondayOfDate(dateObj) {
  const target = new Date(dateObj);
  const day = target.getDay();
  // 일요일(0)이면 -6일, 월~토(1~6)이면 1-day 만큼 뺀다
  const diff = target.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(target.setDate(diff));
}

// --- 핵심 기능 함수 (Functions) ---

/**
 * [추가] 주간 뷰 상단 캘린더 바를 생성하고 갱신하는 핵심 함수
 */
function renderWeeklyCalendar() {
  // 기존 컴포넌트 내부 초기화
  daysContainer.innerHTML = '';

  // 현재 주차 피벗 기준의 월요일 구하기
  const monday = getMondayOfDate(currentWeekPivot);
  
  // 상단 헤더 월/년도 가이드 타이틀 출력 동기화 (주의 중간인 목요일 기준으로 안전하게 연도/월 추출)
  const midWeekDate = new Date(monday);
  midWeekDate.setDate(monday.getDate() + 3);
  monthDisplay.textContent = `${midWeekDate.getFullYear()}년 ${String(midWeekDate.getMonth() + 1).padStart(2, '0')}월`;

  const weekDayNames = ['월', '화', '수', '목', '금', '토', '일'];
  const todayStr = formatDateToString(new Date());
  const selectedStr = formatDateToString(currentDate);

  // 월요일부터 일요일까지 7일 반복하며 컴포넌트 그리기
  for (let i = 0; i < 7; i++) {
    const loopDate = new Date(monday);
    loopDate.setDate(monday.getDate() + i);
    const loopDateStr = formatDateToString(loopDate);

    // 해당 날짜에 등록된 총 Todo 개수 카운트 계산
    const dayTodoCount = todos.filter(todo => todo.date === loopDateStr).length;

    // 날짜 카드 요소 생성
    const card = document.createElement('div');
    card.className = 'day-card';
    
    // 시각적 상태 조건 분기 적용 (오늘 및 선택된 날짜)
    if (loopDateStr === todayStr) card.classList.add('today');
    if (loopDateStr === selectedStr) card.classList.add('active');

    // 요일 라벨 생성
    const nameLabel = document.createElement('span');
    nameLabel.className = 'day-name';
    nameLabel.textContent = weekDayNames[i];
    card.appendChild(nameLabel);

    // 날짜 숫자 생성
    const numberLabel = document.createElement('span');
    numberLabel.className = 'day-number';
    numberLabel.textContent = loopDate.getDate();
    card.appendChild(numberLabel);

    // Todo 개수 배지 생성
    const countBadge = document.createElement('span');
    countBadge.className = 'todo-badge';
    countBadge.textContent = dayTodoCount;
    card.appendChild(countBadge);

    // 카드 클릭 시 해당 날짜 선택 처리 이벤트 위임 바인딩
    card.addEventListener('click', () => {
      currentDate = new Date(loopDate);
      currentWeekPivot = new Date(loopDate); // 클릭 시 해당 주차 고정
      renderWeeklyCalendar();
      renderTodos();
    });

    daysContainer.appendChild(card);
  }
}

/**
 * 날짜 및 탭 필터 상태를 기준으로 할 일 목록 화면을 그리는 함수 (Render)
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
    date: formatDateToString(currentDate) // 활성화된 카드 날짜 연동 저장
  };

  todos.push(newTodo);
  
  saveTodosToLocalStorage();
  renderWeeklyCalendar(); // [수정] 등록 시 할 일 수 실시간 상단 리프레시 반영
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
  
  saveTodosToLocalStorage();
  renderTodos();
}

/**
 * Todo를 삭제하는 함수 (Delete)
 */
function deleteTodo(id) {
  todos = todos.filter(todo => todo.id !== id);
  
  saveTodosToLocalStorage();
  renderWeeklyCalendar(); // [수정] 삭제 시 할 일 수 실시간 상단 리프레시 반영
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
 * [추가] 주차 단위를 이전/다음으로 넘겨주는 네비게이션 함수
 * @param {number} weekOffset - 주 단위 변동 수치 (-1 주 전 또는 +1 주 후)
 */
function handleWeekNavigate(weekOffset) {
  currentWeekPivot.setDate(currentWeekPivot.getDate() + (weekOffset * 7));
  renderWeeklyCalendar();
}

// --- 이벤트 리스너 등록 ---
todoForm.addEventListener('submit', addTodo);

filterButtons.forEach(btn => {
  btn.addEventListener('click', changeFilter);
});

// [추가] 주차 체인저 네비게이션 버튼 이벤트 바인딩
prevWeekBtn.addEventListener('click', () => handleWeekNavigate(-1));
nextWeekBtn.addEventListener('click', () => handleWeekNavigate(1));

// --- 초기화 구문 (App Init) ---
renderWeeklyCalendar();
renderTodos();