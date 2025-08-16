import React from 'react';
import "../styles/TaskItem.css";

function TaskItem({ task, onEdit, onDelete, onToggle }) {
  return (
    <div className="task-item">
      <h4>{task.title}</h4>
      <p>{task.description}</p>
      <p>Trạng thái: {task.completed ? "Hoàn thành" : "Chưa xong"}</p>
      <p>Ưu tiên: {task.priority}</p>
      <p>Hạn: {task.dueDate}</p>

      <div className="task-actions">
        <button onClick={() => onEdit(task)}>✏️ Sửa</button>
        <button onClick={() => onDelete(task.id)}>🗑️ Xóa</button>
        <button onClick={() => onToggle(task)}>
          {task.completed ? "↩️ Hoàn tác" : "✅ Hoàn thành"}
        </button>
      </div>
    </div>
  );
}

export default TaskItem;