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
    <div className="dashboard-container">
    <main>  
      <h1 className="dashboardh1">Welcome, {user.username}</h1>
       <h2 className="dashboardh2">Here are your tasks.</h2>
         <ul className="task-grid">
          {tasks.map(task => (
            <li key={task._id} className="task-item2">
              <strong className="task-title">Title: {task.title}</strong>
              <span className="task-category"> Category: {task.category || 'No Category'}</span>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default Dashboard;