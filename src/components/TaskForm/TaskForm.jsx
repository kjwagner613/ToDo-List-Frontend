import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import * as taskService from '../../services/taskService';

const TaskForm = (props) => {
  const { taskId } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    text: '',
    category: 'Work',
  });

  useEffect(() => {
    if (taskId) {
      const fetchTask = async () => {
        try {
          const taskData = await taskService.show(taskId);
          setFormData(taskData);
        } catch (error) {
          console.error('Error fetching task:', error);
        }
      };
      fetchTask();
    }
  }, [taskId]);

  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (taskId) {
      props.handleUpdateTask(taskId, formData);
    } else {
      props.handleAddTask(formData);
    }
  };

  return (
    <main>
      <h1>{taskId ? 'Edit Task' : 'New Task'}</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor='title-input'>Title</label>
        <input
          required
          type='text'
          name='title'
          id='title-input'
          value={formData.title}
          onChange={handleChange}
        />
        <label htmlFor='text-input'>Text</label>
        <textarea
          required
          name='text'
          id='text-input'
          value={formData.text}
          onChange={handleChange}
        />
        <label htmlFor='category-input'>Category</label>
        <select
          required
          name='category'
          id='category-input'
          value={formData.category}
          onChange={handleChange}
        >
          <option value='Home'>Home</option>
          <option value='Work'>Work</option>
          <option value='Hobby'>Hobby</option>
          <option value='Personal'>Personal</option>
          <option value='Medical'>Medical</option>
          <option value='Entertainment'>Entertainment</option>
        </select>
        <button type='submit'>Submit</button>
      </form>
    </main>
  );
};

export default TaskForm;
