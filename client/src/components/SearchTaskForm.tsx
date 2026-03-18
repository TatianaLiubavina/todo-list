import Field from "./Field";
import type { FormEvent } from "react";

interface SearchTaskProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchTaskForm = (props: SearchTaskProps) => {
  const { searchQuery, setSearchQuery } = props;

  return (
    <form
      className="todo__form"
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <Field
        className="todo__field"
        label="Ищу задачу"
        id="search-task"
        type="search"
        value={searchQuery}
        onInput={(event: FormEvent<HTMLInputElement>) => {
          setSearchQuery(event.currentTarget.value);
        }}
      />
    </form>
  );
};

export default SearchTaskForm;
