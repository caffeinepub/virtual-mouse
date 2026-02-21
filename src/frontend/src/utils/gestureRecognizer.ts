import type { GestureType } from '../App';
import type { HandLandmark } from '../hooks/useHandDetection';

export function recognizeGesture(landmarks: HandLandmark[]): GestureType {
  if (!landmarks || landmarks.length < 21) return null;

  // Helper function to check if finger is extended
  const isFingerExtended = (tipIndex: number, pipIndex: number): boolean => {
    return landmarks[tipIndex].y < landmarks[pipIndex].y;
  };

  // Check each finger
  const thumbExtended = landmarks[4].x < landmarks[3].x; // Thumb is special
  const indexExtended = isFingerExtended(8, 6);
  const middleExtended = isFingerExtended(12, 10);
  const ringExtended = isFingerExtended(16, 14);
  const pinkyExtended = isFingerExtended(20, 18);

  // Count extended fingers
  const extendedCount = [
    indexExtended,
    middleExtended,
    ringExtended,
    pinkyExtended,
  ].filter(Boolean).length;

  // Closed fist - no fingers extended
  if (extendedCount === 0 && !thumbExtended) {
    return 'fist';
  }

  // Thumbs up - only thumb extended
  if (thumbExtended && extendedCount === 0) {
    return 'thumbsup';
  }

  // Index finger only - Yay
  if (indexExtended && !middleExtended && !ringExtended && !pinkyExtended && !thumbExtended) {
    return 'yay';
  }

  // Index + Middle - Peace
  if (indexExtended && middleExtended && !ringExtended && !pinkyExtended && !thumbExtended) {
    return 'peace';
  }

  // Index + Middle + Ring - Love
  if (indexExtended && middleExtended && ringExtended && !pinkyExtended && !thumbExtended) {
    return 'love';
  }

  // Index + Pinky - Rock sign
  if (indexExtended && !middleExtended && !ringExtended && pinkyExtended && !thumbExtended) {
    return 'rock';
  }

  // All fingers extended - Wave
  if (extendedCount === 4 && thumbExtended) {
    return 'wave';
  }

  return null;
}
