import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import type { GestureType } from '../App';

interface RobotProps {
  gesture: GestureType;
}

function Robot({ gesture }: RobotProps) {
  const groupRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);
  const [mixer, setMixer] = useState<THREE.AnimationMixer | null>(null);
  const [actions, setActions] = useState<Record<string, THREE.AnimationAction>>({});
  const previousGesture = useRef<GestureType>(null);
  const animationState = useRef({
    clapping: false,
    clapTime: 0,
    waving: false,
    waveTime: 0,
    movingBackward: false,
    movingForward: false,
  });

  // Create a simple robot using Three.js primitives
  useEffect(() => {
    if (!groupRef.current) return;

    const group = groupRef.current;
    
    // Create animation mixer
    const newMixer = new THREE.AnimationMixer(group);
    setMixer(newMixer);

    // Create simple animations
    const createAnimation = (name: string, keyframes: THREE.VectorKeyframeTrack[]) => {
      const clip = new THREE.AnimationClip(name, -1, keyframes);
      const action = newMixer.clipAction(clip);
      return action;
    };

    // Jump animation
    const jumpTrack = new THREE.VectorKeyframeTrack(
      '.position',
      [0, 0.3, 0.6],
      [0, 0, 0, 0, 1.5, 0, 0, 0, 0]
    );
    const jumpAction = createAnimation('jump', [jumpTrack]);

    // Rotate animation
    const rotateTrack = new THREE.VectorKeyframeTrack(
      '.rotation',
      [0, 1],
      [0, 0, 0, 0, Math.PI * 2, 0]
    );
    const rotateAction = createAnimation('rotate', [rotateTrack]);

    setActions({
      jump: jumpAction,
      rotate: rotateAction,
    });

    return () => {
      newMixer.stopAllAction();
    };
  }, []);

  // Handle gesture changes
  useEffect(() => {
    if (!mixer || !actions || gesture === previousGesture.current) return;

    // Stop all current actions
    Object.values(actions).forEach(action => action.stop());

    // Reset animation states
    animationState.current = {
      clapping: false,
      clapTime: 0,
      waving: false,
      waveTime: 0,
      movingBackward: false,
      movingForward: false,
    };

    // Play animation based on gesture
    switch (gesture) {
      case 'yay':
        actions.jump?.reset().play();
        break;
      case 'peace':
        actions.rotate?.reset().play();
        break;
      case 'love':
        // Raise both hands - handled in frame loop
        break;
      case 'wave':
        // Wave right hand - handled in frame loop
        animationState.current.waving = true;
        break;
      case 'rock':
        // Move backward - handled in frame loop
        animationState.current.movingBackward = true;
        break;
      case 'thumbsup':
        // Clap hands - handled in frame loop
        animationState.current.clapping = true;
        break;
      case 'fist':
        // Move forward - handled in frame loop
        animationState.current.movingForward = true;
        break;
    }

    previousGesture.current = gesture;
  }, [gesture, mixer, actions]);

  // Animation loop
  useFrame((state, delta) => {
    if (mixer) {
      mixer.update(delta);
    }

    // Idle animation - gentle floating
    if (groupRef.current && !gesture) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }

    // Clapping animation for thumbs up
    if (animationState.current.clapping && leftArmRef.current && rightArmRef.current) {
      animationState.current.clapTime += delta * 8;
      const clapAngle = Math.sin(animationState.current.clapTime) * 0.5;
      leftArmRef.current.rotation.z = clapAngle + 0.3;
      rightArmRef.current.rotation.z = -clapAngle - 0.3;
    } else if (leftArmRef.current && rightArmRef.current && gesture !== 'love' && gesture !== 'wave') {
      // Reset arm positions
      leftArmRef.current.rotation.z = 0;
      rightArmRef.current.rotation.z = 0;
      leftArmRef.current.rotation.x = 0;
      rightArmRef.current.rotation.x = 0;
    }

    // Waving animation for wave gesture
    if (animationState.current.waving && rightArmRef.current) {
      animationState.current.waveTime += delta * 6;
      rightArmRef.current.rotation.z = Math.sin(animationState.current.waveTime) * 0.6 - 0.5;
    }

    // Raise both hands for love gesture
    if (gesture === 'love' && leftArmRef.current && rightArmRef.current) {
      leftArmRef.current.rotation.x = -Math.PI / 2;
      rightArmRef.current.rotation.x = -Math.PI / 2;
    }

    // Move backward for rock gesture
    if (animationState.current.movingBackward && groupRef.current) {
      if (groupRef.current.position.z < 2) {
        groupRef.current.position.z += delta * 2;
      }
    }

    // Move forward for fist gesture
    if (animationState.current.movingForward && groupRef.current) {
      if (groupRef.current.position.z > -2) {
        groupRef.current.position.z -= delta * 2;
      }
    }

    // Return to center when no movement gesture
    if (groupRef.current && !animationState.current.movingBackward && !animationState.current.movingForward) {
      if (groupRef.current.position.z > 0.1) {
        groupRef.current.position.z -= delta * 1.5;
      } else if (groupRef.current.position.z < -0.1) {
        groupRef.current.position.z += delta * 1.5;
      } else {
        groupRef.current.position.z = 0;
      }
    }
  });

  return (
    <group ref={groupRef}>
      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.2, 1.8, 0.8]} />
        <meshStandardMaterial
          color="#1a1a2e"
          emissive="#00d4ff"
          emissiveIntensity={0.3}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.3, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color="#2a2a3e"
          emissive="#00d4ff"
          emissiveIntensity={0.4}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.2, 1.4, 0.4]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={1}
        />
      </mesh>
      <mesh position={[0.2, 1.4, 0.4]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={1}
        />
      </mesh>

      {/* Left Arm */}
      <mesh ref={leftArmRef} position={[-0.8, 0.3, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 1.2, 16]} />
        <meshStandardMaterial
          color="#1a1a2e"
          emissive="#00d4ff"
          emissiveIntensity={0.2}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Right Arm */}
      <mesh ref={rightArmRef} position={[0.8, 0.3, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 1.2, 16]} />
        <meshStandardMaterial
          color="#1a1a2e"
          emissive="#00d4ff"
          emissiveIntensity={0.2}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.3, -1.2, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 1.2, 16]} />
        <meshStandardMaterial
          color="#1a1a2e"
          emissive="#00d4ff"
          emissiveIntensity={0.2}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[0.3, -1.2, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 1.2, 16]} />
        <meshStandardMaterial
          color="#1a1a2e"
          emissive="#00d4ff"
          emissiveIntensity={0.2}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Glowing core */}
      <mesh position={[0, 0.2, 0.5]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={1.5}
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  );
}

