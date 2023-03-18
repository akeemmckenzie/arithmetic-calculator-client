import React, { useState, useEffect } from 'react';
import { CircularProgress, Typography } from '@mui/material';

const SplashScreen = () => {
  const [showTitle, setShowTitle] = useState(false);
  const [showProgress, setShowProgress] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowTitle(true);
    }, 1000);

    setTimeout(() => {
      setShowProgress(true);
    }, 2000);
  }, []);

  return (
    <div className="splash-screen-container" style={containerStyle}>
      <div className="splash-screen" style={splashStyle}>
        <div className="splash-screen-circle" style={circleStyle}>
          <div className="splash-screen-letter" style={letterStyle}>A</div>
          <div className="splash-screen-letter" style={letterStyle}>R</div>
        </div>
        {showTitle && (
          <Typography variant="h4" className="splash-screen-title" style={titleStyle}>
            Arithmetic Calculator
          </Typography>
        )}
        {showProgress && (
          <div className="splash-screen-progress" style={progressStyle}>
            <CircularProgress size={60} />
          </div>
        )}
      </div>
    </div>
  );
};

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
};

const splashStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const circleStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100px',
  height: '100px',
  borderRadius: '50%',
  backgroundColor: '#2196f3',
  marginBottom: '30px',
  animation: 'dropIn 1s ease-out',
};

const letterStyle = {
  color: '#fff',
  fontSize: '60px',
  fontWeight: 'bold',
  textShadow: '2px 2px #888',
};

const titleStyle = {
  color: '#2196f3',
  marginBottom: '30px',
  animation: 'slideIn 1s ease-out',
};

const progressStyle = {
  animation: 'fadeIn 1s ease-out',
};

export default SplashScreen;

