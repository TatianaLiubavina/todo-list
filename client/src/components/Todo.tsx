import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import AddTaskForm from "./AddTaskForm";
import SearchTaskForm from "./SearchTaskForm";
import TodoInfo from "./TodoInfo";
import TodoList from "./TodoList";

import { tasksApi } from "../api/tasksApi";
import type { Task, TaskCreateInput } from "../types/task";

const Todo = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newTask, setNewTask] = useState<TaskCreateInput>({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    deadline: "",
  });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await tasksApi.getAll();
      setTasks(data);
    } catch (err: any) {
      setError(err.message || "Ошибка загрузки задач");
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !newTask.title.trim() ||
      !newTask.description.trim() ||
      !newTask.deadline.trim()
    ) {
      setError("Заполните все поля задачи перед добавлением");
      return;
    }
    try {
      await tasksApi.create(newTask);
      setNewTask({
        title: "",
        description: "",
        status: "todo",
        priority: "medium",
        deadline: "",
      });
      loadTasks();
    } catch (err: any) {
      setError(err.message || "Ошибка создания задачи");
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await tasksApi.delete(id);
      loadTasks();
    } catch (err: any) {
      setError(err.message || "Ошибка удаления задачи");
    }
  };

  const deleteAllTasks = async () => {
    const isConfirmed = confirm("Вы уверены, что хотите удалить все задачи?");
    if (isConfirmed) {
      try {
        for (const task of tasks) {
          await tasksApi.delete(task.id);
        }
        loadTasks();
      } catch (err: any) {
        setError(err.message || "Ошибка удаления задач");
      }
    }
  };

  const toggleTaskComplete = async (taskId: number, checked: boolean) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    try {
      const updatedStatus = checked ? "done" : "todo";
      await tasksApi.update(taskId, {
        title: task.title,
        description: task.description,
        status: updatedStatus,
        priority: task.priority,
        deadline: task.deadline,
      });
      loadTasks();
    } catch (err: any) {
      setError(err.message || "Ошибка обновления статуса задачи");
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div style={{ color: "red" }}>Ошибка: {error}</div>;

  const clearSearchQuery = searchQuery.trim().toLowerCase();
  const filteredTasks =
    clearSearchQuery.length > 0
      ? tasks.filter((task) =>
          task.title.toLowerCase().includes(clearSearchQuery)
        )
      : null;

  return (
    <div className="todo">
      <h1 className="todo__title">To Do List</h1>
      <div className="todo__sections">
        <div className="todo__section1">
          <AddTaskForm
            addTask={addTask}
            newTask={newTask}
            setNewTask={setNewTask}
          />
        </div>
        <div className="todo__section2">
          <SearchTaskForm
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <TodoInfo
            total={tasks.length}
            done={tasks.filter((task) => task.status === "done").length}
            onDeleteAllButtonClick={deleteAllTasks}
          />
          <TodoList
            tasks={tasks}
            filteredTasks={filteredTasks}
            onDeleteTaskButtonClick={deleteTask}
            onTaskCompleteChange={toggleTaskComplete}
          />
        </div>
      </div>
    </div>
  );
};
export default Todo;
