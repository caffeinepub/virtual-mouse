import { useCallback, useEffect, useRef } from 'react';

export function useAudioFeedback(isEnabled: boolean) {
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;

      // Load voices
      const loadVoices = () => {
        const voices = synthRef.current?.getVoices() || [];
        // Prefer English voices
        const englishVoice = voices.find(voice => voice.lang.startsWith('en'));
        voiceRef.current = englishVoice || voices[0] || null;
      };

      loadVoices();
      if (synthRef.current) {
        synthRef.current.onvoiceschanged = loadVoices;
      }
    }
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!isEnabled || !synthRef.current) return;

      // Cancel any ongoing speech
      synthRef.current.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      if (voiceRef.current) {
        utterance.voice = voiceRef.current;
      }

      synthRef.current.speak(utterance);
    },
    [isEnabled]
  );

  return { speak };
}
