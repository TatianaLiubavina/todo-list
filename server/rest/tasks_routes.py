from fastapi import APIRouter, Depends, HTTPException

from db.tasks_repo import (
    TaskNotFoundError,
    create_task as repo_create_task,
    delete_task as repo_delete_task,
    get_all_tasks as repo_get_all_tasks,
    get_task_by_id as repo_get_task_by_id,
    update_task as repo_update_task,
)
from domain.task_models import TaskCreate
from rest.auth_dependency import get_current_user


router = APIRouter(tags=["tasks"])


@router.get("/tasks")
def get_tasks(current_user: str = Depends(get_current_user)):
    # current_user используется как защита эндпоинтов (в примере задачи общие)
    return repo_get_all_tasks()


@router.get("/tasks/{task_id}")
def get_task(task_id: int, current_user: str = Depends(get_current_user)):
    try:
        return repo_get_task_by_id(task_id)
    except TaskNotFoundError:
        raise HTTPException(status_code=404, detail="Задача не найдена")


@router.post("/tasks")
def create_task(task: TaskCreate, current_user: str = Depends(get_current_user)):
    return repo_create_task(task)


@router.put("/tasks/{task_id}")
def update_task(task_id: int, task: TaskCreate, current_user: str = Depends(get_current_user)):
    try:
        return repo_update_task(task_id, task)
    except TaskNotFoundError:
        raise HTTPException(status_code=404, detail="Задача не найдена")


@router.delete("/tasks/{task_id}")
def delete_task(task_id: int, current_user: str = Depends(get_current_user)):
    try:
        return repo_delete_task(task_id)
    except TaskNotFoundError:
        raise HTTPException(status_code=404, detail="Задача не найдена")

