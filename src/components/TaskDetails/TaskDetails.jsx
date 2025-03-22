import { useParams, Link } from "react-router";
import { useState, useEffect, useContext } from 'react';
import * as taskService from '../../services/taskService';
import CommentForm from "../CommentForm/CommentForm";
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
        setTask(taskData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching task details:", error);
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId]);

  const handleAddComment = async (commentFormData) => {
    try {
      const newComment = await taskService.createComment(taskId, commentFormData);
      setTask((prevTask) => ({
        ...prevTask,
        comments: [...(prevTask?.comments || []), newComment],
      }));
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  // Display a loading message while data is being fetched
  if (loading) {
    return <main>Loading task details...</main>;
  }

  // Display a fallback if task not found or data is invalid
  if (!task) {
    return <main>Task not found. Please try again later.</main>;
  }

  return (
    <main><h1>TASK DETAILS</h1>
      <section>
        <header>
          <p>{task?.category?.toUpperCase() || 'No Category'}</p>
          <h1>{task?.title || 'Untitled Task'}</h1>
          <p>
            {task?.author?.username
              ? `${task.author.username} posted on ${new Date(task.createdAt).toLocaleDateString()}`
              : 'Author unknown'}
          </p>
          {task?.author?._id === user?._id && (
            <>
              <Link to={`/tasks/${taskId}/edit`}>Edit</Link>
              <button onClick={() => props.handleDeleteTask(taskId)}>Delete</button>
            </>
          )}
        </header>
        <p>{task?.text || 'No details available for this task.'}</p>
      </section>

      <section>
        <h2>Comments</h2>
        <CommentForm handleAddComment={handleAddComment} />
        {(!task?.comments || task.comments.length === 0) ? (
          <p>There are no comments yet.</p>
        ) : (
          task.comments.map((comment) => (
            <article key={comment._id}>
              <header>
                <p>
                  {comment?.author?.username
                    ? `${comment.author.username} commented on ${new Date(comment.createdAt).toLocaleDateString()}`
                    : 'Unknown commenter'}
                </p>
              </header>
              <p>{comment?.text || 'No text available'}</p>
            </article>
          ))
        )}
      </section>
    </main>
  );
}

export default TaskDetails;
