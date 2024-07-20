import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useGLTF, Html, OrbitControls } from '@react-three/drei';
import { Group as ThreeGroup, Mesh as ThreeMesh, Object3D } from 'three';
import { EffectComposer, Outline } from '@react-three/postprocessing';
import { Canvas, ThreeEvent } from '@react-three/fiber';
import { useRouter } from 'next/router'; // Import the useRouter hook from next/router

interface IGLTFMeshGLProps {
  modelUrl: string;
  groupTitles: { [key: string]: string };
}

const GLTFMeshGL: React.FC<IGLTFMeshGLProps> = ({ modelUrl, groupTitles }) => {
  const { nodes } = useGLTF(modelUrl);
  const [hoveredGroup, setHoveredGroup] = useState<ThreeGroup | null>(null);
  const hoveredGroupRef = useRef<ThreeGroup | null>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const router = useRouter(); // Initialize the router

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX - 600, y: event.clientY - 400 });
    };

    if (hoveredGroup) {
      window.addEventListener('mousemove', handleMouseMove);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [hoveredGroup]);

  const handlePointerOver = (event: ThreeEvent<PointerEvent>, group: ThreeGroup) => {
    const groupName = group.name;
    if (groupTitles[groupName]) {
      setHoveredGroup(group);
      hoveredGroupRef.current = group;
    }
  };

  const handlePointerOut = () => {
    if(hoveredGroupRef.current) {
      const groupName = hoveredGroupRef.current.name;
      if(groupTitles[groupName]) {
        setHoveredGroup(null);
        hoveredGroupRef.current = null;
      }
    }
  };

  const handleOnClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation(); // Prevent the event from bubbling up
    if (hoveredGroupRef.current) {
      const groupName = hoveredGroupRef.current.name;
      console.log(groupTitles[groupName]);
      const categoryId = groupTitles[groupName];
      if (categoryId) {
        router.push(`/category/${categoryId}`); 
      }
    } else {
      console.log("null");
    }
  };

  const renderedScene = useMemo(() => {
    if (!nodes || !nodes['Scene']) return null;

    const sceneNode = nodes['Scene'];

    const renderScene = (node: Object3D, nodeName: string): JSX.Element | null => {
      if (node instanceof ThreeMesh) {
        return (
          <mesh
            key={node.name}
            geometry={node.geometry}
            material={node.material}
            position={node.position}
            rotation={node.rotation}
            scale={node.scale}
          />
        );
      } else if (node instanceof ThreeGroup) {
        const isBookPile = node.name.includes('book_pile');
        return (
          <group
            key={node.name}
            position={node.position}
            rotation={node.rotation}
            scale={node.scale}
            onPointerOver={isBookPile ? (e) => handlePointerOver(e, node) : undefined}
            onPointerOut={isBookPile ? handlePointerOut : undefined}
            onClick={isBookPile ? handleOnClick : undefined}
          >
            {node.children.map((child, idx) => renderScene(child, `${node.name}-${idx}`))}
          </group>
        );
      }
      return null;
    };

    return renderScene(sceneNode, sceneNode.name);
  }, [nodes]);

  const htmlStyle: React.CSSProperties = {
    pointerEvents: 'none',
    position: 'absolute',
    backgroundColor: 'white',
    padding: '10px',
    borderRadius: '5px',
    left: `${mousePosition.x}px`,
    top: `${mousePosition.y}px`,
    transform: 'translate(-50%, -50%)'
  };

  return (
    <Canvas style={{ height: '100vh', width: '100vw' }} camera={{ position: [0, 0, 8], fov: 45, near: 0.1, far: 1000 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <directionalLight position={[-5, -5, -5]} intensity={0.5} />
      <group>
        {renderedScene}
        {hoveredGroup && (
          <>
            <EffectComposer>
              <Outline />
            </EffectComposer>
            <Html style={htmlStyle}>
              <div>
                <p>{groupTitles[hoveredGroup.name]}</p>
              </div>
            </Html>
          </>
        )}
      </group>
    </Canvas>
  );
};

export default GLTFMeshGL;
