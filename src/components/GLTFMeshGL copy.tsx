import React, { ReactNode, useMemo, forwardRef, useState } from 'react';
import { useGLTF, Html } from '@react-three/drei';
import { Group as ThreeGroup, Mesh as ThreeMesh, Object3D, Vector3 } from 'three';
import { EffectComposer, Outline } from '@react-three/postprocessing';
import { ThreeEvent } from '@react-three/fiber';

interface IGLTFMeshGLProps {
  modelUrl: string;
  children?: ReactNode;
}

const GLTFMeshGL = forwardRef<ThreeGroup, IGLTFMeshGLProps>(({ modelUrl, children }, ref) => {
  const { nodes } = useGLTF(modelUrl);
  const [hoveredObject, setHoveredObject] = useState<Object3D | null>(null);

  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
    const { object } = event;
    if (object) {
      setHoveredObject(object as Object3D);
    }
  };

  const handlePointerOut = () => {
    setHoveredObject(null);
  };

  const renderedScene = useMemo(() => {
    if (!nodes || !nodes['Scene']) return null;

    const sceneNode = nodes['Scene'];

    // Direktes Rendern der "Scene"-Gruppe und ihrer Kinder rekursiv
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
            onPointerOver={nodeName.includes('book_pile') ? handlePointerOver : undefined}
            onPointerOut={nodeName.includes('book_pile') ? handlePointerOut : undefined}
          />
        );
      } else if (node instanceof ThreeGroup) {
        // Render Group
        return (
          <group key={node.name} position={node.position} rotation={node.rotation} scale={node.scale}>
            {Object.values(node.children).map((child, idx) => renderScene(child, `${node.name}-${idx}`))}
          </group>
        );
      }
      return null;
    };

    return renderScene(sceneNode, sceneNode.name);
  }, [nodes]);

  return (
    <group ref={ref}>
      {renderedScene}
      {children}
      {hoveredObject && (
        <>
          <EffectComposer>
            <Outline
              selectionLayer={10}
              blendFunction={1} // BlendFunction.Subtract for subtractive blending
              visibleEdgeColor={0xffffff} // Color of the visible edges
              hiddenEdgeColor={0x22090a} // Color of the hidden (occluded) edges
              edgeStrength={3} // Strength of the outline effect
              width={1}
              pulseSpeed={0} // Speed of the pulse effect
              selection={[hoveredObject]} // Array of Object3D or their names to apply the effect to
            />
          </EffectComposer>
          {hoveredObject.position && (
            <Html
              style={{
                pointerEvents: 'none',
                position: 'fixed',  // Use fixed position to overlay on top of the scene
                left: `${(hoveredObject.position.x / window.innerWidth) * 100}%`,  // Convert X position to percentage
                top: `${(1 - hoveredObject.position.y / window.innerHeight) * 100}%`,   // Convert Y position to percentage
                transform: 'translate(-50%, -50%)',  // Center the box at the mouse position
                backgroundColor: 'white',
                padding: '10px',
                borderRadius: '5px',
                whiteSpace: 'nowrap',
              }}
            >
              <div>
                <h1>Title 1</h1>
              </div>
            </Html>
          )}
        </>
      )}
    </group>
  );
});

export default GLTFMeshGL;
