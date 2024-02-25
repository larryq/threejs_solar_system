import { Sphere, useTexture, Icosahedron } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import SunShader from "./effects/SunShader";
//import MyCustomShader from "./effects/SunShader";

const Sun = ({ camRef, position, rotation, scale }) => {
  const sunRef = useRef();
  const matRef = useRef();

  const [noise] = useTexture(["sunNoise.png"]);

  useFrame((state, delta) => {
    if (matRef.current) {
      matRef.current.uniforms.time.value = state.clock.getElapsedTime();
      matRef.current.uniforms.width.value = state.size.width;
      matRef.current.uniforms.height.value = state.size.height;

      /* 
      matRef.current.uniforms.noiseTexture.value = noise;

      matRef.current.uniforms.sunColor.value = new THREE.Color(0xfff00);
      matRef.current.uniforms.uColorStart.value = new THREE.Color("#ffffff");
      matRef.current.uniforms.uColorEnd.value = new THREE.Color("#000000"); */
    }
  });
  return (
    <mesh ref={sunRef} position={position} rotation={rotation} scale={scale}>
      <icosahedronGeometry args={[1, 12]} />
      <shaderMaterial
        ref={matRef}
        attach="material"
        // {...SunShader}
        fragmentShader={SunShader.fragmentShader}
        vertexShader={SunShader.vertexShader}
        uniforms={{
          // Define your uniforms here
          time: { value: 0.0 },
          width: { value: 0.0 },
          height: { value: 0.0 },
          sunColor: { value: new THREE.Color(0xfff00) },
          noiseScale: { value: 2.0 },
          noiseAmplitude: { value: 3.0 },
        }}
      />
    </mesh>
    /*     <MyCustomShader
      position={position}
      rotation={rotation}
      scale={scale}
    ></MyCustomShader> */
  );
};

export default Sun;
