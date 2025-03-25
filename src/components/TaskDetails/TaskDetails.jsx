// src/components/TaskDetails/TaskDetails.jsx
import React from 'react';
import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useContext } from 'react';
import * as taskService from '../../services/taskService';
import CommentForm from "../CommentForm/CommentForm";
import { UserContext } from "../../contexts/UserContext";
import './TaskDetails.css';

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

  if (loading) {
    return <main>Loading task details...</main>;
  }

  if (!task) {
    return <main>Task not found. Please try again later.</main>;
  }

  return (
    <main>
      <div className="taskDetail-appContainer">
        <h1 className="taskDetailh1">TASK DETAILS</h1>
        <section className="task-details-section">
          <div className="category-label">Category:</div>
          <div className="category-value">{task.category?.toUpperCase() || 'No Category'}</div>
          <div className="title-label">Title:</div>
          <div className="title-value">{task.title || 'Untitled Task'}</div>
          <div className="created-by-label">Created By:</div>
          <div className="created-by-value">
            {task.author?.username
              ? `${task.author.username} on ${new Date(task.createdAt).toLocaleDateString()}`
              : 'Author unknown'}
          </div>
          <div className="task-text">{task.text || 'No details available for this task.'}</div>
          {task.author?._id === user?._id && (
            <>
              <Link to={`/tasks/${taskId}/edit`}><button className="detailsEditButton">Edit</button>
              </Link>
            </>
          )}
        </section>
        <section className="comment-section">
          <h2>Enter your comment</h2>
          <CommentForm handleAddComment={handleAddComment} />
          <div className="comment-table-container">
            {(!task.comments || task.comments.length === 0) ? (
              <p>There are no comments yet.</p>
            ) : (
              <table className="comment-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Commenter</th>
                    <th>Comment</th>
                  </tr>
                </thead>
                <tbody>
                  {task.comments.map((comment) => (
                    <React.Fragment key={comment._id}>
                      <tr className="comment-header-row">
                        <td>{new Date(comment.createdAt).toLocaleDateString()}</td>
                        <td>{comment.author?.username || 'Unknown'}</td>
                        <td></td> {/* Empty cell for the header row's comment */}
                      </tr>
                      <tr className="comment-text-row">
                        <td colSpan="3">{comment.text || 'No text available'}</td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default TaskDetails;