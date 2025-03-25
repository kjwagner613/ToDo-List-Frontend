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

  const categorizeTasks = (tasks) => {
    return tasks.reduce((categories, task) => {
      const category = task.category || 'Uncategorized';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(task);
      return categories;
    }, {});
  };

  const categorizedTasks = categorizeTasks(tasks);

  return (
    <div className="task-list-container">
      <h1 className="taskListh1">Task List</h1>
      <div className="task-list-content">
        {Object.keys(categorizedTasks).map(category => (
          <div key={category} className="task-category">
            <h2 className="task-category-title">{category}</h2>
            <ul className="task-grid">
              {categorizedTasks[category].map(task => (
                <li key={task._id} className="task-item">
                  <div className="task-details">
                    <strong className="task-title">{task.title}</strong>
                    <div className="task-owner">
                      <span>Created By: {task.author.username}</span>
                    </div>
                    <span className="task-date">{new Date(task.createdAt).toLocaleDateString()}</span>
                    <p className="task-text">{task.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;