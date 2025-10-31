import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set, get) => ({
      // Theme settings
      theme: 'light',
      setTheme: (theme) => set({ theme }),

      // User settings
      level: 'A1',
      setLevel: (level) => set({ level }),

      // Animation settings
      showAnimations: true,
      setShowAnimations: (show) => set({ showAnimations: show }),

      // Language settings
      interfaceLanguage: 'tr', // tr, en
      setInterfaceLanguage: (lang) => set({ interfaceLanguage: lang }),

      // Translation settings
      showTranslation: false,
      setShowTranslation: (show) => set({ showTranslation: show }),

      // User memory - AI learns about the user
      userMemory: [],
      addMemory: (memory) => {
        const newMemory = {
          id: Date.now(),
          content: memory,
          timestamp: new Date().toISOString(),
        };
        set((state) => ({
          userMemory: [...state.userMemory, newMemory],
        }));
        return newMemory;
      },

      // Conversation history
      conversationHistory: [],
      addMessage: (message) =>
        set((state) => ({
          conversationHistory: [...state.conversationHistory, message],
        })),
      clearHistory: () => set({ conversationHistory: [] }),

      // Voice call state
      isCallActive: false,
      setCallActive: (active) => set({ isCallActive: active }),

      isSpeaking: false,
      setIsSpeaking: (speaking) => set({ isSpeaking: speaking }),

      isListening: false,
      setIsListening: (listening) => set({ isListening: listening }),

      // Show memory saved notification
      showMemoryNotification: false,
      setShowMemoryNotification: (show) => set({ showMemoryNotification: show }),
    }),
    {
      name: 'ai-english-learning-storage',
      partialize: (state) => ({
        theme: state.theme,
        level: state.level,
        showAnimations: state.showAnimations,
        interfaceLanguage: state.interfaceLanguage,
        showTranslation: state.showTranslation,
        userMemory: state.userMemory,
        conversationHistory: state.conversationHistory,
      }),
    }
  )
);

export default useStore;
