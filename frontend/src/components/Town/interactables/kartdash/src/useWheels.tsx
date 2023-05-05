import { useCompoundBody } from '@react-three/cannon';
import { useRef } from 'react';

interface WheelInfoOptions {
  radius: number;
  axleLocal: [number, number, number];
  directionLocal: [number, number, number];
  suspensionStiffness: number;
  frictionSlip: number;
  suspensionRestLength: number;
  rollInfluence: number;
  useCustomSlidingRotationalSpeed: boolean;
  customSlidingRotationalSpeed: number;
  naxSuspensionForce: number;
  naxSuspensionTravel: number;
  directionalLocal: [number, number, number];
  chassisConnectionPointPortal: [number, number, number];
  isFrontWheel: boolean;
}

export const useWheels = (
  width: number,
  height: number,
  front: number,
  radius: number,
): [React.MutableRefObject<null>[], WheelInfoOptions[]] => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const wheels = [useRef(null), useRef(null), useRef(null)];

  const wheelInfo = {
    radius,
    axleLocal: [1, 0, 0],
    directionLocal: [0, -1, 0],
    suspensionStiffness: 60,
    frictionSlip: 5,
    suspensionRestLength: 0.1,
    rollInfluence: 0.01,
    useCustomSlidingRotationalSpeed: true,
    customSlidingRotationalSpeed: -30,
    naxSuspensionForce: 100000,
    naxSuspensionTravel: 0.1,
    directionalLocal: [0, -1, 0],
    chassisConnectionPointPortal: [0, 0, 0],
  };

  const wheelInfos = [
    {
      ...wheelInfo,
      chassisConnectionPointPortal: [-width * 0.65, height * 0.4, front],
      isFrontWheel: true,
    },
    {
      ...wheelInfo,
      chassisConnectionPointPortal: [width * 0.65, height * 0.4, front],
      isFrontWheel: true,
    },
    {
      ...wheelInfo,
      chassisConnectionPointPortal: [-width * 0.65, height * 0.4, -front],
      isFrontWheel: true,
    },
    {
      ...wheelInfo,
      chassisConnectionPointPortal: [width * 0.65, height * 0.4, -front],
      isFrontWheel: false,
    },
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const eachWheelPhysics = (): any => ({
    collisionFilterGroup: 0,
    mass: 1,
    shapes: [
      {
        args: [wheelInfo.radius, wheelInfo.radius, 0.015, 16],
        rotation: [0, 0, -Math.PI / 2],
        type: 'Cylinder',
      },
    ],
    type: 'Kinematic',
  });

  useCompoundBody(eachWheelPhysics, wheels[0]);
  useCompoundBody(eachWheelPhysics, wheels[1]);
  useCompoundBody(eachWheelPhysics, wheels[2]);
  useCompoundBody(eachWheelPhysics, wheels[3]);

  return [wheels, wheelInfos];
};
