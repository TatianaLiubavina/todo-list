from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Literal
from datetime import datetime
import json
from pathlib import Path
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Путь к файлу с данными
DATA_FILE = Path(__file__).parent / "tasks.json"


# Модель задачи — описывает структуру данных
class Task(BaseModel):
    id: int
    title: str
    description: str
    status: Literal["todo", "in_progress", "done"]
    priority: Literal["low", "medium", "high"]
    deadline: str
    created_at: str


# Для создания задачи id и created_at не нужны — сервер добавит сам
class TaskCreate(BaseModel):
    title: str
    description: str
    status: Literal["todo", "in_progress", "done"] = "todo"
    priority: Literal["low", "medium", "high"] = "medium"
    deadline: str


def load_tasks() -> list[dict]:
    """Читаем задачи из JSON файла"""
    if not DATA_FILE.exists():
        return []
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def save_tasks(tasks: list[dict]) -> None:
    """Сохраняем задачи в JSON файл"""
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(tasks, f, ensure_ascii=False, indent=2)


def get_next_id(tasks: list[dict]) -> int:
    """Находим следующий свободный id"""
    if not tasks:
        return 1
    return max(t["id"] for t in tasks) + 1


@app.get("/tasks")
def get_tasks():
    """Получить все задачи"""
    tasks = load_tasks()
    return tasks


@app.get("/tasks/{task_id}")
def get_task(task_id: int):
    """Получить одну задачу по id"""
    tasks = load_tasks()
    for task in tasks:
        if task["id"] == task_id:
            return task
    raise HTTPException(status_code=404, detail="Задача не найдена")


@app.post("/tasks")
def create_task(task: TaskCreate):
    """Создать новую задачу"""
    tasks = load_tasks()
    now = datetime.now().strftime("%Y-%m-%dT%H:%M:%S")
    new_task = {
        "id": get_next_id(tasks),
        "title": task.title,
        "description": task.description,
        "status": task.status,
        "priority": task.priority,
        "deadline": task.deadline,
        "created_at": now,
    }
    tasks.append(new_task)
    save_tasks(tasks)
    return new_task


@app.put("/tasks/{task_id}")
def update_task(task_id: int, task: TaskCreate):
    """Обновить задачу"""
    tasks = load_tasks()
    for i, t in enumerate(tasks):
        if t["id"] == task_id:
            tasks[i] = {
                "id": task_id,
                "title": task.title,
                "description": task.description,
                "status": task.status,
                "priority": task.priority,
                "deadline": task.deadline,
                "created_at": t["created_at"],  # дату создания не меняем
            }
            save_tasks(tasks)
            return tasks[i]
    raise HTTPException(status_code=404, detail="Задача не найдена")


@app.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    """Удалить задачу"""
    tasks = load_tasks()
    for i, t in enumerate(tasks):
        if t["id"] == task_id:
            tasks.pop(i)
            save_tasks(tasks)
            return {"message": "Задача удалена"}
    raise HTTPException(status_code=404, detail="Задача не найдена")
