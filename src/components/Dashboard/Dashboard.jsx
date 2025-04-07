import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import * as taskService from '../../services/taskService';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const [, setTasks] = useState([]);
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
    <h1 className="dashboardh1">Welcome, {user?.username || 'Guest'}</h1>
    <h2 className="dashboardh2">Here are some task metrics:</h2>
    <div className="stats-grid">
      <div className="stats-board1">
        <p className="stats-title">Tasks by Category</p>
        <table className="statsTable">
          <thead>
            <tr>
              <th>Category</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(stats.categoryCounts).map((category) => (
              <tr key={category}>
                <td>{category}</td>
                <td>{stats.categoryCounts[category]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="stats-board2">
        <p className="stats-title">Tasks Older Than 5 Days</p>
        <table className="statsTable">
          <thead>
            <tr>
              <th>Category</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(stats.oldTasksCounts).map((category) => (
              <tr key={category}>
                <td>{category}</td>
                <td>{stats.oldTasksCounts[category]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
  );
};

export default Dashboard;
