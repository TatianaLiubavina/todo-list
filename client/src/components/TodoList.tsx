import TodoItem from "./TodoItem";
import type { Task } from "../types/task";

type UiTask = Task & { isDone: boolean };

interface TodoListProps {
  tasks: UiTask[];
  filteredTasks: UiTask[] | null;
  onDeleteTaskButtonClick: (id: number) => void;
  onTaskCompleteChange: (id: number, isDone: boolean) => void;
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

  return (
    <ul className="todo__list">
      {(filteredTasks ?? tasks).map((task) => (
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
          isDone={task.isDone}
          onDeleteTaskButtonClick={onDeleteTaskButtonClick}
          onTaskCompleteChange={onTaskCompleteChange}
        />
      ))}
    </ul>
  );
};

export default TodoList;
