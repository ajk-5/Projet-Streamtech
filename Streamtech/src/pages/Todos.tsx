import { useEffect, useState } from "react";
import type { Todo } from "../types";
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from "../services/todosApi";
import TodoForm from "../components/TodoForm";
import TodoItem from "../components/TodoItem";
import Loading from "../components/Loading";

function Todos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState(false);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    async function loadTodos() {
      setLoading(true);
      setError("");
      try {
        const data = await getTodos(controller.signal);
        if (!controller.signal.aborted) {
          setTodos(data);
          setLoadError(false);
        }
      } catch {
        if (!controller.signal.aborted) {
          setError("Impossible de charger les tâches.");
          setLoadError(true);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    loadTodos();
    return () => controller.abort();
  }, [retry]);

  async function handleAdd(title: string) {
    setBusy(true);
    setError("");
    try {
      const todo = await addTodo(title);
      setTodos((previous) => [todo, ...previous]);
      setFilter("all");
      return true;
    } catch {
      setError("La tâche n’a pas pu être ajoutée. Réessayez.");
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function handleUpdate(
    id: number,
    changes: Partial<Pick<Todo, "title" | "completed">>,
  ) {
    setBusy(true);
    setError("");
    try {
      await updateTodo(id, changes);
      setTodos((previous) =>
        previous.map((todo) =>
          todo.id === id ? { ...todo, ...changes } : todo,
        ),
      );
      return true;
    } catch {
      setError("La tâche n’a pas pu être modifiée. Réessayez.");
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Supprimer cette tâche ?")) return;
    setBusy(true);
    setError("");
    try {
      await deleteTodo(id);
      setTodos((previous) => previous.filter((todo) => todo.id !== id));
    } catch {
      setError("La tâche n’a pas pu être supprimée. Réessayez.");
    } finally {
      setBusy(false);
    }
  }

  const completed = todos.filter((todo) => todo.completed).length;
  const filteredTodos = todos.filter((todo) =>
    filter === "active"
      ? !todo.completed
      : filter === "completed"
        ? todo.completed
        : true,
  );

  return (
    <>
      <h1 className="mb-4">✅ Mes Tâches</h1>
      {loading ? (
        <Loading />
      ) : (
        <>
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}{" "}
              {loadError && (
                <button
                  className="btn btn-outline-danger btn-sm ms-2"
                  onClick={() => setRetry(retry + 1)}
                >
                  Réessayer
                </button>
              )}
            </div>
          )}
          {!loadError && (
            <>
              <div className="row g-3 mb-4">
                {[
                  { label: "Total", value: todos.length, color: "primary" },
                  {
                    label: "En cours",
                    value: todos.length - completed,
                    color: "warning",
                  },
                  { label: "Terminées", value: completed, color: "success" },
                ].map((stat) => (
                  <div className="col-4" key={stat.label}>
                    <div className="card text-center">
                      <div className="card-body">
                        <p className={`h5 text-${stat.color}`}>{stat.value}</p>
                        <p className="small mb-0">{stat.label}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <TodoForm onAdd={handleAdd} disabled={busy} />
              <div
                className="d-flex flex-wrap gap-2 mb-3"
                role="group"
                aria-label="Filtrer les tâches"
              >
                {[
                  { value: "all", label: `Toutes (${todos.length})` },
                  {
                    value: "active",
                    label: `En cours (${todos.length - completed})`,
                  },
                  { value: "completed", label: `Terminées (${completed})` },
                ].map((item) => (
                  <button
                    key={item.value}
                    className={`btn btn-sm ${filter === item.value ? "btn-primary" : "btn-outline-primary"}`}
                    aria-pressed={filter === item.value}
                    onClick={() => setFilter(item.value)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              {busy && (
                <p role="status" className="small text-body-secondary">
                  Enregistrement en cours…
                </p>
              )}
              {filteredTodos.length === 0 ? (
                <div className="alert alert-info">
                  Aucune tâche dans cette liste.
                </div>
              ) : (
                <ul className="list-group">
                  {filteredTodos.map((todo) => (
                    <TodoItem
                      key={todo.id}
                      todo={todo}
                      onUpdate={handleUpdate}
                      onDelete={handleDelete}
                      disabled={busy}
                    />
                  ))}
                </ul>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}
export default Todos;
