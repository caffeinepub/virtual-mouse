import type { GestureType } from '../App';
import type { HandLandmark } from '../hooks/useHandDetection';

export function recognizeGesture(landmarks: HandLandmark[]): GestureType {
  if (!landmarks || landmarks.length < 21) return null;

  // Helper function to check if finger is extended with improved accuracy
  const isFingerExtended = (tipIndex: number, pipIndex: number, dipIndex: number): boolean => {
    const tipY = landmarks[tipIndex].y;
    const pipY = landmarks[pipIndex].y;
    const dipY = landmarks[dipIndex].y;
    
    // Check if tip is above both PIP and DIP joints with margin
    return tipY < pipY - 0.02 && tipY < dipY - 0.01;
  };

  // Improved thumb detection - check if thumb is extended outward
  const isThumbExtended = (): boolean => {
    const thumbTip = landmarks[4];
    const thumbIP = landmarks[3];
    const thumbMCP = landmarks[2];
    const wrist = landmarks[0];
    
    // For right hand, thumb extends to the left (lower x)
    // For left hand, thumb extends to the right (higher x)
    const thumbExtendedX = Math.abs(thumbTip.x - wrist.x) > Math.abs(thumbMCP.x - wrist.x);
    const thumbExtendedY = thumbTip.y < thumbIP.y + 0.05; // Thumb tip should be roughly at same level or above
    
    return thumbExtendedX && thumbExtendedY;
  };

  // Check if finger is curled (for fist detection)
  const isFingerCurled = (tipIndex: number, pipIndex: number): boolean => {
    return landmarks[tipIndex].y > landmarks[pipIndex].y + 0.02;
  };

  // Check each finger with improved detection
  const thumbExtended = isThumbExtended();
  const indexExtended = isFingerExtended(8, 6, 7);
  const middleExtended = isFingerExtended(12, 10, 11);
  const ringExtended = isFingerExtended(16, 14, 15);
  const pinkyExtended = isFingerExtended(20, 18, 19);

  // Check if fingers are curled for fist
  const indexCurled = isFingerCurled(8, 6);
  const middleCurled = isFingerCurled(12, 10);
  const ringCurled = isFingerCurled(16, 14);
  const pinkyCurled = isFingerCurled(20, 18);

  // Count extended fingers
  const extendedCount = [
    indexExtended,
    middleExtended,
    ringExtended,
    pinkyExtended,
  ].filter(Boolean).length;

  // Closed fist - all fingers curled, thumb not extended
  if (indexCurled && middleCurled && ringCurled && pinkyCurled && !thumbExtended) {
    return 'fist';
  }

  // Thumbs up - only thumb extended, all other fingers curled
  if (thumbExtended && indexCurled && middleCurled && ringCurled && pinkyCurled) {
    return 'thumbsup';
  }

  // Index finger only - Yay
  if (indexExtended && !middleExtended && !ringExtended && !pinkyExtended && !thumbExtended) {
    return 'yay';
  }

  // Index + Middle - Peace (ensure ring and pinky are NOT extended)
  if (indexExtended && middleExtended && !ringExtended && !pinkyExtended && !thumbExtended) {
    return 'peace';
  }

  // Index + Middle + Ring - Love (ensure pinky is NOT extended)
  if (indexExtended && middleExtended && ringExtended && !pinkyExtended && !thumbExtended) {
    return 'love';
  }

  // Index + Pinky - Rock sign (middle and ring must NOT be extended)
  if (indexExtended && !middleExtended && !ringExtended && pinkyExtended && !thumbExtended) {
    return 'rock';
  }

  // All five fingers extended - Wave
  if (indexExtended && middleExtended && ringExtended && pinkyExtended && thumbExtended) {
    return 'wave';
  }

  return null;
}
