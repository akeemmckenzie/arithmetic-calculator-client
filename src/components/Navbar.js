import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ isLoggedIn, onLogout }) => {
  const navigate = useNavigate();

  const handleNewOperationClick = () => {
    navigate('/new-operation');
  };

  const handleUserRecordsClick = () => {
    navigate('/user-records');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Arithmetic Calculator
        </Typography>
        {isLoggedIn && (
          <>
            <Button color="inherit" onClick={handleNewOperationClick}>
              New Operation
            </Button>
            <Button color="inherit" onClick={handleUserRecordsClick}>
              User Records
            </Button>
            <Button color="inherit" onClick={onLogout}>
              Sign Out
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;


