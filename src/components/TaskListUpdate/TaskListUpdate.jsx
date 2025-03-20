import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import * as taskService from '../../services/taskService';
import '../components.css'; 

const TaskListUpdate = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const fetchedTasks = await taskService.index(); // Call your index function
        setTasks(fetchedTasks); // Save tasks in state
      } catch (error) {
        console.error('Error fetching tasks:', error.message);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchTasks();
  }, []);

  if (loading) return <p>Loading tasks...</p>;
  if (!tasks.length) return <p>No tasks found.</p>;

  return (
    <main>
      <div className="component-container">
      <h1>Your Tasks</h1>
      <h2>Select one to update</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            <Link to={`/tasks/${task._id}/edit`}>
              <strong>{task.title}</strong> - {task.category || 'No category'}
            </Link>
          </li>
        ))}
      </ul>
      </div>
    </main>
  );
};

export default TaskListUpdate;