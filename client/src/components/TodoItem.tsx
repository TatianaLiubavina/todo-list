import type { TaskPriority, TaskStatus } from "../types/task";

const statusToRu: Record<TaskStatus, string> = {
  todo: "Добавлена",
  in_progress: "В процессе",
  done: "Выполнена",
};

const priorityToRu: Record<TaskPriority, string> = {
  low: "Низкая",
  medium: "Средняя",
  high: "Высокая",
};

const formatDate = (value: string | undefined): string => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

interface TodoItemProps {
  className?: string;
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  deadline: string;
  created_at?: string;
  onDeleteTaskButtonClick: (id: number) => void;
  onTaskCompleteChange: (id: number, checked: boolean) => void;
}

const TodoItem = (props: TodoItemProps) => {
  const {
    className = "",
    id,
    title,
    description,
    status,
    priority,
    deadline,
    created_at,
    onDeleteTaskButtonClick,
    onTaskCompleteChange,
  } = props;

  return (
    <li className={`todo-item  ${className}`}>
      <input
        className="todo-item__checkbox"
        id={String(id)}
        type="checkbox"
        checked={status === "done"}
        onChange={(event) => {
          onTaskCompleteChange(id, event.target.checked);
        }}
      />
      <label className="todo-item__label" htmlFor={String(id)}>
        {title}
      </label>
      {description && <div className="todo-item__label">{description}</div>}
      <div className="todo-item__label">{statusToRu[status]}</div>
      <div className="todo-item__label">{priorityToRu[priority]}</div>
      <div className="todo-item__label">{formatDate(deadline)}</div>
      {created_at && (
        <div className="todo-item__label">{formatDate(created_at)}</div>
      )}
      <button
        className="todo-item__delete-button"
        aria-label="Delete"
        title="Delete"
        onClick={() => onDeleteTaskButtonClick(id)}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 5L5 15M5 5L15 15"
            stroke="#757575"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </li>
  );
};

export default TodoItem;
