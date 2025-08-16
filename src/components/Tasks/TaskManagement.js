import React, { useEffect, useState, useMemo } from 'react';
import { getTasks, updateTask, deleteTask } from '../../components/api/taskAPI';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import "../styles/TaskManagement.css";
import "../styles/Search.css";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

export default function TaskManagement({ user }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('createdDate');

  const debouncedQuery = useDebounce(query, 500);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await getTasks();
      setTasks(data);
      setError(null);
    } catch {
      setError('Không tải được danh sách task');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa?")) return;
    try {
      await deleteTask(id);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch {
      setError("Xóa task thất bại");
    }
  };

  const handleToggle = async (task) => {
    try {
      const updated = await updateTask(task.id, { completed: !task.completed });
      setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
    } catch {
      setError("Cập nhật thất bại");
    }
  };

  const handleEdit = (task) => {
    setEditing(task);
    setShowForm(true);
  };

  const filteredTasks = useMemo(() => {
    return tasks
      .filter(t => {
        if (statusFilter === 'Todo') return !t.completed && t.status !== 'in progress';
        if (statusFilter === 'In Progress') return t.status === 'in progress';
        if (statusFilter === 'Completed') return t.completed || t.status === 'done';
        return true; 
      })
      .filter(t => {
        const searchText = debouncedQuery.toLowerCase();
        const title = (t.title || '').toLowerCase();
        const description = (t.description || '').toLowerCase();
        return title.includes(searchText) || description.includes(searchText);
      })
      .sort((a, b) => {
        if (sortBy === 'dueDate') return new Date(a.dueDate) - new Date(b.dueDate);
        if (sortBy === 'createdDate') return new Date(a.createdDate) - new Date(b.createdDate);
        if (sortBy === 'priority') return (b.priority || 0) - (a.priority || 0);
        return 0;
      });
  }, [tasks, debouncedQuery, statusFilter, sortBy]);

  const doneCount = tasks.filter(t => t.completed || t.status === "done").length;

  if (loading) return <LoadingSpinner />;

  return (
    <div className="task-management">
      <div className="task-header-card">
        <div className="header-left">
          <h2>Quản lý Task</h2>
          <p>Xin chào {user.username || user.name}, bạn có {tasks.length} task ({doneCount} đã hoàn thành)</p>
        </div>
        <div className="header-right">
          <button 
            className="add-task-btn"
            onClick={() => {
              setEditing(null);
              setShowForm(!showForm);
              setShowSearch(false);
            }}
          >
            {showForm ? "Đóng Form" : "➕ Thêm Task"}
          </button>
          <button 
            className="search-task-btn"
            onClick={() => {
              setShowSearch(!showSearch);
              setShowForm(false);
            }}
          >
            {showSearch ? "Đóng Tìm kiếm" : "🔍 Tìm kiếm Task"}
          </button>
        </div>
      </div>

      <ErrorMessage message={error} />

      {showForm && (
        <TaskForm
          user={user}
          selectedTask={editing}
          setSelectedTask={setEditing}
          onSuccess={async () => {
            await loadTasks();
            setShowForm(false);
          }}
        />
      )}

      {showSearch && (
        <div className="task-search-filter">
          <input
            type="text"
            placeholder="Tìm kiếm theo tiêu đề/mô tả..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="All">All</option>
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="createdDate">Ngày tạo</option>
            <option value="dueDate">Ngày hết hạn</option>
            <option value="priority">Ưu tiên</option>
          </select>
        </div>
      )}

      <TaskList
        tasks={filteredTasks}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggle={handleToggle}
      />
    </div>
  );
}