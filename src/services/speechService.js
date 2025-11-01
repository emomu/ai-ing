class SpeechService {
  constructor() {
    this.recognition = null;
    this.synthesis = window.speechSynthesis;
    this.isRecognitionSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  }

  initializeSpeechRecognition(onResult, onEnd, onError) {
    if (!this.isRecognitionSupported) {
      console.error('Speech recognition not supported in this browser');
      return null;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();

    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';

    this.recognition.onresult = (event) => {
      const results = Array.from(event.results);
      const transcript = results
        .map(result => result[0].transcript)
        .join(' ');

      const isFinal = results[results.length - 1].isFinal;

      if (onResult) {
        onResult(transcript, isFinal);
      }
    };

    this.recognition.onend = () => {
      if (onEnd) {
        onEnd();
      }
    };

    this.recognition.onerror = (event) => {
      // Ignore no-speech error - it's normal when user is silent
      if (event.error === 'no-speech') {
        console.log('No speech detected - this is normal');
        return;
      }

      console.error('Speech recognition error:', event.error);
      if (onError) {
        onError(event.error);
      }
    };

    return this.recognition;
  }

  startListening() {
    if (this.recognition) {
      this.recognition.start();
    }
  }

  stopListening() {
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  getAvailableVoices() {
    return this.synthesis ? this.synthesis.getVoices() : [];
  }

  speak(text, onStart, onEnd, voiceSettings = {}) {
    if (!this.synthesis) {
      console.error('Speech synthesis not supported');
      return;
    }

    // Cancel any ongoing speech
    this.synthesis.cancel();

    // Clean markdown formatting from text
    const cleanText = text
      .replace(/\*\*(.+?)\*\*/g, '$1')  // Remove bold **text**
      .replace(/\*(.+?)\*/g, '$1')      // Remove italic *text*
      .replace(/_(.+?)_/g, '$1')        // Remove italic _text_
      .replace(/`(.+?)`/g, '$1')        // Remove code `text`
      .replace(/\[(.+?)\]\(.+?\)/g, '$1') // Remove links [text](url)
      .replace(/#{1,6}\s/g, '')         // Remove headers
      .replace(/[😊😄😃😀🙂👍✨💪🎉🌟]/g, ''); // Remove common emojis

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'en-US';
    utterance.rate = voiceSettings.rate || 0.95; // Use custom rate or default
    utterance.pitch = voiceSettings.pitch || 1.1; // Use custom pitch or default
    utterance.volume = 1;

    // Get the best quality female English voice available
    const voices = this.synthesis.getVoices();

    let selectedVoice = null;

    // If user has selected a specific voice, use it
    if (voiceSettings.voiceName) {
      selectedVoice = voices.find(voice => voice.name === voiceSettings.voiceName);
    }

    // If no voice selected or not found, use default selection logic
    if (!selectedVoice) {
      // Try to find high quality female voices in order of preference
      const preferredVoiceNames = [
        'Samantha', // macOS - very natural
        'Google US English',
        'Microsoft Zira', // Windows
        'Karen', // macOS
        'Victoria', // macOS
        'Fiona', // macOS
        'Moira', // macOS
        'Tessa', // macOS
        'Veena', // macOS
      ];

      // First try to find a preferred voice
      for (const voiceName of preferredVoiceNames) {
        selectedVoice = voices.find(voice =>
          voice.name.includes(voiceName) && voice.lang.startsWith('en-')
        );
        if (selectedVoice) break;
      }

      // If no preferred voice found, try any female English voice
      if (!selectedVoice) {
        selectedVoice = voices.find(voice =>
          voice.lang.startsWith('en-') &&
          (voice.name.toLowerCase().includes('female') ||
           voice.name.toLowerCase().includes('woman'))
        );
      }

      // Fallback to any English voice
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => voice.lang.startsWith('en-'));
      }
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      console.log('Using voice:', selectedVoice.name);
    }

    utterance.onstart = () => {
      if (onStart) onStart();
    };

    utterance.onend = () => {
      if (onEnd) onEnd();
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      if (onEnd) onEnd();
    };

    this.synthesis.speak(utterance);
  }

  stopSpeaking() {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }

  isSpeaking() {
    return this.synthesis && this.synthesis.speaking;
  }
}

const speechService = new SpeechService();
export default speechService;
