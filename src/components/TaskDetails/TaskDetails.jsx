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
  const [editingCommentId, setEditingCommentId] = useState(null); // Track the comment being edited
  const [updatedText, setUpdatedText] = useState(""); // Track the updated text
  const [errorMessage, setErrorMessage] = useState(""); // Tracks error messages

  const handleEditClick = (comment) => {
    setEditingCommentId(comment._id);
    setUpdatedText(comment.text);
  };

  const handleCancelClick = () => {
    setEditingCommentId(null);
    setUpdatedText("");
  };
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveClick = async (commentId) => {
    setErrorMessage(""); // Clear any previous errors
    try {
      const updatedComment = await taskService.updateComment(taskId, commentId, { text: updatedText });
      setTask((prevTask) => ({
        ...prevTask,
        comments: prevTask.comments.map((comment) =>
          comment._id === commentId ? updatedComment : comment
        ),
      }));
      setEditingCommentId(null);
      setUpdatedText("");
    } catch (error) {
      console.error("Error saving comment:", error);
      setErrorMessage("Failed to update the comment. Please try again.");
    }
  };


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
        <h1 className="taskDetailh1">Task Details</h1>
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
                    <tr key={comment._id} className="comment-row">
                      <td>{new Date(comment.createdAt).toLocaleDateString()}</td>
                      <td>{comment.author?.username || "Unknown"}</td>
                      <td>
                        {editingCommentId === comment._id ? (
                          <input
                            type="text"
                            value={updatedText}
                            onChange={(e) => setUpdatedText(e.target.value)}
                          />
                        ) : (
                          comment.text || "No text available"
                        )}
                      </td>
                      <td>
                        {editingCommentId === comment._id ? (
                          <>
                            <button onClick={() => handleSaveClick(comment._id)} disabled={isSaving}>
                              Save
                            </button>
                            <button onClick={handleCancelClick} disabled={isSaving}>
                              Cancel
                            </button>

                          </>
                        ) : (
                          <button onClick={() => handleEditClick(comment)}>Edit</button>
                        )}
                      </td>
                    </tr>
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