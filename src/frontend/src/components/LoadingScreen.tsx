import { Loader2 } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[oklch(0.15_0.02_250)] via-[oklch(0.12_0.03_260)] to-[oklch(0.10_0.02_270)] flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="relative">
          <div className="w-24 h-24 mx-auto rounded-full border-4 border-[oklch(0.50_0.20_195/0.3)] border-t-[oklch(0.70_0.20_195)] animate-spin" />
          <Loader2 className="w-12 h-12 text-[oklch(0.70_0.20_195)] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[oklch(0.75_0.20_195)] to-[oklch(0.65_0.20_205)] bg-clip-text text-transparent">
            Loading Virtual Mouse
          </h2>
          <p className="text-muted-foreground">Initializing 3D models and AI detection...</p>
        </div>
      </div>
    </div>
  );
}
