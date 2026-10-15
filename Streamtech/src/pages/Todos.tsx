import { useEffect, useState } from 'react';
import type { Todo } from '../types';
import { getTodos } from '../services/todosApi';
import Loading from '../components/Loading';
function Todos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    getTodos(controller.signal).then(data => { if (!controller.signal.aborted) setTodos(data); }).catch(() => { if (!controller.signal.aborted) setError('Impossible de charger les tâches.'); }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, []);
  return <><h1 className="mb-4">✅ Mes Tâches</h1>{loading ? <Loading /> : error ? <div className="alert alert-danger">{error}</div> : <ul className="list-group">{todos.map(todo => <li key={todo.id} className="list-group-item">{todo.title}</li>)}</ul>}</>;
}
export default Todos;
