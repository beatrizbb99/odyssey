import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import GLTFMeshGL from './GLTFMeshGL';
import { loadModel } from '@/helpers/loadModel';
import { Group } from 'three';

const Scene: React.FC = () => {
  const meshRef = useRef<Group>(null);
  const [modelUrl, setModelUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchModelUrl = async () => {
      const url = await loadModel('models/shelf_test.glb'); // Adjust path based on your Firebase storage structure
      setModelUrl(url);
    };

    fetchModelUrl();
  }, []);

  return (
    <Canvas style={{ height: '100vh', width: '100vw' }} camera={{ position: [0, 0, 8], fov: 45, near: 0.1, far: 1000 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <directionalLight position={[-5, -5, -5]} intensity={0.5} />
      {modelUrl && <GLTFMeshGL ref={meshRef} modelUrl={modelUrl} />}
      <OrbitControls />
    </Canvas>
  );
};

export default Scene;
