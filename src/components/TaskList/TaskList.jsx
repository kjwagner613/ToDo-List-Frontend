// src/components/TaskList/TaskList.jsx
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
        const userTasks = fetchedTasks.filter(
          (task) => task.author && task.author._id === user._id
        );
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
          <div key={category} className="task-category-table">
            <h2 className="task-category-title">{category}</h2>
            <table className="task-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Created By</th>
                  <th>Created At</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {categorizedTasks[category].map(task => (
                  <tr key={task._id} className="task-row">
                    <td>{task.title}</td>
                    <td>{task.author?.username || 'Unknown'}</td>
                    <td>{new Date(task.createdAt).toLocaleDateString()}</td>
                    <td>{task.text}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;