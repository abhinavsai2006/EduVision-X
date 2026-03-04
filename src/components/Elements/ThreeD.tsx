'use client';
import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

type Shape3D = 'cube' | 'sphere' | 'torus' | 'cone' | 'cylinder' | 'octahedron' | 'dodecahedron' | 'knot';

interface Props {
  shape: Shape3D;
  color?: string;
  wireframe?: boolean;
}

function ShapeMesh({ shape, color = '#6366f1', wireframe = false }: Props) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
      meshRef.current.rotation.x += delta * 0.2;
    }
  });

  const geometry = (() => {
    switch (shape) {
      case 'sphere': return <sphereGeometry args={[1, 32, 32]} />;
      case 'torus': return <torusGeometry args={[0.8, 0.3, 16, 48]} />;
      case 'cone': return <coneGeometry args={[0.8, 1.5, 32]} />;
      case 'cylinder': return <cylinderGeometry args={[0.7, 0.7, 1.5, 32]} />;
      case 'octahedron': return <octahedronGeometry args={[1]} />;
      case 'dodecahedron': return <dodecahedronGeometry args={[1]} />;
      case 'knot': return <torusKnotGeometry args={[0.6, 0.2, 100, 16]} />;
      case 'cube':
      default: return <boxGeometry args={[1.2, 1.2, 1.2]} />;
    }
  })();

  return (
    <mesh ref={meshRef}>
      {geometry}
      <meshStandardMaterial color={color} wireframe={wireframe} />
    </mesh>
  );
}

export default function ThreeD({ shape = 'cube', color = '#6366f1', wireframe = false }: Props) {
  return (
    <div className="w-full h-full" style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)' }}>
      <Canvas camera={{ position: [2.5, 2, 2.5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, -5, -5]} intensity={0.3} />
        <Suspense fallback={null}>
          <ShapeMesh shape={shape} color={color} wireframe={wireframe} />
        </Suspense>
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1} />
      </Canvas>
    </div>
  );
}
