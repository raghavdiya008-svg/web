'use client';
import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 3D Wireframe Cinema Camera Lens & Optical Assembly
function WireframeCameraLens() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Steady mechanical rotation
      groupRef.current.rotation.z += delta * 0.15;

      // Pointer magnetic tilt
      const targetX = (state.pointer.x * Math.PI) / 8;
      const targetY = (state.pointer.y * Math.PI) / 8;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetY, 0.04);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetX, 0.04);
    }
  });

  return (
    <group ref={groupRef} position={[2.8, -0.2, 0]} rotation={[0.3, -0.4, 0]}>
      {/* Outer Cinema Lens Gear Ring (Focus Gear) */}
      <mesh>
        <torusGeometry args={[2.0, 0.04, 16, 72]} />
        <meshBasicMaterial color="#3E3E44" wireframe />
      </mesh>

      {/* Focus Calibrated Distance Ring */}
      <mesh>
        <cylinderGeometry args={[1.9, 1.9, 0.45, 48, 2, true]} />
        <meshBasicMaterial color="#2A2A2E" wireframe />
      </mesh>

      {/* Terminal Green Aperture Index Calibration Line */}
      <mesh position={[0, 0, 0.23]}>
        <torusGeometry args={[1.85, 0.015, 8, 64]} />
        <meshBasicMaterial color="#00FF41" />
      </mesh>

      {/* Iris Aperture Blades Array (8 Polygonal Blades) */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * Math.PI * 2) / 8;
        return (
          <group key={i} rotation={[0, 0, angle]}>
            <mesh position={[0.75, 0.25, 0]} rotation={[0, 0, 0.4]}>
              <boxGeometry args={[1.1, 0.03, 0.02]} />
              <meshBasicMaterial color="#55555C" />
            </mesh>
          </group>
        );
      })}

      {/* Optical Glass Element 1 (Convex Front Wireframe) */}
      <mesh position={[0, 0, 0.15]}>
        <sphereGeometry args={[1.4, 24, 16, 0, Math.PI * 2, 0, Math.PI / 3]} />
        <meshBasicMaterial color="#2E343A" wireframe transparent opacity={0.6} />
      </mesh>

      {/* Optical Glass Element 2 (Internal Lens Doublet) */}
      <mesh position={[0, 0, -0.2]}>
        <cylinderGeometry args={[1.1, 1.1, 0.3, 32, 2, true]} />
        <meshBasicMaterial color="#1E1E22" wireframe />
      </mesh>

      {/* Rear PL Mount Bayonet Flange */}
      <mesh position={[0, 0, -0.45]}>
        <torusGeometry args={[1.35, 0.06, 12, 48]} />
        <meshBasicMaterial color="#FFB000" wireframe transparent opacity={0.7} />
      </mesh>

      {/* Outer Lens Housing Barrel Wireframe */}
      <mesh position={[0, 0, -0.1]}>
        <cylinderGeometry args={[2.05, 1.85, 0.8, 36, 4, true]} />
        <meshBasicMaterial color="#26262B" wireframe transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

// 3D Geometric Depth Particle Field with mouse parallax
function StudioParticleSystem() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 480;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Scatter in a studio workspace bounding box
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 1;

      // Color distribution: mostly dark gunmetal, with occasional terminal green / amber hardware spark
      const r = Math.random();
      if (r > 0.95) {
        // Terminal green indicator dot
        col[i * 3] = 0.0;
        col[i * 3 + 1] = 1.0;
        col[i * 3 + 2] = 0.25;
      } else if (r > 0.9) {
        // Amber warning dot
        col[i * 3] = 1.0;
        col[i * 3 + 1] = 0.69;
        col[i * 3 + 2] = 0.0;
      } else {
        // Subtle gunmetal grey
        col[i * 3] = 0.2;
        col[i * 3 + 1] = 0.2;
        col[i * 3 + 2] = 0.24;
      }
    }
    return [pos, col];
  }, [count]);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.02;
      pointsRef.current.position.x = state.pointer.x * 0.5;
      pointsRef.current.position.y = state.pointer.y * 0.3;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.065}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
      />
    </points>
  );
}

export function VaultScene() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.4} />
        <WireframeCameraLens />
        <StudioParticleSystem />
      </Canvas>
    </div>
  );
}
