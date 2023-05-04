import { useLoader } from '@react-three/fiber';
import React, { useEffect } from 'react';
import { Object3D } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export function Car(): JSX.Element {
  const mesh = useLoader(GLTFLoader, process.env.PUBLIC_URL + './models/car.glb').scene as Object3D;

  useEffect(() => {
    mesh.scale.set(0.0012, 0.0012, 0.0012);
    (mesh.children[0] as Object3D).position.set(-365, -18, -67);
  }, [mesh]);

  return <primitive object={mesh} rotation-y={Math.PI} />;
}
