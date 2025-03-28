import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import * as taskService from '../../services/taskService';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    totalTasks: 0,
    categoryCounts: {},
    oldTasksCounts: {}
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const fetchedTasks = await taskService.index();
        const userTasks = fetchedTasks.filter(
          (task) => task.author && task.author._id === user._id
        );
        setTasks(userTasks);
        calculateStats(userTasks);
      } catch (err) {
        console.error('Error fetching tasks:', err);
      }
    };

    if (user) fetchTasks();
  }, [user]);

  const calculateStats = (tasks) => {
    const categoryCounts = {};
    const oldTasksCounts = {};
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 5);

    tasks.forEach(task => {
      const category = task.category || 'Uncategorized';


      if (!categoryCounts[category]) {
        categoryCounts[category] = 0;
      }
      categoryCounts[category]++;


      if (new Date(task.createdAt) < thirtyDaysAgo) {
        if (!oldTasksCounts[category]) {
          oldTasksCounts[category] = 0;
        }
        oldTasksCounts[category]++;
      }
    });

    setStats({
      totalTasks: tasks.length,
      categoryCounts,
      oldTasksCounts
    });
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboardh1">Welcome, {user.username}</h1>
      <h2 className="dashboardh2">Here are some task metrics.</h2>
      <div className="task-stats">
        <div className="listByCategory">
          <h3 className="dashboardh3">Tasks by Category:</h3>
          <ul className="statsList">
            {Object.keys(stats.categoryCounts).map((category) => (
              <li key={category}>
                {category}: {stats.categoryCounts[category]}
              </li>
            ))}
          </ul>
        </div>
        <div className="listByCategory">
          <h4 className="dashboardh4">Tasks Older Than 5 Days by Category:</h4>
          <ul className="statsList">
            {Object.keys(stats.oldTasksCounts).map((category) => (
              <li className="dashTasks" key={category}>
                {category}: {stats.oldTasksCounts[category]}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;