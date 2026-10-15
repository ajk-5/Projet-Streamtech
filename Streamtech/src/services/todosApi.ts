import type { Todo } from "../types";

const BASE_URL = "https://jsonplaceholder.typicode.com/todos";

export async function getTodos(signal?: AbortSignal): Promise<Todo[]> {
  const response = await fetch(`${BASE_URL}?_limit=20`, { signal });
  if (!response.ok) throw new Error("Impossible de charger les tâches.");
  return response.json();
}

export async function addTodo(title: string): Promise<Todo> {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, completed: false, userId: 1 }),
  });
  if (!response.ok) throw new Error("Impossible d’ajouter la tâche.");
  const todo: Todo = await response.json();
  // L’API renvoie toujours 201 : on crée un identifiant unique pour React.
  return { ...todo, id: Date.now() };
}

export async function updateTodo(
  id: number,
  changes: Partial<Pick<Todo, "title" | "completed">>,
) {
  // Les nouvelles tâches n’existent pas sur le serveur de simulation.
  if (id > 200) return;
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(changes),
  });
  if (!response.ok) throw new Error("Impossible de modifier la tâche.");
}

export async function deleteTodo(id: number) {
  if (id > 200) return;
  const response = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Impossible de supprimer la tâche.");
}
