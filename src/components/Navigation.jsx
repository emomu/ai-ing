import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import useStore from '../store/useStore';
import { useTranslation } from '../utils/translations';
import '../styles/Navigation.css';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, interfaceLanguage } = useStore();
  const isDark = theme === 'dark';
  const t = useTranslation(interfaceLanguage);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navigation ${isDark ? 'dark' : 'light'}`}>
      <div className="nav-container">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="nav-brand"
        >
          <span className="brand-icon">🎯</span>
          <span className="brand-text">AI English</span>
        </motion.div>

        <div className="nav-links">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
            onClick={() => navigate('/')}
          >
            <span className="nav-icon">🎤</span>
            <span className="nav-text">{t('practice')}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`nav-link ${isActive('/settings') ? 'active' : ''}`}
            onClick={() => navigate('/settings')}
          >
            <span className="nav-icon">⚙️</span>
            <span className="nav-text">{t('settings')}</span>
          </motion.button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
