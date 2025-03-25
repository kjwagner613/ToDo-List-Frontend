import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import * as taskService from '../../services/taskService';
import { UserContext } from '../../contexts/UserContext';
import './TaskDeleteSelect.css';

const TaskDeleteSelect = () => {
  const { user } = useContext(UserContext);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const fetchedTasks = await taskService.index();
        console.log('Fetched Tasks:', fetchedTasks);
        const userTasks = fetchedTasks.filter(
          task => task.author && task.author._id === user._id
        );
        console.log('User Tasks:', userTasks);
        setTasks(userTasks);
      } catch (err) {
        console.error('Error fetching tasks:', err);
      }
    };

    if (user) {
      fetchTasks();
    }
  }, [user]);

  if (!tasks.length) {
    return <main>No tasks found. Create one first!</main>;
  }

  return (
    <main>
       <h1 className="task-gridSelect-title">Select a Task to Delete</h1>
      <div className="task-gridSelect">       
        <ul className="task-gridSelect-list">
          {tasks.map(task => (
            <li key={task._id} className="task-itemGridSelect">
              <Link to={`/tasks/delete/${task._id}`}>{task.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
};

export default TaskDeleteSelect;