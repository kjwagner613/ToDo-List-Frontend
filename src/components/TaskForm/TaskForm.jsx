import { useState, useEffect } from 'react';
import { useParams } from 'react-router';

import * as taskService from '../../services/taskService';

const TaskForm = (props) => {
  const { taskId } = useParams();
  console.log(taskId);

  const [formData, setFormData] = useState({
    title: '',
    text: '',
    category: 'Work',
  });

  useEffect(() => {
    const fetchTask = async () => {
      const taskData = await taskService.show(taskId);

      setFormData(taskData);
    };

    if (taskId) fetchTask();

    return () => setFormData({ title: '', text: '', category: 'Work' });
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
      <h1>{ taskId ? 'Edit Task' : 'New Task' }</h1>
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
          type='text'
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
          <option value='Home'>home</option>
          <option value='Work'>Work</option>
          <option value='Hobby'>Hobby</option>
          <option value='Personal'>Personal</option>
          <option value='Medical'>Medical</option>
          <option value='Entertainment'>Entertainment</option>
        </select>
        <button type='submit'>SUBMIT</button>
      </form>
    </main>
  );
};

export default TaskForm;
