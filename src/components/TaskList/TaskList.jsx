import React from 'react';
import './TaskList.css';

const TaskList = ({ tasks }) => {
  return (
    <><h1>Task List</h1><ul className="task-grid">
      {tasks.map(task => (
        <li key={task._id} className="task-item">
          <div className="task-details">
            <strong className="task-title">{task.title}</strong>
            <span className="task-owner">Created By: <br></br>{task.author.username}</span>
            <span className="task-date">{new Date(task.createdAt).toLocaleDateString()}</span>
            <p className="task-text">{task.text}</p>
          </div>
        </li>
      ))}
    </ul></>
  );
};

export default TaskList;