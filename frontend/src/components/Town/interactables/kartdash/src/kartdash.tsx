import { Physics } from '@react-three/cannon';
import { Canvas } from '@react-three/fiber';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Scene } from './Scene';

ReactDOM.render(
  <Canvas>
    <Physics broadphase='SAP' gravity={[0, -2.6, 0]}>
      <Scene />
    </Physics>
  </Canvas>,
  document.getElementById('root'),
);
