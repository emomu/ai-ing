import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';
import geminiService from '../services/geminiService';
import speechService from '../services/speechService';
import translationService from '../services/translationService';
import { useTranslation } from '../utils/translations';
import WaveAnimation from './WaveAnimation';
import MemoryNotification from './MemoryNotification';
import '../styles/VoiceCall.css';

const VoiceCall = () => {
  const {
    theme,
    level,
    showAnimations,
    interfaceLanguage,
    showTranslation,
    isCallActive,
    setCallActive,
    isSpeaking,
    setIsSpeaking,
    isListening,
    setIsListening,
    addMessage,
    addMemory,
    userMemory,
    showMemoryNotification,
    setShowMemoryNotification,
  } = useStore();

  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiResponseTranslated, setAiResponseTranslated] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isPreparingVoice, setIsPreparingVoice] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const recognitionRef = useRef(null);
  const isCallActiveRef = useRef(false);
  const silenceTimerRef = useRef(null);
  const currentTranscriptRef = useRef('');
  const isDark = theme === 'dark';
  const t = useTranslation(interfaceLanguage);

  // Keep ref in sync with state
  useEffect(() => {
    isCallActiveRef.current = isCallActive;
  }, [isCallActive]);

  useEffect(() => {
    geminiService.initialize();
    setIsInitialized(true);

    return () => {
      if (recognitionRef.current) {
        speechService.stopListening();
      }
      speechService.stopSpeaking();
    };
  }, []);

  const startCall = async () => {
    try {
      setError('');
      setCallActive(true);
      setIsInitializing(true);
      geminiService.startConversation(level, userMemory);

      const greeting = await geminiService.sendMessage('Start the conversation with a greeting');
      setIsInitializing(false);
      setAiResponse(greeting);
      addMessage({ role: 'ai', content: greeting, timestamp: new Date().toISOString() });

      speechService.speak(
        greeting,
        () => setIsSpeaking(true),
        () => {
          setIsSpeaking(false);
          startListening();
        }
      );
    } catch (err) {
      setError(err.message || 'Failed to start conversation. Please check your API key in .env file.');
      setCallActive(false);
      setIsInitializing(false);
      console.error('Error starting call:', err);
    }
  };

  const startListening = () => {
    console.log('Starting to listen...');

    // Clear any existing silence timer
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    // Reset transcript
    currentTranscriptRef.current = '';

    // Reinitialize recognition every time for clean state
    if (recognitionRef.current) {
      try {
        speechService.stopListening();
      } catch (e) {
        console.log('Stopped previous recognition');
      }
    }

    recognitionRef.current = speechService.initializeSpeechRecognition(
      (text, isFinal) => {
        console.log('Transcript:', text, 'isFinal:', isFinal);
        setTranscript(text);
        currentTranscriptRef.current = text;

        // Clear existing silence timer
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
        }

        // If there's text, start a 3-second silence timer
        if (text.trim()) {
          silenceTimerRef.current = setTimeout(() => {
            console.log('3 seconds of silence detected, finalizing speech...');
            if (currentTranscriptRef.current.trim()) {
              handleUserMessage(currentTranscriptRef.current);
              currentTranscriptRef.current = '';
            }
          }, 3000); // 3 seconds of silence before finalizing
        }
      },
      () => {
        console.log('Recognition ended naturally');
        setIsListening(false);
      },
      (error) => {
        console.error('Recognition error:', error);
        setIsListening(false);
      }
    );

    setIsListening(true);
    try {
      speechService.startListening();
      console.log('Successfully started listening');
    } catch (error) {
      console.error('Failed to start listening:', error);
      setIsListening(false);
    }
  };

  const handleUserMessage = async (message) => {
    if (!message.trim()) return;

    console.log('Handling user message:', message);

    // Clear any pending silence timer
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    addMessage({ role: 'user', content: message, timestamp: new Date().toISOString() });
    setTranscript('');
    setIsListening(false);
    setIsThinking(true); // AI is thinking

    // Stop listening while processing
    try {
      speechService.stopListening();
    } catch (e) {
      console.log('Error stopping recognition:', e);
    }

    try {
      const response = await geminiService.sendMessage(message);
      setIsThinking(false); // AI finished thinking
      setAiResponse(response);
      addMessage({ role: 'ai', content: response, timestamp: new Date().toISOString() });

      // Translate if needed
      if (showTranslation && interfaceLanguage !== 'en') {
        setIsTranslating(true); // Start translating
        const translated = await translationService.translate(response, interfaceLanguage);
        setAiResponseTranslated(translated);
        setIsTranslating(false); // Translation complete
      } else {
        setAiResponseTranslated('');
      }

      const shouldSaveMemory = geminiService.extractMemoryFromResponse(response);
      if (shouldSaveMemory) {
        const memoryContent = `Learned from conversation on ${new Date().toLocaleDateString()}: ${message}`;
        addMemory(memoryContent);
        setShowMemoryNotification(true);
        playMemorySound();
        setTimeout(() => setShowMemoryNotification(false), 3000);
      }

      // Preparing to speak
      setIsPreparingVoice(true);

      speechService.speak(
        response,
        () => {
          console.log('AI started speaking');
          setIsPreparingVoice(false); // Voice preparation complete
          setIsSpeaking(true);
        },
        () => {
          console.log('AI finished speaking');
          setIsSpeaking(false);

          // Restart listening immediately after AI finishes speaking
          if (isCallActiveRef.current) {
            console.log('Restarting listening...');
            startListening();
          } else {
            console.log('Call not active, not restarting listening');
          }
        }
      );
    } catch (error) {
      console.error('Error getting AI response:', error);
      setError('Failed to get response. Please try again.');
      setIsThinking(false); // Clear thinking state on error
      setIsTranslating(false); // Clear translating state on error
      setIsPreparingVoice(false); // Clear preparing voice state on error

      // Restart listening on error
      if (isCallActiveRef.current) {
        setTimeout(() => {
          if (isCallActiveRef.current) {
            startListening();
          }
        }, 1000);
      }
    }
  };

  const endCall = () => {
    // Clear silence timer
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    setCallActive(false);
    setIsListening(false);
    setIsSpeaking(false);
    speechService.stopListening();
    speechService.stopSpeaking();
    setTranscript('');
    setAiResponse('');
    currentTranscriptRef.current = '';
  };

  const playMemorySound = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  return (
    <div className={`voice-call ${isDark ? 'dark' : 'light'}`}>
      <div className="voice-call-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="call-content"
        >
          {!isCallActive ? (
            <div className="pre-call">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="level-badge"
              >
                {t('level')}: {level}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="title"
              >
                {t('aiEnglishPractice')}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="subtitle"
              >
                {t('startConversationSubtitle')}
              </motion.p>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="error-message"
                >
                  {error}
                </motion.div>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startCall}
                className="start-call-btn"
                disabled={!isInitialized}
              >
                {t('startConversation')}
              </motion.button>
            </div>
          ) : (
            <div className="active-call">
              <div className="wave-container">
                {showAnimations && <WaveAnimation isActive={isSpeaking} isDark={isDark} />}
              </div>

              <div className="status-indicators">
                <AnimatePresence>
                  {isInitializing && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="status-badge initializing"
                    >
                      {t('initializing')}
                    </motion.div>
                  )}
                  {isSpeaking && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="status-badge speaking"
                    >
                      {t('aiSpeaking')}
                    </motion.div>
                  )}
                  {isThinking && !isSpeaking && !isInitializing && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="status-badge thinking"
                    >
                      {t('thinking')}
                    </motion.div>
                  )}
                  {isTranslating && !isSpeaking && !isThinking && !isInitializing && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="status-badge translating"
                    >
                      {t('translating')}
                    </motion.div>
                  )}
                  {isPreparingVoice && !isSpeaking && !isThinking && !isTranslating && !isInitializing && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="status-badge preparing"
                    >
                      {t('preparingVoice')}
                    </motion.div>
                  )}
                  {isListening && !isSpeaking && !isThinking && !isTranslating && !isPreparingVoice && !isInitializing && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="status-badge listening"
                    >
                      {t('listening')}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {transcript && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="transcript"
                >
                  {transcript}
                </motion.div>
              )}

              {!isListening && !isSpeaking && !isThinking && !isTranslating && !isPreparingVoice && !isInitializing && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={startListening}
                  className="mic-button"
                  title="Click to start speaking"
                >
                  🎤
                </motion.button>
              )}

              {aiResponse && showAnimations && (
                <div className="ai-response-container">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.7 }}
                    className="ai-response"
                  >
                    {aiResponse}
                  </motion.div>
                  {showTranslation && aiResponseTranslated && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 0.6, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="ai-response-translated"
                    >
                      {aiResponseTranslated}
                    </motion.div>
                  )}
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={endCall}
                className="end-call-btn"
              >
                {t('endConversation')}
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>

      <MemoryNotification show={showMemoryNotification} isDark={isDark} />
    </div>
  );
};

export default VoiceCall;
