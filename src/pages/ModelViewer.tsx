import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Html, useGLTF, useAnimations } from '@react-three/drei';
import { storage } from '../api/firebase';
import { ref, getDownloadURL } from 'firebase/storage';
import * as THREE from 'three';

//muss in components

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
          console.log(action.getClip().name);
          if (action.getClip().name === 'loopingAnimation') {
            action.setLoop(THREE.LoopRepeat, Infinity);
          } else {
            action.setLoop(THREE.LoopOnce, 1);
            action.clampWhenFinished = true;
          }
          action.play();
        }
      });
    }

    // Center model
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    scene.position.sub(center);
  }, [actions, animations, scene]);

  return (
    <primitive
      object={scene}
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
  const canvasRef = useRef<HTMLDivElement>(null);

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
    <div style={{ width: '100vw', height: '100vh' }} ref={canvasRef}>
      {error && <p>{error}</p>}
      {modelUrl && (
        <Canvas
          frameloop="always"
          camera={{ position: [25, 13, 20], fov: 12, near: 0.1, far: 100 }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <directionalLight position={[-5, -5, -5]} intensity={0.5} />
            <Model url={modelUrl} />
          <OrbitControls />
        </Canvas>
      )}
    </div>
  );
};

export default ModelViewer;
