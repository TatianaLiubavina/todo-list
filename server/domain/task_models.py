from typing import Literal

from pydantic import BaseModel

TaskStatus = Literal["todo", "in_progress", "done"]
TaskPriority = Literal["low", "medium", "high"]


class Task(BaseModel):
    id: int
    title: str
    description: str
    status: TaskStatus
    priority: TaskPriority
    deadline: str
    created_at: str


class TaskCreate(BaseModel):
    title: str
    description: str
    status: TaskStatus = "todo"
    priority: TaskPriority = "medium"
    deadline: str

