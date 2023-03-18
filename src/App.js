import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import NewOperation from './pages/NewOperation';
import SignUp from './pages/signUp';
import UserRecords from './pages/UserRecords';
import SplashScreen from './pages/SplashScreen';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSplashScreen, setShowSplashScreen] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
    setTimeout(() => {
      setShowSplashScreen(false);
    }, 3000);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div className="App">
        {showSplashScreen ? (
          <SplashScreen />
        ) : (
          <>
            <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
            <Routes>
              <Route path="/" element={<Login onLogin={handleLogin} isLoggedIn={isLoggedIn} />} />
              <Route path="/login" element={<Login onLogin={handleLogin} isLoggedIn={isLoggedIn} />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/new-operation" element={<NewOperation isLoggedIn={isLoggedIn} />} />
              <Route path="/user-records" element={<UserRecords isLoggedIn={isLoggedIn} />} />
            </Routes>
          </>
        )}
      </div>
    </Router>
  );
}

export default App;






  
           

