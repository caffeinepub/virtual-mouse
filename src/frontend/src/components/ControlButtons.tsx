import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Info } from 'lucide-react';

interface ControlButtonsProps {
  isSoundEnabled: boolean;
  onToggleSound: () => void;
  onShowInstructions: () => void;
}

export default function ControlButtons({
  isSoundEnabled,
  onToggleSound,
  onShowInstructions,
}: ControlButtonsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      <Button
        onClick={onToggleSound}
        className="neon-button"
        size="lg"
      >
        {isSoundEnabled ? (
          <>
            <Volume2 className="w-5 h-5 mr-2" />
            Sound On
          </>
        ) : (
          <>
            <VolumeX className="w-5 h-5 mr-2" />
            Sound Off
          </>
        )}
      </Button>

      <Button
        onClick={onShowInstructions}
        className="neon-button"
        size="lg"
      >
        <Info className="w-5 h-5 mr-2" />
        Instructions
      </Button>
    </div>
  );
}
