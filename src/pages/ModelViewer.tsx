import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Html, useGLTF, useAnimations } from '@react-three/drei';
import { storage } from '../api/firebase';
import { ref, getDownloadURL } from 'firebase/storage';
import * as THREE from 'three';

interface ModelProps {
  url: string;
}

const Model: React.FC<ModelProps> = ({ url }) => {
  const { scene, animations } = useGLTF(url);
  const group = useRef<THREE.Group>(null);
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (actions && animations.length > 0) {
      Object.values(actions).forEach((action) => {
        if (action) {
          action.play();
        }
      });
    }
  }, [actions, animations]);

  return (
    <primitive
      object={scene.clone()}
      ref={group}
      scale={[1, 1, 1]}
      position={[0, 0, 0]}
    />
  );
};

interface ModelViewerProps {
  modelName: string;
}

const ModelViewer: React.FC<ModelViewerProps> = ({ modelName }) => {
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
      {modelUrl && (
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
