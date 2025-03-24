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
        const userTasks = fetchedTasks.filter(task => task.author._id === user._id);
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
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    tasks.forEach(task => {
      const category = task.category || 'Uncategorized';

      // Count tasks in each category
      if (!categoryCounts[category]) {
        categoryCounts[category] = 0;
      }
      categoryCounts[category]++;

      // Count old tasks in each category
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
      <main>
        <h1 className="dashboardh1">Welcome, {user.username}</h1>
        <h2 className="dashboardh2">Here are your task statistics:</h2>
        <div className="task-stats">
        
          <div className="listByCategory">
          <h3 className="dashboardh3">Tasks by Category:</h3>
          <div className="statsList">
          <p>Total Tasks: {stats.totalTasks}</p>
          <ul>
            {Object.keys(stats.categoryCounts).map(category => (
              <li key={category}>
                {category}: {stats.categoryCounts[category]}
              </li>
            ))}
          </ul>
          <h4 className="dashboardh4">Tasks Older Than 30 Days by Category:</h4>
          <ul>
            {Object.keys(stats.oldTasksCounts).map(category => (
              <li key={category}>
                {category}: {stats.oldTasksCounts[category]}
              </li>
            ))}
          </ul></div></div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;