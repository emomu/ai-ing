import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useStore from '../store/useStore';
import { useTranslation } from '../utils/translations';
import speechService from '../services/speechService';
import '../styles/Settings.css';

const Settings = () => {
  const {
    theme,
    setTheme,
    level,
    setLevel,
    showAnimations,
    setShowAnimations,
    interfaceLanguage,
    setInterfaceLanguage,
    showTranslation,
    setShowTranslation,
    voiceRate,
    setVoiceRate,
    voicePitch,
    setVoicePitch,
    selectedVoiceName,
    setSelectedVoiceName,
    userMemory,
  } = useStore();

  const [availableVoices, setAvailableVoices] = useState([]);
  const [isLoadingVoices, setIsLoadingVoices] = useState(true);
  const [isTestingVoice, setIsTestingVoice] = useState(false);

  const isDark = theme === 'dark';
  const t = useTranslation(interfaceLanguage);
  const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const languages = [
    { code: 'tr', name: 'Türkçe' },
    { code: 'en', name: 'English' },
  ];

  useEffect(() => {
    // Load available voices
    const loadVoices = () => {
      const voices = speechService.getAvailableVoices();
      // Filter only English voices
      const englishVoices = voices.filter(voice => voice.lang.startsWith('en-'));
      setAvailableVoices(englishVoices);
      setIsLoadingVoices(false);
    };

    // Voices might not be loaded immediately
    loadVoices();
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    // Timeout to stop loading if voices don't load
    const timeout = setTimeout(() => {
      setIsLoadingVoices(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  const getLevelDescription = (level) => {
    return t(`level${level}`);
  };

  const handleTestVoice = () => {
    setIsTestingVoice(true);
    const testText = "Hello! This is how I sound. How are you today?";
    speechService.speak(
      testText,
      () => {},
      () => {
        setIsTestingVoice(false);
      },
      {
        rate: voiceRate,
        pitch: voicePitch,
        voiceName: selectedVoiceName,
      }
    );
  };

  return (
    <div className={`settings ${isDark ? 'dark' : 'light'}`}>
      <div className="settings-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="settings-title">{t('settingsTitle')}</h1>

          <div className="settings-section">
            <h2 className="section-title">{t('appearance')}</h2>
            <div className="setting-item">
              <div className="setting-info">
                <label className="setting-label">{t('theme')}</label>
                <p className="setting-description">{t('themeDescription')}</p>
              </div>
              <div className="theme-toggle">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className={`theme-btn ${!isDark ? 'active' : ''}`}
                  onClick={() => setTheme('light')}
                >
                  {t('light')}
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className={`theme-btn ${isDark ? 'active' : ''}`}
                  onClick={() => setTheme('dark')}
                >
                  {t('dark')}
                </motion.button>
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label className="setting-label">{t('animations')}</label>
                <p className="setting-description">{t('animationsDescription')}</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className={`toggle-btn ${showAnimations ? 'active' : ''}`}
                onClick={() => setShowAnimations(!showAnimations)}
              >
                <motion.div
                  className="toggle-slider"
                  animate={{ x: showAnimations ? 24 : 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              </motion.button>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label className="setting-label">{t('interfaceLanguage')}</label>
                <p className="setting-description">{t('interfaceLanguageDescription')}</p>
              </div>
              <div className="theme-toggle">
                {languages.map((lang) => (
                  <motion.button
                    key={lang.code}
                    whileTap={{ scale: 0.95 }}
                    className={`theme-btn ${interfaceLanguage === lang.code ? 'active' : ''}`}
                    onClick={() => setInterfaceLanguage(lang.code)}
                  >
                    {lang.name}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label className="setting-label">{t('translation')}</label>
                <p className="setting-description">{t('translationDescription')}</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className={`toggle-btn ${showTranslation ? 'active' : ''}`}
                onClick={() => setShowTranslation(!showTranslation)}
              >
                <motion.div
                  className="toggle-slider"
                  animate={{ x: showTranslation ? 24 : 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              </motion.button>
            </div>
          </div>

          <div className="settings-section">
            <h2 className="section-title">{t('voiceSettings')}</h2>

            <div className="setting-item">
              <div className="setting-info">
                <label className="setting-label">{t('voiceSelection')}</label>
              </div>
              {isLoadingVoices ? (
                <div className="loading-voices">Yükleniyor...</div>
              ) : (
                <select
                  className="voice-select"
                  value={selectedVoiceName}
                  onChange={(e) => setSelectedVoiceName(e.target.value)}
                  disabled={availableVoices.length === 0}
                >
                  <option value="">{t('selectVoice')}</option>
                  {availableVoices.map((voice) => (
                    <option key={voice.name} value={voice.name}>
                      {voice.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label className="setting-label">{t('voiceSpeed')}: {voiceRate.toFixed(2)}x</label>
              </div>
              <div className="slider-container">
                <span className="slider-label">{t('slow')}</span>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.05"
                  value={voiceRate}
                  onChange={(e) => setVoiceRate(parseFloat(e.target.value))}
                  className="voice-slider"
                />
                <span className="slider-label">{t('fast')}</span>
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <label className="setting-label">{t('voicePitch')}: {voicePitch.toFixed(2)}</label>
              </div>
              <div className="slider-container">
                <span className="slider-label">{t('low')}</span>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={voicePitch}
                  onChange={(e) => setVoicePitch(parseFloat(e.target.value))}
                  className="voice-slider"
                />
                <span className="slider-label">{t('high')}</span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: isTestingVoice ? 1 : 1.02 }}
              whileTap={{ scale: isTestingVoice ? 1 : 0.98 }}
              onClick={handleTestVoice}
              className="test-voice-btn"
              disabled={isTestingVoice || availableVoices.length === 0}
              style={{ opacity: isTestingVoice ? 0.7 : 1 }}
            >
              {isTestingVoice ? '🔊 Test ediliyor...' : `🎤 ${t('testVoice')}`}
            </motion.button>
          </div>

          <div className="settings-section">
            <h2 className="section-title">{t('learningLevel')}</h2>
            <div className="setting-item">
              <div className="setting-info">
                <label className="setting-label">{t('currentLevel')}: {level}</label>
                <p className="setting-description">{getLevelDescription(level)}</p>
              </div>
            </div>
            <div className="level-grid">
              {levels.map((lvl) => (
                <motion.button
                  key={lvl}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`level-btn ${level === lvl ? 'active' : ''}`}
                  onClick={() => setLevel(lvl)}
                >
                  {lvl}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="settings-section">
            <h2 className="section-title">{t('memory')}</h2>
            <div className="setting-item">
              <div className="setting-info">
                <label className="setting-label">{t('storedMemories')}</label>
                <p className="setting-description">
                  {userMemory.length} {t('memoriesCount')}
                </p>
              </div>
            </div>
            {userMemory.length > 0 && (
              <div className="memory-list">
                {userMemory.slice(-5).reverse().map((memory) => (
                  <motion.div
                    key={memory.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="memory-item"
                  >
                    <div className="memory-icon">💭</div>
                    <div className="memory-content">
                      <p className="memory-text">{memory.content}</p>
                      <span className="memory-date">
                        {new Date(memory.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
