/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Physics, useBox, usePlane } from '@react-three/cannon';
import { OrbitControls } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as React from 'react';
import { useRef, useState } from 'react';
import * as THREE from 'three';

function Box(props: JSX.IntrinsicElements['mesh']) {
  const ref = useRef<THREE.Mesh>(null!);

  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);

  useFrame((state, delta) => (ref.current.rotation.x += 0.01));

  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={event => click(!clicked)}
      onPointerOver={event => hover(true)}
      onPointerOut={event => hover(false)}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  );
}

function Spehere() {
  const [refPhys, api] = useBox(() => ({ mass: 1, position: [0, 2, 0] }));
  return (
    <mesh
      onClick={() => {
        api.velocity.set(0, 5, 0);
      }}
      ref={refPhys}
      position={[0, 2, 0]}>
      <sphereGeometry attach='geometry' />
      <meshLambertMaterial attach='material' color='red' />
    </mesh>
  );
}

function BackGround() {
  const { scene } = useThree();
  const loader = new THREE.TextureLoader();

  const texture = loader.load('/textures/startLabel.png');

  scene.background = texture;
  return (
    <mesh>
      <planeGeometry attach='geometry' args={[300, 300]} />
      <meshLambertMaterial attach='material' />
    </mesh>
  );
}

function Plane() {
  const [refPhys] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0] }));
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry attach='geometry' args={[100, 100]} />
      <meshLambertMaterial attach='material' color='lightblue' />
    </mesh>
  );
}

export default function TestGame() {
  return (
    <Canvas>
      <OrbitControls />
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <Physics>
        <Box position={[-1, 2, 0]} />
        <Box position={[-3, 3, 0]} />
        <Box position={[2, 0, 0]} />
        <Box position={[1, 4, 0]} />
        <Spehere />
        <Plane />
      </Physics>
    </Canvas>
  );
}
