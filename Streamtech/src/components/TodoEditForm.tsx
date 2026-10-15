import { useState } from "react";
import type { FormEvent } from "react";
import type { Todo } from "../types";

interface TodoEditFormProps {
  todo: Todo;
  onSave: (title: string) => Promise<boolean>;
  onCancel: () => void;
  disabled: boolean;
}

function TodoEditForm({ todo, onSave, onCancel, disabled }: TodoEditFormProps) {
  const [title, setTitle] = useState(todo.title);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (title.trim().length < 3 || title.trim().length > 100) {
      setError("Le titre doit contenir entre 3 et 100 caractères.");
      return;
    }
    if (await onSave(title.trim())) onCancel();
  }

  return (
    <form className="w-100" onSubmit={handleSubmit} noValidate>
      <label htmlFor={`edit-${todo.id}`} className="form-label">
        Modifier la tâche
      </label>
      <input
        id={`edit-${todo.id}`}
        className={`form-control mb-2 ${error ? "is-invalid" : ""}`}
        value={title}
        onChange={(event) => {
          setTitle(event.target.value);
          setError("");
        }}
        maxLength={100}
        disabled={disabled}
        autoFocus
        aria-invalid={!!error}
        aria-describedby={error ? `edit-error-${todo.id}` : undefined}
      />
      {error && (
        <p
          id={`edit-error-${todo.id}`}
          className="text-danger small"
          role="alert"
        >
          {error}
        </p>
      )}
      <button className="btn btn-primary btn-sm me-2" disabled={disabled}>
        Enregistrer
      </button>
      <button
        type="button"
        className="btn btn-outline-secondary btn-sm"
        onClick={onCancel}
        disabled={disabled}
      >
        Annuler
      </button>
    </form>
  );
}
export default TodoEditForm;
