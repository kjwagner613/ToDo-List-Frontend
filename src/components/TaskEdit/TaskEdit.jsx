import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import * as taskService from '../../services/taskService';
import '../components.css';
const TaskEdit = ({ handleUpdateTask }) => {
  const { taskId } = useParams(); 
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState({ title: '', text: '', category: '' }); // State for form inputs

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const fetchedTask = await taskService.show(taskId);
        setFormData({
          title: fetchedTask.title,
          text: fetchedTask.text,
          category: fetchedTask.category,
        });
      } catch (error) {
        console.error('Error fetching task data for editing:', error);
      }
    };
    fetchTask();
  }, [taskId]);

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      await taskService.update(taskId, formData); 
      handleUpdateTask(taskId, formData);
      navigate(`/tasks/${taskId}`); 
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <main>
      <h1>Edit Task</h1>
      <form onSubmit={handleSubmit}>
      <p>
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
        </label>
        <label>
          Text:
          <textarea
            name="text"
            value={formData.text}
            onChange={handleChange}
          />
        </label>
        <label>
          Category:
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Update Task</button>
        </p>
      </form>
    </main>
  );
};

export default TaskEdit;