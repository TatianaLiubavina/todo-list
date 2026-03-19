import Button from "./Button";
import Field from "./Field";
import type { Dispatch, FormEvent, SetStateAction, ChangeEvent } from "react";
import type { TaskCreateInput, TaskPriority, TaskStatus } from "../types/task";

interface AddTaskProps {
  addTask: (e: FormEvent<HTMLFormElement>) => void;
  newTask: TaskCreateInput;
  setNewTask: Dispatch<SetStateAction<TaskCreateInput>>;
}

const AddTaskForm = (props: AddTaskProps) => {
  const { addTask, newTask, setNewTask } = props;

  const isValid =
    newTask.title.trim().length > 0 &&
    newTask.description.trim().length > 0 &&
    newTask.deadline.trim().length > 0;

  const handleStatusChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as TaskStatus;
    setNewTask((prev) => ({ ...prev, status: value }));
  };

  const handlePriorityChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as TaskPriority;
    setNewTask((prev) => ({ ...prev, priority: value }));
  };

  return (
    <form className="todo__form" onSubmit={addTask}>
      <div className="todo__form-div">
        <Field
          className="todo__field"
          label="Задача"
          id="new-task-title"
          value={newTask.title}
          onInput={(event: FormEvent<HTMLInputElement>) => {
            const value = event.currentTarget.value;
            setNewTask((prev) => ({ ...prev, title: value }));
          }}
        />
        <Field
          className="todo__field"
          label="Описание"
          id="new-task-description"
          value={newTask.description}
          onInput={(event: FormEvent<HTMLInputElement>) => {
            const value = event.currentTarget.value;
            setNewTask((prev) => ({ ...prev, description: value }));
          }}
        />
        <label className="field__title" htmlFor="new-task-status">
          Сроки
        </label>
        <Field
          className="todo__field"
          label=""
          id="new-task-deadline"
          type="date"
          value={newTask.deadline}
          onInput={(event: FormEvent<HTMLInputElement>) => {
            const value = event.currentTarget.value;
            setNewTask((prev) => ({ ...prev, deadline: value }));
          }}
        />
      </div>
      <div className="todo__form-div">
        <div className="todo__field">
          <label className="field__title" htmlFor="new-task-status">
            Статус
          </label>
          <select
            id="new-task-status"
            className="field__input"
            value={newTask.status}
            onChange={handleStatusChange}
          >
            <option value="todo">Добавлена</option>
            <option value="in_progress">В процессе</option>
            <option value="done">Сделана</option>
          </select>
        </div>
        <div className="todo__field">
          <label className="field__title" htmlFor="new-task-priority">
            Важность
          </label>
          <select
            id="new-task-priority"
            className="field__input"
            value={newTask.priority}
            onChange={handlePriorityChange}
          >
            <option value="low">Низкая</option>
            <option value="medium">Средняя</option>
            <option value="high">Высокая</option>
          </select>
        </div>
        <Button
          className="todo__field-button"
          type="submit"
          disabled={!isValid}
        >
          Добавить
        </Button>
      </div>
    </form>
  );
};

export default AddTaskForm;
