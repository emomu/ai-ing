import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

class TranslationService {
  constructor() {
    this.genAI = null;
    this.model = null;
  }

  initialize() {
    if (!API_KEY) {
      console.warn('API key not found for translation');
      return;
    }
    this.genAI = new GoogleGenerativeAI(API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }

  async translate(text, targetLang) {
    if (!this.model) {
      this.initialize();
    }

    if (!this.model) {
      return text; // Return original if translation fails
    }

    const langNames = {
      tr: 'Turkish',
      en: 'English',
    };

    const prompt = `Translate the following English text to ${langNames[targetLang]}. Only provide the translation, nothing else:

"${text}"`;

    try {
      const result = await this.model.generateContent(prompt);
      const translation = result.response.text().trim();
      // Remove quotes if present
      return translation.replace(/^["']|["']$/g, '');
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
  }
}

const translationService = new TranslationService();
export default translationService;
