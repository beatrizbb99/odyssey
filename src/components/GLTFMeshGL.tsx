import React, { useMemo, forwardRef, useState, useEffect, useRef } from 'react';
import { useGLTF, Html } from '@react-three/drei';
import { Group as ThreeGroup, Mesh as ThreeMesh, Object3D } from 'three';
import { EffectComposer, Outline } from '@react-three/postprocessing';
import { ThreeEvent } from '@react-three/fiber';

interface IGLTFMeshGLProps {
  modelUrl: string;
}

const GLTFMeshGL = forwardRef<ThreeGroup, IGLTFMeshGLProps>(({ modelUrl }, ref) => {
  const { nodes } = useGLTF(modelUrl);
  const [hoveredGroup, setHoveredGroup] = useState<ThreeGroup | null>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const groupTitles: { [key: string]: string } = {
    'book_pile1': 'Für Kinder',
    'book_pile2': 'Horror',
    'book_pile3': 'Märchen',
    'book_pile4': 'Fantasy',
    'book_pile5': 'Geschichte',
    'book_pile6': 'Paranormal',
    'book_pile7': 'Poetry',
    'book_pile8': 'Thriller',
    'book_pile9': 'Sci-Fi',
    'book_pile10': 'Dystopian',
  };

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX - 600, y: event.clientY - 400});
      console.log( event.offsetX, event.offsetY);
    };

    // Add event listener when a group is hovered
    if (hoveredGroup) {
      window.addEventListener('mousemove', handleMouseMove);
    } else {
      // Remove event listener when no group is hovered
      window.removeEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [hoveredGroup]);

  const handlePointerOver = (event: ThreeEvent<PointerEvent>, group: ThreeGroup) => {
    setHoveredGroup(group);
  };

  const handlePointerOut = () => {
    setHoveredGroup(null);
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
    <group ref={ref}>
      {renderedScene}
      {hoveredGroup && (
        <>
          <EffectComposer>
            <Outline />
          </EffectComposer>
          <Html style={htmlStyle}>
            <div>
              <p>{groupTitles[hoveredGroup.name] || 'Unknown Title'}</p>
            </div>
          </Html>
        </>
      )}
    </group>
  );
});

export default GLTFMeshGL;
