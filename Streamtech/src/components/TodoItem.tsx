import { useState } from "react";
import type { Todo } from "../types";
import TodoEditForm from "./TodoEditForm";

interface TodoItemProps {
  todo: Todo;
  onUpdate: (
    id: number,
    changes: Partial<Pick<Todo, "title" | "completed">>,
  ) => Promise<boolean>;
  onDelete: (id: number) => Promise<void>;
  disabled: boolean;
}

function TodoItem({ todo, onUpdate, onDelete, disabled }: TodoItemProps) {
  const [editing, setEditing] = useState(false);

  return (
    <li className="list-group-item p-3">
      {editing ? (
        <TodoEditForm
          todo={todo}
          onSave={(title) => onUpdate(todo.id, { title })}
          onCancel={() => setEditing(false)}
          disabled={disabled}
        />
      ) : (
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div className="form-check flex-grow-1 todo-title">
            <input
              className="form-check-input"
              id={`todo-${todo.id}`}
              type="checkbox"
              checked={todo.completed}
              onChange={() => onUpdate(todo.id, { completed: !todo.completed })}
              disabled={disabled}
            />
            <label
              className={`form-check-label ${todo.completed ? "text-decoration-line-through text-body-secondary" : ""}`}
              htmlFor={`todo-${todo.id}`}
            >
              {todo.title}
            </label>
          </div>
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => setEditing(true)}
              disabled={disabled}
              aria-label={`Modifier : ${todo.title}`}
            >
              Modifier
            </button>
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={() => onDelete(todo.id)}
              disabled={disabled}
              aria-label={`Supprimer : ${todo.title}`}
            >
              Supprimer
            </button>
          </div>
        </div>
      )}
    </li>
  );
}
export default TodoItem;
