import json
from datetime import datetime
from pathlib import Path

from domain.task_models import TaskCreate


DATA_FILE = Path(__file__).resolve().parent.parent / "tasks.json"


class TaskNotFoundError(Exception):
    pass


def load_tasks() -> list[dict]:
    if not DATA_FILE.exists():
        return []
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def save_tasks(tasks: list[dict]) -> None:
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(tasks, f, ensure_ascii=False, indent=2)


def get_next_id(tasks: list[dict]) -> int:
    if not tasks:
        return 1
    return max(t["id"] for t in tasks) + 1


def get_all_tasks() -> list[dict]:
    return load_tasks()


def get_task_by_id(task_id: int) -> dict:
    tasks = load_tasks()
    for task in tasks:
        if task["id"] == task_id:
            return task
    raise TaskNotFoundError()


def create_task(task: TaskCreate) -> dict:
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


def update_task(task_id: int, task: TaskCreate) -> dict:
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
                # дату создания не меняем
                "created_at": t["created_at"],
            }
            save_tasks(tasks)
            return tasks[i]
    raise TaskNotFoundError()


def delete_task(task_id: int) -> dict:
    tasks = load_tasks()
    for i, t in enumerate(tasks):
        if t["id"] == task_id:
            tasks.pop(i)
            save_tasks(tasks)
            return {"message": "Задача удалена"}
    raise TaskNotFoundError()

