# Doctor Notes - Voice-to-Text Medical Notes App

A real-time voice transcription application designed for medical consultations between doctors and patients. This app allows users to record and transcribe medical conversations in real-time, saving crucial time during medical appointments.

## Features

### 🎤 Real-time Voice Recording
- Start/stop voice recording with a simple button click
- Real-time transcription using Deepgram's advanced speech recognition
- Live preview of transcribed text as you speak
- Beautiful animated recording indicator

### 📝 Note Management
- Automatic saving of transcribed notes to Firebase
- View all your previous notes in a clean, organized list
- Edit any note after recording
- Delete notes with confirmation
- Timestamp tracking for each note

### 🔐 User Authentication
- Google Sign-in integration
- Secure user-specific note storage
- User-friendly authentication flow

### 🎨 Modern UI/UX
- Clean, medical-themed design
- Responsive layout for all devices
- Intuitive navigation and controls
- Loading states and error handling

## Tech Stack

- **Frontend**: Next.js 14 with App Router, React 18, TypeScript
- **Styling**: Tailwind CSS with custom components
- **Authentication**: Firebase Authentication with Google Sign-in
- **Database**: Firebase Firestore for note storage
- **Voice Recognition**: Deepgram real-time transcription API
- **Animations**: Framer Motion for smooth interactions

## Getting Started

### Prerequisites

1. Node.js 18+ installed
2. Firebase project with Firestore enabled
3. Deepgram API key
4. Google OAuth credentials

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Deepgram API Key
DEEPGRAM_API_KEY=your_deepgram_api_key
```

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd voice-to-text-app-005
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Sign In**: Click "Sign in with Google" to authenticate
2. **Start Recording**: Click the play button to begin recording
3. **Speak**: Talk clearly into your microphone
4. **View Transcription**: See your speech transcribed in real-time
5. **Stop Recording**: Click the stop button to end recording
6. **Save**: Notes are automatically saved to your account
7. **Manage**: Edit or delete notes from the list below

## App Flow

1. **Home Page**: Displays the Doctor Notes logo and sign-in option
2. **Authentication**: Google Sign-in for secure access
3. **Voice Recording**: Real-time transcription interface
4. **Notes List**: View, edit, and delete saved notes
5. **Header/Footer**: Navigation and app information

## API Endpoints

- `/api/deepgram` - Returns Deepgram API key for client-side use

## Database Schema

### Notes Collection
```typescript
{
  id: string;
  userId: string;
  content: string;
  timestamp: string;
  createdAt: Date;
  updatedAt?: Date;
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository.