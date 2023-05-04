import { useEffect, useState } from 'react';

type Controls = {
  [key: string]: boolean;
  w: boolean;
  a: boolean;
  s: boolean;
  d: boolean;
  arrowup: boolean;
  arrowdown: boolean;
  arrowleft: boolean;
  arrowright: boolean;
  r: boolean;
};

type VehicleApi = {
  applyEngineForce: (force: number, wheelIndex: number) => void;
  setSteeringValue: (value: number, wheelIndex: number) => void;
};

type ChassisApi = {
  applyLocalImpulse: (impulse: [number, number, number], point: [number, number, number]) => void;
  position: { set: (x: number, y: number, z: number) => void };
  velocity: { set: (x: number, y: number, z: number) => void };
  angularVelocity: { set: (x: number, y: number, z: number) => void };
  rotation: { set: (x: number, y: number, z: number) => void };
};

export const useControls = (vehicleApi: VehicleApi, chassisApi: ChassisApi) => {
  const [controls, setControls] = useState<Controls>({
    w: false,
    a: false,
    s: false,
    d: false,
    arrowup: false,
    arrowdown: false,
    arrowleft: false,
    arrowright: false,
    r: false,
  });

  useEffect(() => {
    const keyDownPressHandler = (e: KeyboardEvent) => {
      setControls(prevControls => ({ ...prevControls, [e.key.toLowerCase()]: true }));
    };

    const keyUpPressHandler = (e: KeyboardEvent) => {
      setControls(prevControls => ({ ...prevControls, [e.key.toLowerCase()]: false }));
    };

    window.addEventListener('keydown', keyDownPressHandler);
    window.addEventListener('keyup', keyUpPressHandler);
    return () => {
      window.removeEventListener('keydown', keyDownPressHandler);
      window.removeEventListener('keyup', keyUpPressHandler);
    };
  }, []);

  useEffect(() => {
    if (!vehicleApi || !chassisApi) return;

    if (controls.w) {
      vehicleApi.applyEngineForce(150, 2);
      vehicleApi.applyEngineForce(150, 3);
    } else if (controls.s) {
      vehicleApi.applyEngineForce(-150, 2);
      vehicleApi.applyEngineForce(-150, 3);
    } else {
      vehicleApi.applyEngineForce(0, 2);
      vehicleApi.applyEngineForce(0, 3);
    }

    if (controls.a) {
      vehicleApi.setSteeringValue(0.35, 2);
      vehicleApi.setSteeringValue(0.35, 3);
      vehicleApi.setSteeringValue(-0.1, 0);
      vehicleApi.setSteeringValue(-0.1, 1);
    } else if (controls.d) {
      vehicleApi.setSteeringValue(-0.35, 2);
      vehicleApi.setSteeringValue(-0.35, 3);
      vehicleApi.setSteeringValue(0.1, 0);
      vehicleApi.setSteeringValue(0.1, 1);
    } else {
      for (let i = 0; i < 4; i++) {
        vehicleApi.setSteeringValue(0, i);
      }
    }

    if (controls.arrowdown) {
      chassisApi.applyLocalImpulse([0, -5, 0], [0, 0, +1]);
    }

    if (controls.arrowup) {
      chassisApi.applyLocalImpulse([0, -5, 0], [0, 0, -1]);
    }

    if (controls.arrowleft) {
      chassisApi.applyLocalImpulse([0, -5, 0], [-0.5, 0, 0]);
    }

    if (controls.arrowright) {
      chassisApi.applyLocalImpulse([0, -5, 0], [+0.5, 0, 0]);
    }

    if (controls.r) {
      chassisApi.position.set(-1.5, 0.5, 3);
      chassisApi.velocity.set(0, 0, 0);
      chassisApi.angularVelocity.set(0, 0, 0);
      chassisApi.rotation.set(0, 0, 0);
    }
  }, [controls, vehicleApi, chassisApi]);

  return controls;
};
