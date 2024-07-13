import React, { ReactNode, useMemo, forwardRef, useState, useEffect, useRef } from 'react';
import { useGLTF, Html } from '@react-three/drei';
import { Group as ThreeGroup, Mesh as ThreeMesh, Object3D } from 'three';
import { EffectComposer, Outline } from '@react-three/postprocessing';
import { ThreeEvent, useThree } from '@react-three/fiber';

interface IGLTFMeshGLProps {
  modelUrl: string;
}

const GLTFMeshGL = forwardRef<ThreeGroup, IGLTFMeshGLProps>(({ modelUrl }, ref) => {
  const { nodes } = useGLTF(modelUrl);
  const [hoveredGroup, setHoveredGroup] = useState<ThreeGroup | null>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const groupTitles: { [key: string]: string } = {
    'book_pile1': 'Title 1',
    'book_pile2': 'Title 2',
    'book_pile3': 'Title 3',
    'book_pile4': 'Title 4',
    'book_pile5': 'Title 5',
    'book_pile6': 'Title 6',
    'book_pile7': 'Title 7',
    'book_pile8': 'Title 8',
    'book_pile9': 'Title 9',
    'book_pile10': 'Title 10',
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
    transform: 'translate(-50%, -50%)', // Optional: Center the tooltip around the mouse pointer
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
