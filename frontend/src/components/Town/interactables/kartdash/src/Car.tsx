import { useBox, useRaycastVehicle } from '@react-three/cannon';
import { useLoader } from '@react-three/fiber';
import React, { useEffect, useRef } from 'react';
import { Object3D } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useControls } from './useControls';
import { useWheels } from './useWheels';
import { WheelHandler } from './WheelHandler';

export function Car(): JSX.Element {
  const mesh = useLoader(GLTFLoader, process.env.PUBLIC_URL + './models/car.glb').scene as Object3D;

  useEffect(() => {
    mesh.scale.set(0.0012, 0.0012, 0.0012);
    (mesh.children[0] as Object3D).position.set(-365, -18, -67);
  }, [mesh]);

  /**
   * Dimensions of the player's car.
   */
  const width = 0.1;
  const height = 0.05;
  const front = 0.1;
  const position: [number, number, number] = [-1.5, 0.5, 3];
  const wheelRadius = 0.03;

  /**
   * Initializer for the car as a physics object using useBox hook from cannon.
   */
  const chassisBodyArgs: [number, number, number] = [width, height, front * 2];
  const [chassisBody, chassisApi] = useBox(
    () => ({
      args: chassisBodyArgs,
      mass: 150,
      position,
    }),
    useRef(null),
  );

  const [wheels, wheelInfos] = useWheels(width, height, front, wheelRadius);

  const [vehicle, vehicleApi] = useRaycastVehicle(
    () => ({
      chassisBody,
      wheelInfos,
      wheels,
    }),
    useRef(null),
  );

  useControls(vehicleApi, chassisApi);

  useEffect(() => {
    mesh.scale.set(0.001, 0.0012, 0.0012);
    (mesh.children[0] as Object3D).position.set(-365, -18, -67);
  }, [mesh]);

  return (
    <group ref={vehicle} name='vehicle'>
      {/* <primitive object={result} rotation-y={Math.PI} position={[0, -0.09, 0]}/> */}
      <mesh ref={chassisBody}>
        <meshBasicMaterial transparent={true} opacity={0.3} />
        <boxGeometry args={chassisBodyArgs} />
      </mesh>
      <WheelHandler wheelRef={wheels[0]} radius={wheelRadius} />
      <WheelHandler wheelRef={wheels[1]} radius={wheelRadius} />
      <WheelHandler wheelRef={wheels[2]} radius={wheelRadius} />
      <WheelHandler wheelRef={wheels[3]} radius={wheelRadius} />
    </group>
  );
}
