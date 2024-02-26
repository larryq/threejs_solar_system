import "./style.css";
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
  Text,
  ScreenSpace,
  Box,
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
import Saturn from "./Saturn.jsx";
import Mercury from "./Mercury.jsx";
import Neptune from "./Neptune.jsx";

export default function App() {
  const ref = useRef();
  const cameraControlsRef = useRef();

  function Loader() {
    const { active, progress, errors, item, loaded, total } = useProgress();
    return <Html center>{progress} % loaded</Html>;
  }

  function Loader2() {
    return (
      <Html>
        {" "}
        <div className="loading">Loading...</div>
      </Html>
    );
  }

  return (
    <Canvas shadows dpr={[1, 2]} camera={{ fov: 50 }}>
      <color attach="background" args={["black"]} />
      <Suspense fallback={<Loader2 />}>
        <Stage
          controls={ref}
          preset="portrait"
          intensity={1.5}
          environment={false}
        >
          <Starz />
          <group>
            <Earth
              camRef={cameraControlsRef}
              position={[25, 0, 5]}
              scale={3.5}
            />
            <Uranus
              camRef={cameraControlsRef}
              position={[70, 0, 45]}
              rotation={[0, Math.PI, 0]}
              scale={3.5}
            />
            <Sun
              camRef={cameraControlsRef}
              position={[0, 0, 0]}
              rotation={[0, Math.PI, 0]}
              scale={11.5}
            />
            <Mars
              camRef={cameraControlsRef}
              position={[35, 0, 19]}
              rotation={[0, Math.PI, 0]}
              scale={1.5}
            />
            <Venus
              camRef={cameraControlsRef}
              position={[15, 0, -18]}
              rotation={[0, Math.PI, 0]}
              scale={1.5}
            />
            <Jupiter
              camRef={cameraControlsRef}
              position={[-50, 0, -21]}
              rotation={[0, Math.PI, 0]}
              scale={3.5}
            />
            <Saturn
              camRef={cameraControlsRef}
              position={[-77, 0, 14]}
              rotation={[0, Math.PI, 0]}
              scale={3.0}
            />
            <Mercury
              camRef={cameraControlsRef}
              position={[-2, 0, 16]}
              rotation={[0, Math.PI, 0]}
              scale={1.0}
            />
            <Neptune
              camRef={cameraControlsRef}
              position={[-2, 0, -36]}
              rotation={[0, Math.PI, 0]}
              scale={3.0}
            />
            <mesh onLoad={() => {}}></mesh>
          </group>

          {/* <Environment files="hdr.hdr" background /> */}
        </Stage>
      </Suspense>

      <CameraControls
        target={[0, 0, 0]}
        position={[-15, 15, 0]}
        ref={cameraControlsRef}
        //minDistance={0}
        // maxDistance={200}
        enabled={true}
        verticalDragToForward={true}
        dollySpeed={0.31}
        //dollyToCursor={dollyToCursor}
        //infinityDolly={true}
      />
    </Canvas>
  );
}
