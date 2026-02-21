import { useEffect, useRef, useState } from 'react';
import { useCamera } from '../camera/useCamera';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Camera, CameraOff, AlertCircle } from 'lucide-react';
import { useHandDetection } from '../hooks/useHandDetection';
import { useGestureActions } from '../hooks/useGestureActions';
import type { GestureType, CursorPosition } from '../App';

interface CameraPreviewProps {
  onGestureDetected: (gesture: GestureType) => void;
  onCursorMove: (position: CursorPosition) => void;
  isSoundEnabled: boolean;
}

export default function CameraPreview({
  onGestureDetected,
  onCursorMove,
  isSoundEnabled,
}: CameraPreviewProps) {
  const {
    isActive,
    isSupported,
    error,
    isLoading,
    startCamera,
    stopCamera,
    videoRef,
    canvasRef,
  } = useCamera({
    facingMode: 'user',
    width: 640,
    height: 480,
  });

  const { landmarks, gesture, indexFingerTip } = useHandDetection(videoRef.current, isActive);
  useGestureActions(gesture, isSoundEnabled);

  // Update parent components with gesture and cursor position
  useEffect(() => {
    onGestureDetected(gesture);
  }, [gesture, onGestureDetected]);

  useEffect(() => {
    if (indexFingerTip) {
      // Map camera coordinates to screen coordinates
      const x = (1 - indexFingerTip.x) * window.innerWidth;
      const y = indexFingerTip.y * window.innerHeight;
      onCursorMove({ x, y });
    }
  }, [indexFingerTip, onCursorMove]);

  if (isSupported === false) {
    return (
      <Alert variant="destructive" className="max-w-2xl">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Camera is not supported on this device or browser.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="w-full max-w-2xl space-y-4">
      {/* Camera Preview */}
      <div className="relative aspect-video bg-[oklch(0.20_0.03_250)] rounded-xl overflow-hidden shadow-lg border-2 border-[oklch(0.50_0.20_195/0.5)]">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          muted
          style={{ transform: 'scaleX(-1)' }}
        />
        <canvas ref={canvasRef} className="hidden" />
        
        {!isActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-[oklch(0.15_0.02_250/0.8)] backdrop-blur-sm">
            <div className="text-center space-y-4">
              <CameraOff className="w-16 h-16 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground">Camera is not active</p>
            </div>
          </div>
        )}

        {/* Hand landmarks overlay */}
        {isActive && landmarks && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {landmarks.map((landmark, index) => (
              <circle
                key={index}
                cx={`${(1 - landmark.x) * 100}%`}
                cy={`${landmark.y * 100}%`}
                r="3"
                fill="#00ffff"
                opacity="0.8"
              />
            ))}
          </svg>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      {/* Camera Controls */}
      <div className="flex justify-center gap-4">
        {!isActive ? (
          <Button
            onClick={startCamera}
            disabled={isLoading}
            className="neon-button"
            size="lg"
          >
            <Camera className="w-5 h-5 mr-2" />
            {isLoading ? 'Initializing...' : 'Enable Camera'}
          </Button>
        ) : (
          <Button
            onClick={stopCamera}
            disabled={isLoading}
            variant="destructive"
            size="lg"
          >
            <CameraOff className="w-5 h-5 mr-2" />
            Stop Camera
          </Button>
        )}
      </div>
    </div>
  );
}
