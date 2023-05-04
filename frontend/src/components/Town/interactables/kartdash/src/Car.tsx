import { useBox } from '@react-three/cannon';
import { useLoader } from '@react-three/fiber';
import React, { useEffect, useRef } from 'react';
import { Object3D } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export function Car(): JSX.Element {
  const mesh = useLoader(GLTFLoader, process.env.PUBLIC_URL + './models/car.glb').scene as Object3D;

  useEffect(() => {
    mesh.scale.set(0.0012, 0.0012, 0.0012);
    (mesh.children[0] as Object3D).position.set(-365, -18, -67);
  }, [mesh]);

  /**
   * Dimensions of the player's car.
   */
  const carWidth = 0.1;
  const carHeight = 0.05;
  const carFront = 0.1;
  const carPosition = [-1.5, 0.5, 3];
  const carWheelRadius = 0.03;

  /**
   * Initializer for the car as a physics object using useBox hook from cannon.
   */
  const carChassisArguments: [number, number, number] = [carWidth, carHeight, carFront * 2];
  const [carChassis, carChassisHook] = useBox(
    () => ({
      args: carChassisArguments,
      mass: 150,
      position: [0, 0, 0],
    }),
    useRef(null),
  );

  useEffect(() => {
    mesh.scale.set(0.001, 0.0012, 0.0012);
    (mesh.children[0] as Object3D).position.set(-365, -18, -67);
  }, [mesh]);

  return (
    <mesh ref={carChassis}>
      <meshBasicMaterial transparent={true} opacity={0.3} />
      <boxGeometry args={carChassisArguments} />
    </mesh>
  );
}
