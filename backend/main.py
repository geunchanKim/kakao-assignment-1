import os
from datetime import datetime
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, Response, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import Boolean, Column, DateTime, Integer, String, create_engine
from sqlalchemy.orm import Session, declarative_base, sessionmaker


# =========================
# 환경 변수 설정
# =========================

# backend/.env.local 파일을 불러옵니다.
# Python은 Next.js처럼 .env.local을 자동으로 읽지 않기 때문에 이 설정이 필요합니다.
env_path = Path(__file__).resolve().parent / ".env.local"
load_dotenv(dotenv_path=env_path)

# .env.local에 적어둔 변수명을 그대로 가져와서 사용합니다.
DATABASE_URL = os.getenv("DATABASE_URL")
FRONTEND_URL = os.getenv("FRONTEND_URL")
API_TITLE = os.getenv("API_TITLE")


# =========================
# DB 설정
# =========================

# SQLite DB 연결을 생성합니다.
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
)

# 요청마다 DB 세션을 생성하기 위한 설정입니다.
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

# SQLAlchemy 모델이 상속받을 기본 클래스입니다.
Base = declarative_base()


# =========================
# DB 모델
# =========================

class Todo(Base):
    """
    todos 테이블 구조를 정의하는 DB 모델입니다.
    """

    __tablename__ = "todos"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False)
    description = Column(String(500), nullable=True)
    is_completed = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )


# =========================
# Pydantic 스키마
# =========================

class TodoCreate(BaseModel):
    """
    Todo 생성 요청 데이터입니다.
    POST /todos에서 사용합니다.
    """

    title: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(default=None, max_length=500)


class TodoUpdate(BaseModel):
    """
    Todo 수정 요청 데이터입니다.
    PUT /todos/{id}에서 사용합니다.
    """

    title: Optional[str] = Field(default=None, min_length=1, max_length=100)
    description: Optional[str] = Field(default=None, max_length=500)
    is_completed: Optional[bool] = None


class TodoResponse(BaseModel):
    """
    Todo 응답 데이터입니다.
    """

    id: int
    title: str
    description: Optional[str]
    is_completed: bool
    created_at: datetime
    updated_at: datetime

    # Pydantic v2에서 SQLAlchemy 객체를 응답으로 변환하기 위한 설정입니다.
    model_config = ConfigDict(from_attributes=True)


# =========================
# 테이블 생성
# =========================

Base.metadata.create_all(bind=engine)


# =========================
# FastAPI 앱 생성
# =========================

app = FastAPI(title=API_TITLE)


# =========================
# CORS 설정
# =========================

# .env.local의 FRONTEND_URL 값을 그대로 사용합니다.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)


# =========================
# DB 세션 의존성
# =========================

def get_db():
    """
    API 요청마다 DB 세션을 생성하고,
    요청이 끝나면 세션을 닫습니다.
    """

    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# =========================
# 공통 함수
# =========================

def find_todo_or_404(db: Session, todo_id: int) -> Todo:
    """
    id로 Todo를 조회하고,
    존재하지 않으면 404 에러를 발생시킵니다.
    """

    todo = db.query(Todo).filter(Todo.id == todo_id).first()

    if todo is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Todo를 찾을 수 없습니다.",
        )

    return todo


# =========================
# CRUD 엔드포인트
# =========================

@app.get("/todos", response_model=list[TodoResponse])
def get_todos(db: Session = Depends(get_db)):
    """
    전체 Todo 목록을 조회합니다.
    """

    todos = db.query(Todo).order_by(Todo.id.desc()).all()
    return todos


@app.post(
    "/todos",
    response_model=TodoResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_todo(
    todo_create: TodoCreate,
    db: Session = Depends(get_db),
):
    """
    새 Todo를 생성합니다.
    """

    new_todo = Todo(
        title=todo_create.title,
        description=todo_create.description,
        is_completed=False,
    )

    db.add(new_todo)
    db.commit()
    db.refresh(new_todo)

    return new_todo


@app.put("/todos/{id}", response_model=TodoResponse)
def update_todo(
    id: int,
    todo_update: TodoUpdate,
    db: Session = Depends(get_db),
):
    """
    기존 Todo를 수정합니다.
    """

    todo = find_todo_or_404(db=db, todo_id=id)

    # 요청에 포함된 값만 골라서 수정합니다.
    update_data = todo_update.model_dump(exclude_unset=True)

    for field_name, field_value in update_data.items():
        setattr(todo, field_name, field_value)

    todo.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(todo)

    return todo


@app.delete(
    "/todos/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_todo(
    id: int,
    db: Session = Depends(get_db),
):
    """
    Todo를 삭제합니다.
    """

    todo = find_todo_or_404(db=db, todo_id=id)

    db.delete(todo)
    db.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)