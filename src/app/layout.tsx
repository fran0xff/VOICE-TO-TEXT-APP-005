import "./globals.css";
import { AuthProvider } from "../lib/contexts/AuthContext";
import { DeepgramContextProvider } from "../lib/contexts/DeepgramContext";

export const metadata = {
  title: "Doctor Notes - Voice-to-Text Medical Notes",
  description: "Real-time voice transcription for medical consultations",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <DeepgramContextProvider>
            {children}
          </DeepgramContextProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
