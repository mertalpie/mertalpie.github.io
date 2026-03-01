'use client';
import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { inSphere } from 'maath/random';
import type { Points as ThreePoints } from 'three';

function BrainParticles() {
  const ref = useRef<ThreePoints>(null);
  const sphere = useMemo(() => inSphere(new Float32Array(5000), { radius: 1.5 }) as Float32Array, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#00F0FF"
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

export default function NeuralBrain() {
  return (
    <div className="absolute inset-0 z-0 w-full h-full pointer-events-none opacity-60">
      <Canvas camera={{ position: [0, 0, 3] }}>
        <BrainParticles />
      </Canvas>
    </div>
  );
}
