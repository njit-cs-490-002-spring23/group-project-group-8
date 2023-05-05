import { useLoader } from '@react-three/fiber';
import React, { useEffect } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { TextureLoader } from 'three/src/loaders/TextureLoader';

export function Track(): JSX.Element {
  const result = useLoader(GLTFLoader, process.env.PUBLIC_URL + '/models/track.glb');
  const colorMap = useLoader(TextureLoader, process.env.PUBLIC_URL + '/textures/track.png');

  useEffect(() => {
    colorMap.anisotropy = 16;
  }, [colorMap]);

  const geometry = (result.scene.children[0] as THREE.Mesh).geometry;

  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial toneMapped={false} map={colorMap} />
    </mesh>
  );
}
