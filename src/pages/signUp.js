import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, TextField, Button, Box } from '@mui/material';

function SignUp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://arithmetic-calculator.herokuapp.com/api/v1/signup/', {
        username,
        password,
      });
      if (response.status === 201) {
        navigate('/login');
      } else {
        setError('Unable to sign up. Please try again.');
      }
    } catch (error) {
      setError('Unable to sign up. Please try again.');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box display="flex" flexDirection="column" alignItems="center" minHeight="100vh" justifyContent="center">
        <Typography variant="h4" gutterBottom>Sign Up</Typography>
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
            Sign Up
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default SignUp;
