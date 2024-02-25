import React, { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Stage,
  CameraControls,
  Ring,
  Environment,
  useTexture,
  useProgress,
  Html,
} from "@react-three/drei";

import Starz from "./Stars";
import Earth from "./Earth";
import Uranus from "./Uranus.jsx";
import Sun from "/Sun.jsx";
import SunShader from "./effects/SunShader.js";
import Mars from "./Mars.jsx";
import Venus from "./Venus.jsx";
import Jupiter from "./Jupiter.jsx";
import * as THREE from "three";

export default function App() {
  const ref = useRef();
  const cameraControlsRef = useRef();

  function Loader() {
    const { active, progress, errors, item, loaded, total } = useProgress();
    return <Html center>{progress} % loaded</Html>;
  }

  return (
    <Canvas shadows dpr={[1, 2]} camera={{ fov: 50 }}>
      <color attach="background" args={["black"]} />
      <Suspense fallback={<Loader />}>
        <Stage
          controls={ref}
          preset="portrait"
          intensity={1.5}
          environment={false}
        >
          <Starz />
          <Earth camRef={cameraControlsRef} position={[25, 0, 0]} />
          <Uranus
            camRef={cameraControlsRef}
            position={[50, 0, 0]}
            rotation={[0, Math.PI, 0]}
            scale={4.5}
          />
          <Sun
            camRef={cameraControlsRef}
            position={[0, 0, 0]}
            rotation={[0, Math.PI, 0]}
            scale={3.5}
          />
          <Mars
            camRef={cameraControlsRef}
            position={[35, 0, 0]}
            rotation={[0, Math.PI, 0]}
            scale={1.5}
          />
          <Venus
            camRef={cameraControlsRef}
            position={[15, 0, 0]}
            rotation={[0, Math.PI, 0]}
            scale={1.5}
          />
          <Jupiter
            camRef={cameraControlsRef}
            position={[40, 0, 0]}
            rotation={[0, Math.PI, 0]}
            scale={5.5}
          />
          {/* <Environment files="hdr.hdr" background /> */}
        </Stage>
      </Suspense>
      <CameraControls
        ref={cameraControlsRef}
        //minDistance={minDistance}
        enabled={true}
        verticalDragToForward={false}
        dollySpeed={0.11}
        //dollyToCursor={dollyToCursor}
        //infinityDolly={infinityDolly}
      />
    </Canvas>
  );
}
