interface TodoInfoProps {
  total: number;
  done: number;
  onDeleteAllButtonClick: () => void;
}

const TodoInfo = (props: TodoInfoProps) => {
  const { total, done, onDeleteAllButtonClick} = props;

  const hasTasks = total > 0;

  return (
    <div className="todo__info">
      <div className="todo__total-tasks">
        Сделано {done} из {total}
      </div>
      {hasTasks && (
        <button className="todo__delete-all-button" type="button" onClick={onDeleteAllButtonClick}>
          Удалить все
        </button>
      )}
    </div>
  );
};

export default TodoInfo;
