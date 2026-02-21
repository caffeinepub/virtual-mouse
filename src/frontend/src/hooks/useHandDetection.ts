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
  const lastDetectionTime = useRef<number>(0);

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
          minDetectionConfidence: 0.7,
          minTrackingConfidence: 0.7,
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

            // Recognize gesture (throttled to avoid too frequent updates)
            const now = Date.now();
            if (now - lastDetectionTime.current > 500) {
              const detectedGesture = recognizeGesture(handLandmarks);
              setGesture(detectedGesture);
              lastDetectionTime.current = now;
            }
          } else {
            setLandmarks(null);
            setIndexFingerTip(null);
            setGesture(null);
          }
        });

        handsRef.current = hands;

        // Start processing video frames
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
  }, [isActive, videoElement]);

  return { landmarks, gesture, indexFingerTip };
}
