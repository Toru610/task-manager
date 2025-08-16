import React from 'react';
import TaskItem from './TaskItem';
import "../styles/TaskList.css";

function TaskList({ tasks, onEdit, onDelete, onToggle }) {
  return (
    <div className="task-list">
      {tasks.length === 0 ? (
        <p>Không có công việc nào</p>
      ) : (
        tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggle={onToggle}
          />
        ))
      )}
    </div>
  );
}

export default TaskList;