# Specification

## Summary
**Goal:** Fix robot animation performance and disable autonomous rotation behavior.

**Planned changes:**
- Optimize animation speed and responsiveness in RobotModel.tsx to eliminate lag during all gesture-triggered movements
- Remove continuous autonomous rotation so robot only rotates when index+middle fingers gesture is detected
- Ensure all animations execute immediately without noticeable delay

**User-visible outcome:** The robot responds instantly to hand gestures without lag, and only rotates when the specific rotation gesture is actively performed instead of rotating continuously.
