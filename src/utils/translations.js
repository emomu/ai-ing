export const translations = {
  tr: {
    // Navigation
    practice: 'Pratik',
    settings: 'Ayarlar',

    // Voice Call
    aiEnglishPractice: 'AI İngilizce Pratiği',
    startConversationSubtitle: 'İngilizcenizi geliştirmek için sohbete başlayın',
    startConversation: 'Sohbeti Başlat',
    endConversation: 'Sohbeti Bitir',
    aiSpeaking: 'AI konuşuyor...',
    listening: 'Dinliyor...',
    thinking: 'Düşünüyor...',
    translating: 'Çeviriyor...',
    preparingVoice: 'Sesli yanıta hazırlanıyor...',
    initializing: 'Başlatılıyor...',
    level: 'Seviye',

    // Settings
    settingsTitle: 'Ayarlar',
    appearance: 'Görünüm',
    theme: 'Tema',
    themeDescription: 'Tercih ettiğiniz renk şemasını seçin',
    light: 'Açık',
    dark: 'Koyu',
    animations: 'Animasyonlar',
    animationsDescription: 'Konuşmalar sırasında görsel animasyonları göster',
    interfaceLanguage: 'Arayüz Dili',
    interfaceLanguageDescription: 'Tercih ettiğiniz arayüz dilini seçin',
    translation: 'Çeviri',
    translationDescription: 'AI yanıtlarının altında çeviri göster',
    learningLevel: 'Öğrenme Seviyesi',
    currentLevel: 'Mevcut Seviye',
    memory: 'Bellek',
    storedMemories: 'Kaydedilmiş Anılar',
    memoriesCount: 'anı kaydedildi',

    // Level descriptions
    levelA1: 'Başlangıç - Temel ifadeler ve basit cümleler',
    levelA2: 'Temel - Basit günlük konuşmalar',
    levelB1: 'Orta - Açık ve standart konuşma',
    levelB2: 'Orta Üstü - Karmaşık metinler ve konuşmalar',
    levelC1: 'İleri - Akıcı ve gelişmiş dil',
    levelC2: 'Profesyonel - Ana dil gibi akıcılık',

    // Memory notification
    memorySaved: 'Belleğe Kaydedildi',
  },
  en: {
    // Navigation
    practice: 'Practice',
    settings: 'Settings',

    // Voice Call
    aiEnglishPractice: 'AI English Practice',
    startConversationSubtitle: 'Start a conversation to improve your English',
    startConversation: 'Start Conversation',
    endConversation: 'End Conversation',
    aiSpeaking: 'AI is speaking...',
    listening: 'Listening...',
    thinking: 'Thinking...',
    translating: 'Translating...',
    preparingVoice: 'Preparing voice response...',
    initializing: 'Initializing...',
    level: 'Level',

    // Settings
    settingsTitle: 'Settings',
    appearance: 'Appearance',
    theme: 'Theme',
    themeDescription: 'Choose your preferred color scheme',
    light: 'Light',
    dark: 'Dark',
    animations: 'Animations',
    animationsDescription: 'Show visual animations during conversations',
    interfaceLanguage: 'Interface Language',
    interfaceLanguageDescription: 'Choose your preferred interface language',
    translation: 'Translation',
    translationDescription: 'Show translations under AI responses',
    learningLevel: 'Learning Level',
    currentLevel: 'Current Level',
    memory: 'Memory',
    storedMemories: 'Stored Memories',
    memoriesCount: 'memories saved',

    // Level descriptions
    levelA1: 'Beginner - Basic phrases and simple sentences',
    levelA2: 'Elementary - Simple everyday conversations',
    levelB1: 'Intermediate - Clear standard speech',
    levelB2: 'Upper Intermediate - Complex texts and conversations',
    levelC1: 'Advanced - Fluent and sophisticated language',
    levelC2: 'Proficient - Native-like fluency',

    // Memory notification
    memorySaved: 'Memory Saved',
  },
};

export const useTranslation = (interfaceLanguage) => {
  return (key) => {
    return translations[interfaceLanguage]?.[key] || translations.en[key] || key;
  };
};
