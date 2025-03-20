import { useContext, useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router';

import * as taskService from './services/taskService';

import NavBar from './components/NavBar/NavBar';
import SignUpForm from './components/SignUpForm/SignUpForm';
import SignInForm from './components/SignInForm/SignInForm';
import Landing from './components/Landing/Landing';
import Dashboard from './components/Dashboard/Dashboard';
import TaskList from './components/TaskList/TaskList';
import TaskDetails from './components/TaskDetails/TaskDetails';
import TaskEdit from './components/TaskEdit/TaskEdit';
import TaskForm from './components/TaskForm/TaskForm';
import TaskListUpdate from './components/TaskListUpdate/TaskListUpdate';



import { UserContext } from './contexts/UserContext';

const App = () => {
  const [tasks, setTasks] = useState([]); 
  const { user } = useContext(UserContext); 

  const navigate = useNavigate();

 
  useEffect(() => {
    const fetchAllTasks = async () => {
      const tasksData = await taskService.index(); 
      setTasks(tasksData); 
    };

    if (user) fetchAllTasks(); 
  }, 
     [user]);
     const handleAddTask = async (taskFormData) => {
      const newTask = await taskService.create(taskFormData); 
      setTasks([newTask, ...tasks]); 
      navigate('/tasks');
    };
  
    const handleDeleteTask = async (taskId) => {
      const deletedTask = await taskService.deleteTask(taskId);
      setTasks(tasks.filter((task) => task._id !== deletedTask._id)); 
      navigate('/tasks'); 
    };
  
    const handleUpdateTask = async (taskId, taskFormData) => {
      const updatedTask = await taskService.update(taskId, taskFormData); 
      setTasks(tasks.map((task) => (taskId === task._id ? updatedTask : task))); 
      navigate(`/tasks/${taskId}`); 
    };
  
    return (
      <>
        <NavBar />
        <Routes>
          {/* Landing or Dashboard */}
          <Route path="/" element={user ? <Dashboard /> : <Landing />} />
          
          {/* Authenticated Routes */}
          {user ? (
            <>
              <Route path="/tasks" element={<TaskList tasks={tasks} />} />
              <Route
                path="/tasks/:taskId"
                element={<TaskDetails handleDeleteTask={handleDeleteTask} />} />
              <Route
                path="/tasks/:taskId/edit"
                element={<TaskEdit handleUpdateTask={handleUpdateTask} />} />
              <Route
                path="/tasks/new"
                element={<TaskForm handleAddTask={handleAddTask} />} />
                <Route path="/tasks/update" element={<TaskListUpdate tasks={tasks} />} />

            </>
          ) : (
            <>
              <Route path="/sign-up" element={<SignUpForm />} />
              <Route path="/sign-in" element={<SignInForm />} />
            </>
          )}
        </Routes>
      </>
    );
  };
  
  export default App;