import React, { Suspense, useState, useEffect } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { storage } from '../api/firebase';
import { ref, getDownloadURL } from 'firebase/storage';

const Model: React.FC<{ url: string }> = ({ url }) => {
  const gltf = useLoader(GLTFLoader, url);
  return <primitive object={gltf.scene} scale={[1, 1, 1]} position={[0, 0, 0]} />;
};

const ModelViewer: React.FC<{ modelName: string }> = ({ modelName }) => {
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModelUrl = async () => {
      try {
        const modelRef = ref(storage, `models/${modelName}.glb`);
        const url = await getDownloadURL(modelRef);
        setModelUrl(url);
      } catch (error) {
        console.error('Error fetching model URL:', error);
        setError('Could not load model. Please try again later.');
      }
    };

    fetchModelUrl();
  }, [modelName]);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      {error && <p>{error}</p>}
      {!error && modelUrl && (
        <Canvas
          frameloop="demand"
          camera={{ position: [-4, 3, 6], fov: 45, near: 0.1, far: 1000 }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <directionalLight position={[-5, -5, -5]} intensity={0.5} />
          <Suspense fallback={<Html><div>Loading...</div></Html>}>
            <Model url={modelUrl} />
          </Suspense>
          <OrbitControls />
        </Canvas>
      )}
    </div>
  );
};

export default ModelViewer;
