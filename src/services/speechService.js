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

  speak(text, onStart, onEnd) {
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
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Get English voices
    const voices = this.synthesis.getVoices();
    const englishVoice = voices.find(voice =>
      voice.lang.startsWith('en-') && voice.name.includes('Female')
    ) || voices.find(voice => voice.lang.startsWith('en-'));

    if (englishVoice) {
      utterance.voice = englishVoice;
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
