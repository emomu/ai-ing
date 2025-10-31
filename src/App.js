import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import VoiceCall from './components/VoiceCall';
import Settings from './components/Settings';
import useStore from './store/useStore';
import './App.css';

function App() {
  const { theme } = useStore();

  return (
    <Router>
      <div className={`app ${theme}`}>
        <Navigation />
        <Routes>
          <Route path="/" element={<VoiceCall />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
