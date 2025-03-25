import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import * as taskService from '../../services/taskService';
import './TaskSelect.css';

const TaskSelect = () => {
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
  
    fetchTasks();
  }, [user]);

  if (!tasks.length) {
    return (
      <main>
        <p>No tasks found. Create one first!</p>
        <Link to="/tasks/create">Click here to create a task</Link>
      </main>    
    );
  }

  const categorizeTasks = (tasks) => {
    return tasks.reduce((categories, task) => {
      const category = task.category || 'Uncategorized';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(task);
      return categories;
    }, {});
  }

  const categorizedTasks = categorizeTasks(tasks);

  return (
    <main>
      <div className="selectForm-container">
        <h1 className="select-h1">Select a Task to Update</h1>
        <div className="select-grid">
          {Object.keys(categorizedTasks).map(category => (
            <div key={category} className="task-category">
              <h2 className="task-category-title">{category}</h2>
              <ul>
                {categorizedTasks[category].map(task => (
                  <li key={task._id} className='select-grid-item'>
                    <Link to={`/tasks/${task._id}`}>{task.title} </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default TaskSelect;