# Handwrite AI Cloner

A React Native/Expo application that uses AI to extract text from handwritten documents and images.

## Features

- **Camera Integration**: Capture photos directly or choose from gallery
- **AI-Powered OCR**: Advanced text recognition using AI
- **History Management**: Save and search through processed documents
- **Cross-Platform**: Works on iOS, Android, and Web
- **Modern UI**: Clean, intuitive interface with beautiful animations

## Tech Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **Zustand** for state management
- **React Query** for data fetching
- **NativeWind** for styling
- **Lucide React Native** for icons

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- Bun package manager
- Expo CLI

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   bun install
   ```

3. Start the development server:
   ```bash
   # For web development
   bun run start-web-dev
   
   # For mobile development
   bun run start
   ```

### Development

- **Web**: Visit the Expo development server URL in your browser
- **Mobile**: Use the Expo Go app to scan the QR code
- **Demo Mode**: On web, use the "Try Demo" button to test with mock data

## Project Structure

```
/
├── App/                 # Main app screens and navigation
├── Components/          # Reusable UI components
├── Constants/           # App constants and theme
├── Store/              # Zustand stores for state management
├── Utils/              # Utility functions and AI integration
├── Backend/            # TRPC backend setup
└── Assets/             # Images and static assets
```

## AI Integration

The app integrates with an AI service for text recognition. For development and testing:

- **Web**: Uses mock data for testing
- **Mobile**: Connects to the real AI API endpoint

## Contributing

1. Create a feature branch
2. Make your changes
3. Test on both web and mobile
4. Submit a pull request

## License

MIT License - see LICENSE file for details