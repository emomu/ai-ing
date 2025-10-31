import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

class GeminiService {
  constructor() {
    this.genAI = null;
    this.model = null;
    this.conversationHistory = [];
    this.systemContext = '';
  }

  initialize() {
    if (!API_KEY) {
      console.warn('Gemini API key not found. Please set REACT_APP_GEMINI_API_KEY in .env file');
      return;
    }
    this.genAI = new GoogleGenerativeAI(API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    console.log('Gemini service initialized with gemini-1.5-flash');
  }

  startConversation(level, userMemory) {
    if (!this.model) {
      throw new Error('Gemini service not initialized. Please set your API key in .env file.');
    }

    const levelDescriptions = {
      A1: 'beginner level (A1) - use very simple vocabulary, short sentences, present tense mostly',
      A2: 'elementary level (A2) - use simple vocabulary, basic grammar structures',
      B1: 'intermediate level (B1) - use everyday vocabulary, mix of tenses, clear explanations',
      B2: 'upper intermediate level (B2) - use varied vocabulary, complex sentences occasionally',
      C1: 'advanced level (C1) - use sophisticated vocabulary, complex grammar structures',
      C2: 'proficient level (C2) - use native-like expressions, idioms, and complex language',
    };

    const memoryContext = userMemory.length > 0
      ? `\n\nWhat you know about this user:\n${userMemory.map(m => `- ${m.content}`).join('\n')}`
      : '';

    this.systemContext = `You are a friendly English conversation partner helping someone learn English at ${levelDescriptions[level]}.

Your goals:
1. Have natural, engaging conversations appropriate for their level
2. Gently correct mistakes in a supportive way
3. Ask follow-up questions to keep the conversation flowing
4. Learn about the user and remember important details about them (hobbies, interests, goals, family, work, etc.)
5. When you learn something new about the user, mention it naturally in conversation

Guidelines:
- Keep responses conversational and natural (2-3 sentences max)
- Match the complexity to their level
- Be encouraging and supportive
- Ask open-ended questions
- Show genuine interest in their responses
- When you want to remember something about the user, say it naturally like "Oh, so you work as a teacher! I'll remember that."
${memoryContext}`;

    this.conversationHistory = [];
  }

  async sendMessage(message) {
    if (!this.model) {
      throw new Error('Gemini not initialized');
    }

    // Build the full prompt with context and history
    let fullPrompt = this.systemContext + '\n\n';

    if (this.conversationHistory.length > 0) {
      fullPrompt += 'Previous conversation:\n';
      this.conversationHistory.forEach(msg => {
        fullPrompt += `${msg.role}: ${msg.content}\n`;
      });
    }

    fullPrompt += `\nUser: ${message}\nAssistant:`;

    const result = await this.model.generateContent(fullPrompt);
    const response = result.response.text();

    // Save to history
    this.conversationHistory.push({ role: 'User', content: message });
    this.conversationHistory.push({ role: 'Assistant', content: response });

    // Keep only last 10 exchanges to avoid token limits
    if (this.conversationHistory.length > 20) {
      this.conversationHistory = this.conversationHistory.slice(-20);
    }

    return response;
  }

  extractMemoryFromResponse(response) {
    const memoryIndicators = [
      "I'll remember",
      "I'll note that",
      "Good to know",
      "So you",
      "I see you",
    ];

    for (const indicator of memoryIndicators) {
      if (response.toLowerCase().includes(indicator.toLowerCase())) {
        return true;
      }
    }
    return false;
  }
}

const geminiService = new GeminiService();
export default geminiService;
