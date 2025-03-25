import React, { useState } from 'react';
import './CommentForm.css';

const CommentForm = ({ handleAddComment }) => {
  const [formData, setFormData] = useState({ text: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target; 
  
    if (form.checkValidity()) {
      
      handleAddComment(formData);
      setFormData({ text: '' }); 
    } else {
      
      
      console.log("Comment form is invalid");
    }
  };

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <textarea
        required
        name="text"
        id="text-input"
        value={formData.text}
        onChange={handleChange}
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default CommentForm;