function RotatingPlatform() {
  const platformRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (platformRef.current) {
      platformRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <mesh ref={platformRef} position={[0, -2.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[2.5, 2.5, 0.2, 64]} />
      <meshStandardMaterial
        color="#1a1a2e"
        emissive="#00d4ff"
        emissiveIntensity={0.3}
        metalness={0.9}
        roughness={0.1}
      />
      {/* Platform edge glow */}
      <mesh position={[0, 0.11, 0]}>
        <torusGeometry args={[2.5, 0.05, 16, 100]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={2}
          transparent
          opacity={0.8}
        />
      </mesh>
    </mesh>
  );
}

export default function RobotModel({ gesture }: RobotProps) {
  return (
    <Canvas className="w-full h-full">
      <PerspectiveCamera makeDefault position={[0, 0, 8]} />
      <OrbitControls enableZoom={false} enablePan={false} />
      
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00d4ff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff00ff" />
      <spotLight
        position={[0, 5, 5]}
        angle={0.3}
        penumbra={1}
        intensity={1}
        color="#00ffff"
      />

      {/* Rotating Platform */}
      <RotatingPlatform />

      {/* Robot */}
      <Robot gesture={gesture} />

      {/* Background */}
      <mesh position={[0, 0, -5]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial
          color="#0a0a1a"
          emissive="#001a33"
          emissiveIntensity={0.2}
        />
      </mesh>
    </Canvas>
  );
}
