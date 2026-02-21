import { useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import type { GestureType } from '../App';

interface RobotProps {
  gesture: GestureType;
}

const Robot = ({ gesture }: RobotProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);
  const previousGesture = useRef<GestureType>(null);
  
  // Animation state with refs for better performance
  const animationState = useRef({
    clapping: false,
    clapTime: 0,
    waving: false,
    waveTime: 0,
    movingBackward: false,
    movingForward: false,
    gestureRotating: false,
    gestureRotationTime: 0,
    jumping: false,
    jumpTime: 0,
    raisingHands: false,
  });

  // Handle gesture changes with optimized logic
  useEffect(() => {
    if (gesture === previousGesture.current) return;

    // Reset all animation states
    animationState.current = {
      clapping: false,
      clapTime: 0,
      waving: false,
      waveTime: 0,
      movingBackward: false,
      movingForward: false,
      gestureRotating: false,
      gestureRotationTime: 0,
      jumping: false,
      jumpTime: 0,
      raisingHands: false,
    };

    // Activate animation based on gesture
    switch (gesture) {
      case 'yay':
        animationState.current.jumping = true;
        animationState.current.jumpTime = 0;
        break;
      case 'peace':
        animationState.current.gestureRotating = true;
        animationState.current.gestureRotationTime = 0;
        break;
      case 'love':
        animationState.current.raisingHands = true;
        break;
      case 'wave':
        animationState.current.waving = true;
        animationState.current.waveTime = 0;
        break;
      case 'rock':
        animationState.current.movingBackward = true;
        break;
      case 'thumbsup':
        animationState.current.clapping = true;
        animationState.current.clapTime = 0;
        break;
      case 'fist':
        animationState.current.movingForward = true;
        break;
    }

    previousGesture.current = gesture;
  }, [gesture]);

  // Optimized animation loop
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const group = groupRef.current;
    const leftArm = leftArmRef.current;
    const rightArm = rightArmRef.current;

    // Jumping animation - fast and responsive
    if (animationState.current.jumping) {
      animationState.current.jumpTime += delta * 8; // Faster animation
      const jumpProgress = animationState.current.jumpTime;
      
      if (jumpProgress < Math.PI) {
        // Smooth jump using sine wave
        group.position.y = Math.sin(jumpProgress) * 2; // Jump height of 2 units
      } else {
        // End jump
        group.position.y = 0;
        animationState.current.jumping = false;
      }
    }

    // Gesture-triggered rotation for peace gesture ONLY - fast and smooth
    if (animationState.current.gestureRotating) {
      animationState.current.gestureRotationTime += delta;
      
      const rotationDuration = 0.6; // Very fast rotation (reduced from 1.2)
      if (animationState.current.gestureRotationTime < rotationDuration) {
        group.rotation.y += delta * 20; // Very fast rotation speed
      } else {
        animationState.current.gestureRotating = false;
      }
    }
    // NO autonomous rotation - robot stays still when no gesture

    // Idle floating animation when no gesture
    if (!gesture && !animationState.current.jumping) {
      group.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }

    // Clapping animation - fast and clear
    if (animationState.current.clapping && leftArm && rightArm) {
      animationState.current.clapTime += delta * 15; // Faster clapping
      const clapAngle = Math.sin(animationState.current.clapTime) * 0.6;
      leftArm.rotation.z = clapAngle + 0.4;
      rightArm.rotation.z = -clapAngle - 0.4;
      leftArm.rotation.x = -0.3;
      rightArm.rotation.x = -0.3;
    } else if (leftArm && rightArm && !animationState.current.raisingHands && !animationState.current.waving) {
      // Smoothly reset arm positions - faster
      leftArm.rotation.z = THREE.MathUtils.lerp(leftArm.rotation.z, 0, delta * 12);
      rightArm.rotation.z = THREE.MathUtils.lerp(rightArm.rotation.z, 0, delta * 12);
      leftArm.rotation.x = THREE.MathUtils.lerp(leftArm.rotation.x, 0, delta * 12);
      rightArm.rotation.x = THREE.MathUtils.lerp(rightArm.rotation.x, 0, delta * 12);
    }

    // Waving animation - fast and clear
    if (animationState.current.waving && rightArm) {
      animationState.current.waveTime += delta * 12; // Faster waving
      rightArm.rotation.z = Math.sin(animationState.current.waveTime) * 0.7 - 0.6;
      rightArm.rotation.x = -0.5;
    }

    // Raise both hands animation - fast and clear
    if (animationState.current.raisingHands && leftArm && rightArm) {
      const targetRotation = -Math.PI / 2;
      leftArm.rotation.x = THREE.MathUtils.lerp(leftArm.rotation.x, targetRotation, delta * 15);
      rightArm.rotation.x = THREE.MathUtils.lerp(rightArm.rotation.x, targetRotation, delta * 15);
      leftArm.rotation.z = THREE.MathUtils.lerp(leftArm.rotation.z, 0.2, delta * 15);
      rightArm.rotation.z = THREE.MathUtils.lerp(rightArm.rotation.z, -0.2, delta * 15);
    }

    // Move backward - fast and responsive
    if (animationState.current.movingBackward) {
      if (group.position.z < 2.5) {
        group.position.z += delta * 5; // Faster movement
      }
    }

    // Move forward - fast and responsive
    if (animationState.current.movingForward) {
      if (group.position.z > -2.5) {
        group.position.z -= delta * 5; // Faster movement
      }
    }

    // Return to center smoothly when no movement gesture - faster
    if (!animationState.current.movingBackward && !animationState.current.movingForward) {
      if (Math.abs(group.position.z) > 0.05) {
        group.position.z = THREE.MathUtils.lerp(group.position.z, 0, delta * 6);
      } else {
        group.position.z = 0;
      }
    }
  });

  // Memoize materials for better performance
  const bodyMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#1a1a2e',
    emissive: '#00d4ff',
    emissiveIntensity: 0.3,
    metalness: 0.8,
    roughness: 0.2,
  }), []);

  const headMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#2a2a3e',
    emissive: '#00d4ff',
    emissiveIntensity: 0.4,
    metalness: 0.9,
    roughness: 0.1,
  }), []);

  const eyeMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#00ffff',
    emissive: '#00ffff',
    emissiveIntensity: 1,
  }), []);

  const limbMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#1a1a2e',
    emissive: '#00d4ff',
    emissiveIntensity: 0.2,
    metalness: 0.7,
    roughness: 0.3,
  }), []);

  const coreMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#00ffff',
    emissive: '#00ffff',
    emissiveIntensity: 1.5,
    transparent: true,
    opacity: 0.8,
  }), []);

  return (
    <group ref={groupRef}>
      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.2, 1.8, 0.8]} />
        <primitive object={bodyMaterial} attach="material" />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.3, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <primitive object={headMaterial} attach="material" />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.2, 1.4, 0.4]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <primitive object={eyeMaterial} attach="material" />
      </mesh>
      <mesh position={[0.2, 1.4, 0.4]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <primitive object={eyeMaterial} attach="material" />
      </mesh>

      {/* Left Arm */}
      <mesh ref={leftArmRef} position={[-0.8, 0.3, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 1.2, 16]} />
        <primitive object={limbMaterial} attach="material" />
      </mesh>

      {/* Right Arm */}
      <mesh ref={rightArmRef} position={[0.8, 0.3, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 1.2, 16]} />
        <primitive object={limbMaterial} attach="material" />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.3, -1.2, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 1.2, 16]} />
        <primitive object={limbMaterial} attach="material" />
      </mesh>
      <mesh position={[0.3, -1.2, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 1.2, 16]} />
        <primitive object={limbMaterial} attach="material" />
      </mesh>

      {/* Glowing core */}
      <mesh position={[0, 0.2, 0.5]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <primitive object={coreMaterial} attach="material" />
      </mesh>
    </group>
  );
};

export default function RobotModel({ gesture }: RobotProps) {
  return (
    <Canvas className="w-full h-full" dpr={[1, 2]} performance={{ min: 0.5 }}>
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
