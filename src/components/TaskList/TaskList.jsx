import React from 'react';
import { useState, useEffect, useContext } from 'react';
import * as taskService from '../../services/taskService';
import { UserContext } from "../../contexts/UserContext";
import './TaskList.css';

const TaskList = () => {
  const { user } = useContext(UserContext);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const fetchedTasks = await taskService.index();
        const userTasks = fetchedTasks.filter(task => task.author._id === user._id);
        setTasks(userTasks);
      } catch (err) {
        console.error('Error fetching tasks:', err);
      }
    };
    if (user) fetchTasks();
  }, [user]);

  return (
    <div className="task-list-container">
      <h1 className="taskListh1">Task List</h1>
      <div className="task-list-content">
        <ul className="task-grid">
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
        </ul>
      </div>
    </div>
  );
};

export default TaskList;