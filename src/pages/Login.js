import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, TextField, Button, Box } from '@mui/material';

function Login({ onLogin, isLoggedIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/new-operation');
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/v1/login/', {
        username,
        password,
      });
      if (response.data) {
        localStorage.setItem('token', response.data.access);
        onLogin();
        navigate('new-operation');
      } else {
        setError('Unable to log in. Please try again.');
      }
    } catch (error) {
      setError('Unable to log in. Please try again.');
    }
  };

  const handleSignUp = () => {
    navigate('/sign-up');
  };
  

  return (
    <Container maxWidth="xs">
      <Box display="flex" flexDirection="column" alignItems="center" minHeight="100vh" justifyContent="center">
        <Typography variant="h4" gutterBottom>Login</Typography>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            margin="normal"
          />
          <Button type="submit" variant="contained" fullWidth>
            Login
          </Button>
          <Button
            type="button"
            variant="outlined"
            fullWidth
            onClick={handleSignUp}
            sx={{ marginTop: 1 }}
          >
            Sign Up
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default Login;
