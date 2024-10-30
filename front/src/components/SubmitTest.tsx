import React, { useState } from 'react';

interface Todo {
  id: string; // IDは文字列として扱います（バックエンドに合わせて）
  title: string;
  completed: boolean; // 完了ステータスを追加
}

const SubmitTest: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [updateId, setUpdateId] = useState<string | null>(null); // 更新するTodoのIDを管理

  const fetchTodos = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8787/api/todo');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data: Todo[] = await response.json();
      setTodos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const addOrUpdateTitle = async () => {
    if (title.trim() === "") {
      setError("Title cannot be empty");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const method = updateId ? 'PUT' : 'POST';
      const url = updateId 
        ? `http://localhost:8787/api/todo/${updateId}` 
        : 'http://localhost:8787/api/todo';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        throw new Error(updateId ? 'Failed to update Todo' : 'Failed to add Todo');
      }

      const newTodo: Todo = await response.json();
      if (updateId) {
        setTodos(todos.map(todo => (todo.id === updateId ? newTodo : todo))); // 更新の場合
        setUpdateId(null); // 更新後はIDをリセット
      } else {
        setTodos([...todos, newTodo]); // 新規追加の場合
      }

      setTitle(""); // タイトルの入力フィールドをリセット
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const deleteTodo = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:8787/api/todo/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete Todo');
      }

      setTodos(todos.filter(todo => todo.id !== id)); // 削除されたTodoをリストから除去
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Todo List</h1>
      <input 
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <button onClick={addOrUpdateTitle}>
        {updateId ? 'Update' : 'Add'} Todo
      </button>
      <h1>List</h1>
      <button onClick={fetchTodos} disabled={loading}>
        {loading ? 'Loading...' : 'Fetch Todos'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.title}
            <button onClick={() => { setTitle(todo.title); setUpdateId(todo.id); }}>Edit</button>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubmitTest;
