# AI English Learning App

A modern, interactive web application for practicing English conversation with AI. Built with React, Gemini AI, and Web Speech API.

## Features

- **Voice Conversations**: Natural voice conversations with AI at your level
- **Adaptive Learning**: AI adjusts conversation complexity based on your English level (A1-C2)
- **Memory System**: AI learns about you and remembers important details
- **Real-time Transcription**: See what you're saying in real-time
- **Beautiful Animations**: Smooth, ChatGPT-style wave animations during conversations
- **Dark/Light Theme**: Toggle between elegant dark and light themes
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **No Login Required**: Start practicing immediately

## Tech Stack

- React 19
- Zustand (State Management)
- Framer Motion (Animations)
- Google Gemini AI
- Web Speech API
- React Router

## Getting Started

### Prerequisites

- Node.js 14 or higher
- A Google Gemini API key

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd ai-ing
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

4. Add your Gemini API key to `.env`:
```
REACT_APP_GEMINI_API_KEY=your_actual_api_key_here
```

To get a Gemini API key:
- Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
- Sign in with your Google account
- Click "Create API Key"
- Copy and paste it into your `.env` file

5. Start the development server:
```bash
npm start
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Starting a Conversation

1. Make sure your microphone is enabled
2. Select your English level in Settings (A1-C2)
3. Click "Start Conversation" on the main page
4. The AI will greet you and start the conversation
5. Speak naturally - the AI will respond and adjust to your level

### Settings

- **Theme**: Switch between light and dark mode
- **Animations**: Toggle wave animations on/off
- **Level**: Choose your English proficiency level (A1-C2)
- **Memory**: View what the AI has learned about you

### Memory System

The AI automatically saves interesting facts about you during conversations. When it learns something new, you'll see a "Memory Saved" notification with a sound effect.

## Browser Compatibility

This app works best in modern browsers that support the Web Speech API:
- Chrome/Edge (recommended)
- Safari
- Firefox (limited support)

## Color Scheme

### Light Theme
- Primary: Gold (#FFD700)
- Secondary: Gray-50 (#F9FAFB)
- Background: White (#FFFFFF)

### Dark Theme
- Primary: Gold (#FFD700)
- Secondary: Stone-950 (#0C0A09)
- Background: Black (#000000)

## Development

### Available Scripts

- `npm start` - Run development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

### Project Structure

```
src/
├── components/          # React components
│   ├── VoiceCall.jsx   # Main conversation interface
│   ├── Settings.jsx    # Settings page
│   ├── Navigation.jsx  # Navigation bar
│   ├── WaveAnimation.jsx    # Voice wave animation
│   └── MemoryNotification.jsx   # Memory save notification
├── services/           # Service modules
│   ├── geminiService.js     # Gemini AI integration
│   └── speechService.js     # Speech recognition/synthesis
├── store/              # State management
│   └── useStore.js     # Zustand store
├── styles/             # CSS files
│   ├── VoiceCall.css
│   ├── Settings.css
│   ├── Navigation.css
│   ├── WaveAnimation.css
│   └── MemoryNotification.css
└── App.js              # Main app component
```

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

## License

MIT License

## Acknowledgments

- Google Gemini AI for powering conversations
- ChatGPT for design inspiration
- Web Speech API for voice capabilities
