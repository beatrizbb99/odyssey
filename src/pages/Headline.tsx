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
  modelName: "reading_room";
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
    <div style={{ width: '100vw', height: '100vh' }} id="canvasRect">
      {error && <p>{error}</p>}
      {modelUrl && (
        <Canvas
          frameloop="always"
          camera={{ position: [25, 13, 20], fov: 17, near: 0.1, far: 100 }}
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

const Headline: React.FC = () => {
  useEffect(() => {
    const updateScale = () => {

      const textBehind = document.getElementById('text-behind');
      const textFront = document.getElementById('text-front');
      const textBehindBlur = document.getElementById('text-behind-blur');
      const canvasRect = document.getElementById('canvasRect');

      if (!textBehind || !textFront || !textBehindBlur || !canvasRect) return;

      const canvasBounds = canvasRect.getBoundingClientRect();
      const textBehindBounds = textBehind.getBoundingClientRect();
      const textFrontBounds = textFront.getBoundingClientRect();
      const textBehindBlurBounds = textBehindBlur.getBoundingClientRect();

      const isColliding = (textBounds: DOMRect) => {
        return !(
          canvasBounds.right < textBounds.left ||
          canvasBounds.left > textBounds.right ||
          canvasBounds.bottom < textBounds.top ||
          canvasBounds.top > textBounds.bottom
        );
      };

      const collidingWithCanvas = isColliding(textBehindBounds) || isColliding(textFrontBounds) || isColliding(textBehindBlurBounds);

      if (collidingWithCanvas) {
        textBehind.style.color = 'transparent';
        textFront.style.color = 'transparent';
        textBehindBlur.style.color = 'transparent';
      } else {
        textBehind.style.color = 'white';
        textFront.style.color = 'transparent';
        textBehindBlur.style.color = 'white';
      }
    };

    updateScale(); // Initial call to set the correct styles
    const interval = setInterval(updateScale, 1000 / 60);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="headline-container">
      <div id="text-behind">CREATIVE<br />ODYSSEY</div>
      <div id="text-behind-blur">CREATIVE<br />ODYSSEY</div>
      <div id="text-front">CREATIVE<br />ODYSSEY</div>
    </div>
  );
};

export default Headline;
