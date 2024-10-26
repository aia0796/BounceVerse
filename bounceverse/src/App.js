import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Landing from './components/Landing';
import Game from './components/Game';
import Navbar from './components/Navbar';

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  return (
    <ThemeProvider value={{ isDarkMode, setIsDarkMode }}>
      <Router>
        <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/game" element={<Game />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
