import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import VoiceCall from './components/VoiceCall';
import Settings from './components/Settings';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import useStore from './store/useStore';
import './App.css';

function App() {
  const { theme } = useStore();

  return (
    <ErrorBoundary>
      <Router>
        <div className={`app ${theme}`}>
          <Navigation />
          <Suspense fallback={<LoadingSpinner size="large" message="Yükleniyor..." />}>
            <Routes>
              <Route path="/" element={<VoiceCall />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
