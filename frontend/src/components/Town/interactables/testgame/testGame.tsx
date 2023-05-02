/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import * as THREE from 'three';
import * as React from 'react';
import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import KartDashController from '../../../../classes/KartDashController';
import TownController, { usePlayers } from '../../../../classes/TownController';
import { ReactJSXIntrinsicElements } from '@emotion/react/types/jsx-namespace';
import useTownController from '../../../../hooks/useTownController';

function Box(props: JSX.IntrinsicElements['mesh']) {
    const ref = useRef<THREE.Mesh>(null!)

    const [hovered, hover] = useState(false)
    const [clicked, click] = useState(false)

    useFrame((state, delta) => (ref.current.rotation.x += 0.01))

    return (
        <mesh
        {...props}
        ref={ref}
        scale={clicked ? 1.5 : 1}
        onClick={(event) => click(!clicked)}
        onPointerOver={(event) => hover(true)}
        onPointerOut={(event) => hover(false)}>
        <boxGeometry args={[1,1,1]} />
        <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
        </mesh>
    )
}

export default function TestGame() {
    const players = usePlayers();
    const { friendlyName, townID } = useTownController();
    const sorted = players.concat([]);
    sorted.sort((p1, p2) =>
      p1.userName.localeCompare(p2.userName, undefined, { numeric: true, sensitivity: 'base' }),
    );
    console.log(players[0].userName);
    return (
        <Canvas>
        <ambientLight intensity={0.5} />
        <spotLight position = {[10,10,10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10,-10,-10]} />
        <Box position={[-1.2, 0, 0]} />
        <Box position={[1.2, 0, 0]} />
        </Canvas>
    )
}