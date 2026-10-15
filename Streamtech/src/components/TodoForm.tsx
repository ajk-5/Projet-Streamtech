import { useState } from "react";
import type { FormEvent } from "react";

interface TodoFormProps {
  onAdd: (title: string) => Promise<boolean>;
  disabled: boolean;
}

function TodoForm({ onAdd, disabled }: TodoFormProps) {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (title.trim().length < 3 || title.trim().length > 100) {
      setError("Le titre doit contenir entre 3 et 100 caractères.");
      return;
    }
    if (await onAdd(title.trim())) setTitle("");
  }

  return (
    <form onSubmit={handleSubmit} className="card card-body mb-4" noValidate>
      <label htmlFor="new-todo" className="form-label fw-semibold">
        Ajouter une tâche
      </label>
      <div className="d-flex gap-2">
        <input
          id="new-todo"
          className={`form-control ${error ? "is-invalid" : ""}`}
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            setError("");
          }}
          placeholder="Ex. Regarder Interstellar"
          maxLength={100}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? "new-todo-error" : undefined}
        />
        <button className="btn btn-primary" disabled={disabled}>
          Ajouter
        </button>
      </div>
      {error && (
        <div
          id="new-todo-error"
          className="text-danger small mt-2"
          role="alert"
        >
          {error}
        </div>
      )}
    </form>
  );
}
export default TodoForm;
