import { Sphere, useTexture, Icosahedron } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import SunShader from "./effects/SunShader";
import SunFresnel from "./effects/SunFresnel";
//import MyCustomShader from "./effects/SunShader";

const Sun = ({ camRef, position, rotation, scale }) => {
  const sunRef = useRef();
  const matRef = useRef();
  const groupRef = useRef();

  const [noise] = useTexture(["sunNoise.png"]);
  const [map] = useTexture(["8k_sun.jpg"]);

  const matOpts = {
    map: map,
    //normalMap: normalMap,
  };

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
    <group ref={groupRef}>
      <mesh ref={sunRef} scale={scale} position={position} rotation={rotation}>
        <icosahedronGeometry args={[1, 12]} />
        {/* <shaderMaterial
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
      /> */}
        <meshPhongMaterial
          //attach="material"
          args={[matOpts]}
          side={THREE.DoubleSide}
        ></meshPhongMaterial>
      </mesh>
      <mesh position={position} scale={2.001} rotation={rotation}>
        <icosahedronGeometry args={[2, 11]} />
        <shaderMaterial attach="material" {...SunFresnel} />
      </mesh>
    </group>
  );
};

export default Sun;
