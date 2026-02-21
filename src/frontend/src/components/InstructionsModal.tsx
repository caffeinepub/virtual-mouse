import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const gestures = [
  {
    name: 'Yay',
    fingers: 'Index finger up',
    action: 'Robot jumps',
    voice: 'yay',
    emoji: '🎉',
  },
  {
    name: 'Peace Bro',
    fingers: 'Index + Middle fingers up',
    action: 'Robot rotates',
    voice: 'peace bro',
    emoji: '✌️',
  },
  {
    name: 'I Love You',
    fingers: 'Index + Middle + Ring fingers up',
    action: 'Robot raises both hands',
    voice: 'i love you',
    emoji: '❤️',
  },
  {
    name: 'Hi Buddy',
    fingers: 'All five fingers up',
    action: 'Robot waves right hand',
    voice: 'hi buddy',
    emoji: '👋',
  },
  {
    name: 'Yo Yo',
    fingers: 'Index + Pinky fingers up',
    action: 'Robot moves backward',
    voice: 'yo yo',
    emoji: '🤘',
  },
  {
    name: 'Good Job',
    fingers: 'Thumbs up',
    action: 'Robot claps hands',
    voice: 'good job',
    emoji: '👍',
  },
  {
    name: 'Come On Fight',
    fingers: 'Closed fist',
    action: 'Robot moves forward',
    voice: 'come on fight',
    emoji: '✊',
  },
];

export default function InstructionsModal({ isOpen, onClose }: InstructionsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] bg-[oklch(0.15_0.03_250)] border-[oklch(0.50_0.20_195/0.5)]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-[oklch(0.75_0.20_195)] to-[oklch(0.65_0.25_200)] bg-clip-text text-transparent">
            Hand Gesture Controls
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Use these hand gestures to control the Cyber Puppet
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {gestures.map((gesture, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-[oklch(0.20_0.03_250/0.6)] border border-[oklch(0.40_0.15_195/0.3)] hover:border-[oklch(0.50_0.20_195/0.6)] transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{gesture.emoji}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[oklch(0.75_0.20_195)] mb-1">
                      {gesture.name}
                    </h3>
                    <div className="space-y-1 text-sm">
                      <p className="text-muted-foreground">
                        <span className="font-medium text-foreground">Fingers:</span> {gesture.fingers}
                      </p>
                      <p className="text-muted-foreground">
                        <span className="font-medium text-foreground">Voice:</span> "{gesture.voice}"
                      </p>
                      <p className="text-muted-foreground">
                        <span className="font-medium text-foreground">Action:</span> {gesture.action}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
