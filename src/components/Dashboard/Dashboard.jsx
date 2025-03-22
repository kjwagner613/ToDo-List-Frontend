import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import * as taskService from '../../services/taskService';
import './Dashboard.css';

const Dashboard = () => {
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
    <main  className="dashboard-container">
      <h1>Welcome, {user.username}</h1>
      <h2>Here are all your tasks.</h2>
      <div className="component-container">
        <ul className="task-grid">
          {tasks.map(task => (
            <li key={task._id} className="task-item2">
              <strong className="task-title">{task.title}</strong>
              <span className="task-category">{task.category || 'No Category'}</span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
};

export default Dashboard;