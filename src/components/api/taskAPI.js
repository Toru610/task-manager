const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const getTasks = async () => {
  const res = await fetch(`${API_BASE_URL}/tasks`);
  return await res.json();
};

export const createTask = async (task) => {
  const res = await fetch(`${API_BASE_URL}/tasks`, { 
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Thao tác thất bại');
  }

  return await res.json();
};

export const updateTask = async (id, task) => {
  const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  return await res.json();
};

export const deleteTask = async (id) => {
  await fetch(`${API_BASE_URL}/tasks/${id}`, { method: 'DELETE' });
};