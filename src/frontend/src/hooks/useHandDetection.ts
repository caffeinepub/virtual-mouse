import { useEffect, useRef, useState } from 'react';
import type { GestureType } from '../App';
import { recognizeGesture } from '../utils/gestureRecognizer';

export interface HandLandmark {
  x: number;
  y: number;
  z: number;
}

interface UseHandDetectionReturn {
  landmarks: HandLandmark[] | null;
  gesture: GestureType;
  indexFingerTip: HandLandmark | null;
}

export function useHandDetection(
  videoElement: HTMLVideoElement | null,
  isActive: boolean
): UseHandDetectionReturn {
  const [landmarks, setLandmarks] = useState<HandLandmark[] | null>(null);
  const [gesture, setGesture] = useState<GestureType>(null);
  const [indexFingerTip, setIndexFingerTip] = useState<HandLandmark | null>(null);
  const handsRef = useRef<any>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  
  // Gesture confirmation - require consistent detection over multiple frames
  const gestureHistoryRef = useRef<(GestureType)[]>([]);
  const GESTURE_CONFIRMATION_FRAMES = 3; // Require 3 consistent frames
  const MAX_HISTORY_LENGTH = 5;

  useEffect(() => {
    if (!isActive || !videoElement) return;

    let mounted = true;

    // Load MediaPipe Hands
    const loadMediaPipe = async () => {
      try {
        // @ts-ignore - MediaPipe loaded via CDN
        const { Hands } = window;
        
        if (!Hands) {
          console.error('MediaPipe Hands not loaded');
          return;
        }

        const hands = new Hands({
          locateFile: (file: string) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
          },
        });

        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.8,
          minTrackingConfidence: 0.8,
        });

        hands.onResults((results: any) => {
          if (!mounted) return;

          if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            const handLandmarks = results.multiHandLandmarks[0];
            setLandmarks(handLandmarks);

            // Get index finger tip (landmark 8)
            if (handLandmarks[8]) {
              setIndexFingerTip(handLandmarks[8]);
            }

            // Recognize gesture with confirmation logic
            const detectedGesture = recognizeGesture(handLandmarks);
            
            // Add to history
            gestureHistoryRef.current.push(detectedGesture);
            if (gestureHistoryRef.current.length > MAX_HISTORY_LENGTH) {
              gestureHistoryRef.current.shift();
            }

            // Check if gesture is consistent across recent frames
            if (gestureHistoryRef.current.length >= GESTURE_CONFIRMATION_FRAMES) {
              const recentGestures = gestureHistoryRef.current.slice(-GESTURE_CONFIRMATION_FRAMES);
              const allSame = recentGestures.every(g => g === recentGestures[0]);
              
              if (allSame && recentGestures[0] !== gesture) {
                setGesture(recentGestures[0]);
              }
            }
          } else {
            setLandmarks(null);
            setIndexFingerTip(null);
            
            // Clear gesture when hand is not detected
            gestureHistoryRef.current = [];
            if (gesture !== null) {
              setGesture(null);
            }
          }
        });

        handsRef.current = hands;

        // Start processing video frames at optimal rate
        const processFrame = async () => {
          if (!mounted || !videoElement || !handsRef.current) return;

          if (videoElement.readyState === 4) {
            await handsRef.current.send({ image: videoElement });
          }

          animationFrameRef.current = requestAnimationFrame(processFrame);
        };

        processFrame();
      } catch (error) {
        console.error('Error loading MediaPipe:', error);
      }
    };

    loadMediaPipe();

    return () => {
      mounted = false;
      if (animationFrameRef.current !== undefined) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (handsRef.current) {
        handsRef.current.close();
      }
    };
  }, [isActive, videoElement, gesture]);

  return { landmarks, gesture, indexFingerTip };
}
