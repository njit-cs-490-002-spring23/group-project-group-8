/* eslint-disable @typescript-eslint/no-explicit-any */
import { MeshReflectorMaterial } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import React, { useEffect, useRef } from 'react';
import { BufferAttribute } from 'three';
import { TextureLoader } from 'three/src/loaders/TextureLoader';

export function Ground(): JSX.Element {
  const gridMap = useLoader(TextureLoader, process.env.PUBLIC_URL + '/textures/grid.png');

  const aoMap = useLoader(TextureLoader, process.env.PUBLIC_URL + '/textures/ground-ao.png');

  const alphaMap = useLoader(TextureLoader, process.env.PUBLIC_URL + '/textures/alpha-map.png');

  useEffect(() => {
    if (gridMap) {
      gridMap.anisotropy = 16;
    }
  }, [gridMap]);

  const meshRef = useRef<any>(null);
  const meshRef2 = useRef<any>(null);

  useEffect(() => {
    if (meshRef.current && meshRef2.current) {
      const uvs = meshRef.current.geometry.attributes.uv.array;
      meshRef.current.geometry.setAttribute('uv2', new BufferAttribute(uvs, 2));

      const uvs2 = meshRef2.current.geometry.attributes.uv.array;
      meshRef2.current.geometry.setAttribute('uv2', new BufferAttribute(uvs2, 2));
    }
  }, [meshRef, meshRef2]);

  return (
    <>
      <mesh ref={meshRef2} position={[-2.285, -0.01, -1.325]} rotation-x={-Math.PI * 0.5}>
        <planeGeometry args={[12, 12]} />
        <meshBasicMaterial opacity={0.325} alphaMap={gridMap} transparent={true} color={'white'} />
      </mesh>
      <mesh
        ref={meshRef}
        position={[-2.285, -0.015, -1.325]}
        rotation-x={-Math.PI * 0.5}
        rotation-z={-0.079}>
        <circleGeometry args={[6.12, 50]} />
        <MeshReflectorMaterial
          aoMap={aoMap}
          alphaMap={alphaMap}
          transparent={false}
          color={[0.5, 0.5, 0.5]}
          envMapIntensity={0.35}
          metalness={0.05}
          roughness={0.4}
          dithering={true}
          blur={[1024, 512]}
          mixBlur={3}
          mixStrength={30}
          mixContrast={1}
          resolution={1024}
          mirror={0}
          depthScale={0}
          minDepthThreshold={0.9}
          maxDepthThreshold={1}
          depthToBlurRatioBias={0.25}
          reflectorOffset={0.02}
          refractionRatio={undefined}
          alphaWrite={undefined}
        />
      </mesh>
    </>
  );
}
