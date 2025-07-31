"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../lib/hooks/useAuth";
import { SignInWithGoogle } from "../components/SignInWithGoogle";
import { VoiceRecorder } from "../components/VoiceRecorder";
import { NotesList } from "../components/NotesList";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export default function Home() {
  const { user, loading } = useAuth();
  const [notes, setNotes] = useState<any[]>([]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto bg-blue-600 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Doctor Notes</h1>
            <p className="text-gray-600">Voice-to-Text Medical Notes</p>
          </div>
          <SignInWithGoogle />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto bg-blue-600 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Doctor Notes</h1>
            <p className="text-gray-600">Real-time voice transcription for medical consultations</p>
          </div>
          
          <VoiceRecorder onNoteSaved={(newNote) => {
            setNotes(prev => [newNote, ...prev]);
          }} />
          
          <NotesList 
            notes={notes} 
            onNotesUpdate={setNotes}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
