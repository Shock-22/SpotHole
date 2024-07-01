  import React from 'react';
  import { Link, useNavigate } from 'react-router-dom';

  const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    };

    return (
      <nav>
        <ul>
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>
            <Link to="/report">Report Page</Link>
          </li>
          <li className="nav-item">
              <Link className="nav-link" to="/status">Status Page</Link>
            </li>
          <li>
            <button onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </nav>
    );
  };

  export default Navbar;
