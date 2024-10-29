import React, { useState } from 'react';

interface Todo {
  id: number;
  title: string;
}

const SubmitTest: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const[title, setTitle] = useState<string>("");

  const fetchTodos = async () => {
    setLoading(true);
    setError(null);


    //基本
    // const response = await fetch("URL");
    // const data: Todo[] = await response.json();

    try {
    //   const response = await fetch('https://my-app.kanken007.workers.dev/api/todo');
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


  const addTitle = async () => {
    if (title.trim() === "") {
      setError("Title cannot be empty");
      return;
    }
  
    setLoading(true);
    setError(null);
  
    try {
      const response = await fetch('http://localhost:8787/api/todo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),  // titleをPOSTリクエストのボディに含める
      });
  
      if (!response.ok) {
        throw new Error('Failed to add Todo');
      }
  
      const newTodo: Todo = await response.json();
      setTodos([...todos, newTodo]);  // 新しいTodoをリストに追加
      setTitle("");  // タイトルの入力フィールドをリセット
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
      <button onClick={addTitle}>追加</button>
      <h1>List</h1>
      <button onClick={fetchTodos} disabled={loading}>
        {loading ? 'Loading...' : 'Fetch Todos'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default SubmitTest;
