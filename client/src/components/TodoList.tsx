import TodoItem from "./TodoItem";
import type { Task } from "../types/task";

interface TodoListProps {
  tasks: Task[];
  filteredTasks: Task[] | null;
  onDeleteTaskButtonClick: (id: number) => void;
  onTaskCompleteChange: (id: number, checked: boolean) => void;
}

const TodoList = (props: TodoListProps) => {
  const {
    tasks = [],
    onDeleteTaskButtonClick,
    onTaskCompleteChange,
    filteredTasks,
  } = props;

  const hasTasks = tasks.length > 0;
  const isSearchActive = filteredTasks !== null;
  const hasFilteredTasks = (filteredTasks?.length ?? 0) > 0;

  if (!hasTasks) {
    return <div className="todo__empty-message">Задач пока нет</div>;
  }

  if (isSearchActive && !hasFilteredTasks) {
    return <div className="todo__empty-message">Задачи не найдены</div>;
  }

  const visibleTasks = filteredTasks ?? tasks;

  return (
    <div className="todo__list-wrapper">
      {visibleTasks.length > 0 && (
        <div className="todo__list-header">
          <span className="todo__list-header-cell">Задача</span>
          <span className="todo__list-header-cell">Описание</span>
          <span className="todo__list-header-cell">Статус</span>
          <span className="todo__list-header-cell">Важность</span>
          <span className="todo__list-header-cell">Дедлайн</span>
          <span className="todo__list-header-cell">Создана</span>
        </div>
      )}
      <ul className="todo__list">
        {visibleTasks.map((task) => (
          <TodoItem
            className="todo__item"
            key={task.id}
            id={task.id}
            title={task.title}
            description={task.description}
            status={task.status}
            priority={task.priority}
            deadline={task.deadline}
            created_at={task.created_at}
            onDeleteTaskButtonClick={onDeleteTaskButtonClick}
            onTaskCompleteChange={onTaskCompleteChange}
          />
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
