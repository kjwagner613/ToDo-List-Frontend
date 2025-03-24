import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { signIn } from '../../services/authService';
import { UserContext } from '../../contexts/UserContext';
import './SignIn.css'

const SignInForm = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (evt) => {
    setMessage('');
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const signedInUser = await signIn(formData);
      setUser(signedInUser);
      navigate('/');
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <main>
      
      <div className="appcontainerSignIn">
        <p>{message}</p><div className="signInFormContainer">
        <h1 className="signInh1">Sign In</h1>
        <form autoComplete='off' onSubmit={handleSubmit}>
          <div className='SignIn-Form-Fields'>
            <label div className="signInLabel" htmlFor='email'>Username:</label>
            <input
              type='text'
              autoComplete='off'
              id='username'
              value={formData.username}
              name='username'
              onChange={handleChange}
              required />
          </div>
          <div className='SignIn-Form-Fields2'>
            <label div className="signInLabel2" htmlFor='password'>Password:</label>
            <input
              type='password'
              autoComplete='off'
              id='password'
              value={formData.password}
              name='password'
              onChange={handleChange}
              required />
          </div>
          <div>
           <span className="SignInButton"> <button >Sign In</button></span>
           <span className="CancelButton"><button  onClick={() => navigate('/')}>Cancel</button></span>
          </div>
            </form>
          </div>
        </div>
    </main>
  );
};

export default SignInForm;
