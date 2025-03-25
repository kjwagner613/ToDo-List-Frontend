import React, { useState } from 'react';
import './CommentForm.css';

const CommentForm = ({ handleAddComment }) => {
  const [formData, setFormData] = useState({ text: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target; // Get the form element
  
    if (form.checkValidity()) {
      // Form is valid, proceed with adding the comment
      handleAddComment(formData);
      setFormData({ text: '' }); // Clear the form after submission
    } else {
      // Form is invalid, browser will show default messages
      // You could optionally add custom visual feedback here
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