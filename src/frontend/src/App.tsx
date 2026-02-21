import { useState, useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import RobotModel from './components/RobotModel';
import CameraPreview from './components/CameraPreview';
import GestureStatus from './components/GestureStatus';
import ControlButtons from './components/ControlButtons';
import InstructionsModal from './components/InstructionsModal';
import LoadingScreen from './components/LoadingScreen';
import VirtualCursor from './components/VirtualCursor';
import { Toaster } from '@/components/ui/sonner';
import { SiX, SiFacebook, SiLinkedin } from 'react-icons/si';
import { Heart } from 'lucide-react';

export type GestureType = 
  | 'love' 
  | 'yay' 
  | 'peace' 
  | 'thumbsup' 
  | 'fist' 
  | 'wave' 
  | 'rock' 
  | null;

export interface CursorPosition {
  x: number;
  y: number;
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentGesture, setCurrentGesture] = useState<GestureType>(null);
  const [cursorPosition, setCursorPosition] = useState<CursorPosition>({ x: 0, y: 0 });
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    // Simulate loading time for assets
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <div className="min-h-screen bg-gradient-to-br from-[oklch(0.15_0.02_250)] via-[oklch(0.12_0.03_260)] to-[oklch(0.10_0.02_270)] text-foreground overflow-hidden">
        {/* Header */}
        <header className="relative z-10 pt-8 pb-4 px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-center bg-gradient-to-r from-[oklch(0.75_0.20_195)] via-[oklch(0.70_0.25_200)] to-[oklch(0.65_0.20_205)] bg-clip-text text-transparent animate-pulse">
            Cyber Puppet
          </h1>
          <p className="text-lg md:text-xl text-center text-[oklch(0.65_0.15_195)] mt-2 opacity-90">
            Project by 2nd AIML Students
          </p>
        </header>

        {/* Main Content */}
        <main className="relative z-10 container mx-auto px-4 py-8 flex flex-col items-center gap-8">
          {/* 3D Robot Model */}
          <div className="w-full max-w-4xl h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-[0_25px_50px_-12px_oklch(0.50_0.25_195/0.3)]">
            <RobotModel gesture={currentGesture} />
          </div>

          {/* Gesture Status */}
          <GestureStatus gesture={currentGesture} />

          {/* Camera Preview */}
          <CameraPreview
            onGestureDetected={setCurrentGesture}
            onCursorMove={setCursorPosition}
            isSoundEnabled={isSoundEnabled}
          />

          {/* Control Buttons */}
          <ControlButtons
            isSoundEnabled={isSoundEnabled}
            onToggleSound={() => setIsSoundEnabled(!isSoundEnabled)}
            onShowInstructions={() => setShowInstructions(true)}
          />
        </main>

        {/* Footer */}
        <footer className="relative z-10 mt-16 py-8 px-4 border-t border-[oklch(0.30_0.05_200/0.3)]">
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>© {new Date().getFullYear()}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                Built with <Heart className="w-4 h-4 text-[oklch(0.65_0.25_10)] fill-current" /> using{' '}
                <a
                  href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[oklch(0.70_0.20_195)] hover:text-[oklch(0.75_0.25_195)] transition-colors"
                >
                  caffeine.ai
                </a>
              </span>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-[oklch(0.70_0.20_195)] transition-colors"
                aria-label="Twitter"
              >
                <SiX className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-[oklch(0.70_0.20_195)] transition-colors"
                aria-label="Facebook"
              >
                <SiFacebook className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-[oklch(0.70_0.20_195)] transition-colors"
                aria-label="LinkedIn"
              >
                <SiLinkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </footer>

        {/* Virtual Cursor */}
        <VirtualCursor position={cursorPosition} />

        {/* Instructions Modal */}
        <InstructionsModal
          isOpen={showInstructions}
          onClose={() => setShowInstructions(false)}
        />

        {/* Toast Notifications */}
        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;
