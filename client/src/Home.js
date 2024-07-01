import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import  './Home.css'

const Home = () => {
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {
      setUser(user);
    }

    axios.get('http://localhost:5000/home', { headers: { Authorization: token } })
      .then(response => {
        setMessage(response.data.message);
      })
      .catch(error => {
        console.error('There was an error fetching the data!', error);
      });
  }, []);

  return (
    <div>
      <Navbar />
      <h1>Home Page</h1>
      {user && <p>Welcome, {user.name} ({user.id})</p>}
      <p>{message}</p>
    </div>
  );
};

export default Home;