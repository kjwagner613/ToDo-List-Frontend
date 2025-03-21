import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import * as taskService from '../../services/taskService';
import '../../index.css'; 

const TaskEdit = ({ handleUpdateTask }) => {
  const { taskId } = useParams(); 
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState({ title: '', text: '', category: 'Work' }); // Default category

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
      <div className="component-container">
        <h1>Edit Task</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor='title-input'>Title:</label>
            <input
              type="text"
              name="title"
              id="title-input" // Added ID
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor='text-input'>Text:</label>
            <textarea
              name="text"
              id="text-input" // Added ID
              value={formData.text}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor='category-input'>Category:</label>
            <select
              name="category"
              id="category-input" 
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value='Home'>Home</option>
              <option value='Work'>Work</option>
              <option value='Hobby'>Hobby</option>
              <option value='Personal'>Personal</option>
              <option value='Medical'>Medical</option>
              <option value='Entertainment'>Entertainment</option>
            </select>
          </div>
          <button type="submit">Update Task</button>
        </form>
      </div>
    </main>
  );
};

export default TaskEdit;
