import { useEffect, useRef } from 'react';
import type { CursorPosition } from '../App';

interface VirtualCursorProps {
  position: CursorPosition;
}

export default function VirtualCursor({ position }: VirtualCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cursorRef.current && (position.x !== 0 || position.y !== 0)) {
      cursorRef.current.style.transform = `translate(${position.x - 16}px, ${position.y - 16}px)`;
    }
  }, [position]);

  if (position.x === 0 && position.y === 0) return null;

  return (
    <div
      ref={cursorRef}
      className="fixed pointer-events-none z-50 transition-transform duration-100 ease-out"
      style={{ willChange: 'transform' }}
    >
      <div className="relative w-8 h-8">
        <div className="absolute inset-0 rounded-full bg-[oklch(0.70_0.25_195)] opacity-50 blur-md animate-pulse" />
        <div className="absolute inset-2 rounded-full bg-[oklch(0.75_0.25_195)] border-2 border-white shadow-lg" />
      </div>
    </div>
  );
}
