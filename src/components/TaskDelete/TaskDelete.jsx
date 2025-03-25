import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import * as taskService from '../../services/taskService';
import { UserContext } from '../../contexts/UserContext';
import './TaskDelete.css';

const TaskDelete = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deletionSuccess, setDeletionSuccess] = useState(false); // New state

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const taskData = await taskService.show(taskId);
        setTask(taskData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching task details:", error);
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId]);

  const handleDelete = async () => {
    try {
      await taskService.deleteTask(taskId);
      setDeletionSuccess(true); // Set success state
      // Optionally, you can set a timeout to navigate after a short delay
      setTimeout(() => {
        navigate('/');
      }, 1500); // Navigate after 1.5 seconds
    } catch (error) {
      console.error("Error deleting task:", error);
      // Optionally, you could set an error message state here
    }
  };

  if (loading) {
    return <main>Loading task details...</main>;
  }

  if (!task) {
    return <main>Task not found. Please try again later.</main>;
  }

  return (
    <main>
      <h1>Confirm Task Deletion</h1>
      <div className="task-details">
        <div className="task-detail-row">
          <p className="task-detail-label"><strong>Title:</strong></p>
          <p className="task-detail-value">{task.title}</p>
        </div>
        <div className="task-detail-row">
          <p className="task-detail-label"><strong>Category:</strong></p>
          <p className="task-detail-value">{task.category || 'No Category'}</p>
        </div>
        <div className="task-detail-row">
          <p className="task-detail-label"><strong>Created By:</strong></p>
          <p className="task-detail-value">{task.author?.username || 'Unknown'}</p>
        </div>
        <div className="task-detail-row">
          <p className="task-detail-label"><strong>Details:</strong></p>
          <p className="task-detail-value">{task.text || 'No details available for this task.'}</p>
        </div>
      </div>
      <p>Are you sure you want to delete the task "{task.title}"?</p>
      <button onClick={handleDelete} disabled={deletionSuccess}>
        {deletionSuccess ? 'Deleting...' : 'Confirm Delete'}
      </button>
      <button onClick={() => navigate('/')} disabled={deletionSuccess}>
        Cancel
      </button>

      {deletionSuccess && (
        <p className="success-message">
          Your task, "{task.title}" was successfully deleted.
        </p>
      )}
    </main>
  );
};

export default TaskDelete;