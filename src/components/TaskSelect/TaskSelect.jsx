import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router';
import { UserContext } from '../../contexts/UserContext';
import * as taskService from '../../services/taskService';

const TaskSelect = () => {
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

    fetchTasks();
  }, [user]);

  if (!tasks.length) {
    return <main><p>No tasks found. Create one first!</p></main>;
  }

  return (
    <main>
      <h1>Select a Task to Update</h1>
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            <Link to={`/tasks/${task._id}/edit`}>{task.title} - {task.category}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default TaskSelect;
