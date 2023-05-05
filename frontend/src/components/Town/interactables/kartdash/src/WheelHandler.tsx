/* eslint-disable @typescript-eslint/naming-convention */
import React from 'react';
import { Group } from 'three';

/**
 * Component to render cylinder that will bind physics on track
 * with cannon's.
 */

interface WheelHandleProps {
  radius: number;
  wheelRef: React.MutableRefObject<Group | null>;
  active: boolean;
}

const WheelHandle = ({ radius, wheelRef }: WheelHandleProps) => {
  return (
    <group ref={wheelRef}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[radius, radius, 0.015, 16]} />
        <meshBasicMaterial transparent={true} opacity={0.25} />
      </mesh>
    </group>
  );
};

export const WheelHandler = ({
  radius,
  wheelRef,
  active,
}: WheelHandleProps & { active: boolean }) => {
  return active ? <WheelHandle radius={radius} wheelRef={wheelRef} active={active} /> : null;
};
