import { Badge } from '@/components/ui/badge';
import { Hand } from 'lucide-react';
import type { GestureType } from '../App';

interface GestureStatusProps {
  gesture: GestureType;
}

const gestureLabels: Record<NonNullable<GestureType>, string> = {
  yay: '🎉 Yay',
  peace: '✌️ Peace Bro',
  love: '❤️ I Love You',
  wave: '👋 Hi Buddy',
  rock: '🤘 Yo Yo',
  thumbsup: '👍 Good Job',
  fist: '✊ Come On Fight',
};

export default function GestureStatus({ gesture }: GestureStatusProps) {
  return (
    <div className="flex items-center gap-3 px-6 py-3 bg-[oklch(0.20_0.03_250/0.8)] backdrop-blur-sm rounded-full border-2 border-[oklch(0.50_0.20_195/0.5)] shadow-lg">
      <Hand className="w-5 h-5 text-[oklch(0.70_0.20_195)]" />
      <span className="text-sm font-medium text-muted-foreground">Gesture:</span>
      {gesture ? (
        <Badge className="bg-gradient-to-r from-[oklch(0.60_0.20_195)] to-[oklch(0.65_0.25_200)] text-white border-0 text-base px-4 py-1">
          {gestureLabels[gesture]}
        </Badge>
      ) : (
        <span className="text-muted-foreground italic">No gesture detected</span>
      )}
    </div>
  );
}
