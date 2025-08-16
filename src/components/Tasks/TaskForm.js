import React, { useState, useEffect } from 'react';
import { createTask, updateTask } from '../../components/api/taskAPI';
import "../styles/TaskForm.css";

export default function TaskForm({ user, selectedTask, setSelectedTask, onSuccess }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedTask) {
      setTitle(selectedTask.title || '');
      setDescription(selectedTask.description || '');
      setStatus(selectedTask.status || 'todo');
      setPriority(selectedTask.priority || 'medium');
      setDueDate(selectedTask.dueDate ? selectedTask.dueDate.slice(0, 10) : '');
    } else {
      setTitle('');
      setDescription('');
      setStatus('todo');
      setPriority('medium');
      setDueDate('');
    }
  }, [selectedTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !status || !priority || !dueDate) {
      setError("Vui lòng nhập đầy đủ tất cả thông tin");
      return;
    }

    const taskData = {
      title,
      description,
      status,
      priority,
      dueDate,
      completed: status === 'done',
      createdBy: user.id
    };

    try {
      if (selectedTask) {
        await updateTask(selectedTask.id, taskData);
      } else {
        await createTask(taskData);
      }

      setError(null);
      setTitle('');
      setDescription('');
      setStatus('todo');
      setPriority('medium');
      setDueDate('');
      setSelectedTask(null);
      onSuccess();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Thao tác thất bại";
      setError(msg);
      console.error(err);
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      {error && <p className="form-error">{error}</p>}
      <input
        type="text"
        placeholder="Tiêu đề"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Mô tả"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
       <option value="todo">Todo</option>
        <option value="in progress">In Progress</option>
        <option value="done">Done</option>
      </select>
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="low">Thấp</option>
        <option value="medium">Trung bình</option>
        <option value="high">Cao</option>
      </select>
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <button type="submit">{selectedTask ? "Lưu" : "Thêm Task"}</button>
    </form>
  );
}