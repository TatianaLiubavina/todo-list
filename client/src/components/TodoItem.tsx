import type { TaskPriority, TaskStatus } from "../types/task";

interface TodoItemProps {
  className?: string;
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  deadline: string;
  created_at?: string;
  isDone: boolean;
  onDeleteTaskButtonClick: (id: number) => void;
  onTaskCompleteChange: (id: number, isDone: boolean) => void;
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
    isDone,
    onDeleteTaskButtonClick,
    onTaskCompleteChange,
  } = props;

  return (
    <li className={`todo-item  ${className}`}>
      <input
        className="todo-item__checkbox"
        id={String(id)}
        type="checkbox"
        checked={isDone}
        onChange={(event) => {
          onTaskCompleteChange(id, event.target.checked);
        }}
      />
      <label className="todo-item__label" htmlFor={String(id)}>
        {title}
      </label>
      {description && <div className="todo-item__label">{description}</div>}
      <div className="todo-item__label">{status}</div>
      <div className="todo-item__label">{priority}</div>
      <div className="todo-item__label">{deadline}</div>
      {created_at && <div className="todo-item__label">{created_at}</div>}
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
