import { useEffect, useRef } from 'react';
import type { GestureType } from '../App';
import { useAudioFeedback } from './useAudioFeedback';

export function useGestureActions(gesture: GestureType, isSoundEnabled: boolean) {
  const { speak } = useAudioFeedback(isSoundEnabled);
  const previousGesture = useRef<GestureType>(null);

  useEffect(() => {
    if (!gesture || gesture === previousGesture.current) return;

    // Play voice feedback based on gesture
    switch (gesture) {
      case 'yay':
        speak('yay');
        break;
      case 'peace':
        speak('peace bro');
        break;
      case 'love':
        speak('i love you');
        break;
      case 'wave':
        speak('hi buddy');
        break;
      case 'rock':
        speak('yo yo');
        break;
      case 'thumbsup':
        speak('good job');
        break;
      case 'fist':
        speak('come on fight');
        break;
    }

    previousGesture.current = gesture;
  }, [gesture, speak]);
}
