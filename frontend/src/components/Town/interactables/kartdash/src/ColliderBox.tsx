import { Triplet, useBox } from '@react-three/cannon';
import React from 'react';

const DEBUG = true;
export function ColliderBox({
  position,
  scale,
}: {
  position: Triplet;
  scale: Triplet;
}): JSX.Element {
  useBox(() => ({ args: scale, position, type: 'Static' }));
  return (
    DEBUG && (
      <mesh>
        position={position}
        <boxGeometry>args={scale}</boxGeometry>
        <meshBasicMaterial>
          transparent={true} opacity={0.25}
        </meshBasicMaterial>
      </mesh>
    )
  );

  return <></>;
}
