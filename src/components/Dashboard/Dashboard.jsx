import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import * as taskService from '../../services/taskService';
import '../components.css'; 


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
    <main>
       <div className="component-container2">
      <h1>Welcome, {user.username}</h1>
      <h2>
        This is the dashboard page where you can see a list of all your tasks.
      </h2>
      <ul>
        {tasks.map(task => (
          <li key={task._id}>
            <strong>{task.title}</strong> - {task.category}
          </li>
        ))}
      </ul>
      </div>
    </main>
  );
};

export default Dashboard;

