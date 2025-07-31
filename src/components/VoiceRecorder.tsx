"use client";

import { useState, useEffect } from "react";
import { useDeepgram } from "../lib/contexts/DeepgramContext";
import { useAuth } from "../lib/hooks/useAuth";
import { addDocument } from "../lib/firebase/firebaseUtils";
import { Play, Square, Mic, MicOff } from "lucide-react";
import { motion } from "framer-motion";

interface VoiceRecorderProps {
  onNoteSaved: (note: any) => void;
}

export function VoiceRecorder({ onNoteSaved }: VoiceRecorderProps) {
  const { user } = useAuth();
  const { connectToDeepgram, disconnectFromDeepgram, connectionState, realtimeTranscript, error } = useDeepgram();
  const [isRecording, setIsRecording] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (realtimeTranscript) {
      setCurrentTranscript(realtimeTranscript);
    }
  }, [realtimeTranscript]);

  const startRecording = async () => {
    try {
      setIsRecording(true);
      setCurrentTranscript("");
      await connectToDeepgram();
    } catch (error) {
      console.error("Error starting recording:", error);
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    try {
      setIsRecording(false);
      disconnectFromDeepgram();
      
      if (currentTranscript.trim()) {
        await saveNote();
      }
    } catch (error) {
      console.error("Error stopping recording:", error);
    }
  };

  const saveNote = async () => {
    if (!user || !currentTranscript.trim()) return;

    setIsSaving(true);
    try {
      const noteData = {
        userId: user.uid,
        content: currentTranscript.trim(),
        timestamp: new Date().toISOString(),
        createdAt: new Date(),
      };

      const docRef = await addDocument("notes", noteData);
      const savedNote = {
        id: docRef.id,
        ...noteData,
      };

      onNoteSaved(savedNote);
      setCurrentTranscript("");
    } catch (error) {
      console.error("Error saving note:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Voice Recording</h2>
        <p className="text-gray-600">Click the button below to start recording your medical notes</p>
      </div>

      <div className="flex justify-center mb-6">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isSaving}
          className={`relative flex items-center justify-center w-20 h-20 rounded-full text-white font-semibold transition-all duration-300 ${
            isRecording
              ? "bg-red-500 hover:bg-red-600 shadow-lg"
              : "bg-blue-600 hover:bg-blue-700 shadow-md"
          } ${isSaving ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isRecording ? (
            <Square className="w-8 h-8" />
          ) : (
            <Play className="w-8 h-8 ml-1" />
          )}
          
          {isRecording && (
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-red-300"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.2, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}
        </button>
      </div>

      {error && (
        <div className="text-center mb-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {isRecording && (
        <div className="text-center mb-4">
          <div className="flex items-center justify-center space-x-2 text-red-600">
            <Mic className="w-5 h-5 animate-pulse" />
            <span className="text-sm font-medium">Recording...</span>
          </div>
        </div>
      )}

      {currentTranscript && (
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Live Transcription:</h3>
          <div className="bg-white rounded border p-3 min-h-[100px] max-h-[200px] overflow-y-auto">
            <p className="text-gray-700 whitespace-pre-wrap">{currentTranscript}</p>
          </div>
        </div>
      )}

      {isSaving && (
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm">Saving note...</span>
          </div>
        </div>
      )}
    </div>
  );
}