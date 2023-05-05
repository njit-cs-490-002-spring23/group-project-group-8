/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCompoundBody } from '@react-three/cannon';
import { useRef } from 'react';

interface WheelInfo {
  radius: number;
  directionLocal: number[];
  axleLocal: number[];
  suspensionStiffness: number;
  suspensionRestLength: number;
  frictionSlip: number;
  dampingRelaxation: number;
  dampingCompression: number;
  maxSuspensionForce: number;
  rollInfluence: number;
  maxSuspensionTravel: number;
  customSlidingRotationalSpeed: number;
  useCustomSlidingRotationalSpeed: boolean;
  chassisConnectionPointLocal?: any;
  isFrontWheel: boolean;
}

export const useWheels = (
  width: number,
  height: number,
  front: number,
  radius: number,
): [React.MutableRefObject<any>[], WheelInfo[]] => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const wheels = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const wheelInfo = {
    radius,
    directionLocal: [0, -1, 0],
    axleLocal: [1, 0, 0],
    suspensionStiffness: 60,
    suspensionRestLength: 0.1,
    frictionSlip: 5,
    dampingRelaxation: 2.3,
    dampingCompression: 4.4,
    maxSuspensionForce: 100000,
    rollInfluence: 0.01,
    maxSuspensionTravel: 0.1,
    customSlidingRotationalSpeed: -30,
    useCustomSlidingRotationalSpeed: true,
    isFrontWheel: true,
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
