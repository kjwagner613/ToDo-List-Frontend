import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import './NavBar.css';

const NavBar = () => {
  const { user, setUser } = useContext(UserContext);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <nav>
      {user ? (
        <>
          <div className="welcome"></div>
          <ul className="nav-links">
            <li><Link to='/'>Dashboard</Link></li>
            <li><Link to='/tasks/new'>New Task</Link></li>
            <li><Link to="/tasks/update">Update Task</Link></li>
            <li><Link to="/tasks/TaskDeleteSelect">Delete Task</Link></li>
            <li><Link to="/tasks/">Task List</Link></li>
            <li><Link to='/' onClick={handleSignOut}>Sign Out</Link></li>
          </ul>
        </>
      ) : (
        <ul className="nav-links">
          <li><Link to='/'>Home</Link></li>
          <li><Link to='/sign-in'>Sign In</Link></li>
          <li><Link to='/sign-up'>Sign Up</Link></li>
        </ul>
      )}
    </nav>
  );
};

export default NavBar;
