import { useParams } from "react-router";
import { useState, useEffect, useContext } from 'react';
import * as taskService from '../../services/taskService';
import { UserContext } from "../../contexts/UserContext";

const TaskDetails = (props) => {
  const { taskId } = useParams();
  const { user } = useContext(UserContext);

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const taskData = await taskService.show(taskId);
        console.log('Task details fetched:', taskData); 
        setTask(taskData);
      } catch (error) {
        console.error('Error fetching task details:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId]);

  if (loading) return <main>Loading task details...</main>;
  if (!task) return <main>No task found.</main>;

  return (
    <main>
      <section>
        <header>
          <p>{task?.category ? task.category.toUpperCase() : 'No category available'}</p>
          <h1>{task?.title || 'No title available'}</h1>
          <p>
            {task?.author?.username
              ? `${task.author.username} posted on ${new Date(task.createdAt).toLocaleDateString()}`
              : 'Author unknown'}
          </p>
          {task?.author?._id === user?._id && (
            <>
              <button onClick={() => props.handleDeleteTask(task._id)}>Delete</button>
            </>
          )}
        </header>
        <p>{task?.text || 'No description available'}</p>
      </section>
    </main>
  );
};

export default TaskDetails;