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
  const cloudRef = useRef();

  const [noise] = useTexture(["sunNoise.png"]);
  const [map, cloudMap, cloudTransMap] = useTexture([
    "8k_sun.jpg",
    "04_earthcloudmap.jpg",
    "05_earthcloudmaptrans.jpg",
  ]);

  const matOpts = {
    map: map,
    //normalMap: normalMap,
  };

  useFrame((state, delta) => {
    if (matRef.current) {
      matRef.current.uniforms.time.value = state.clock.getElapsedTime();
      matRef.current.uniforms.width.value = state.size.width;
      matRef.current.uniforms.height.value = state.size.height;
    }
    cloudRef.current.rotation.y += delta / 12;
    groupRef.current.rotation.y -= delta / 13;
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
      <mesh scale={scale * 1.004} ref={cloudRef}>
        <icosahedronGeometry args={[1, 12]} />
        <meshStandardMaterial
          //attach="material"
          args={[
            {
              map: cloudMap,
              alphaMap: cloudTransMap,
              opacity: 0.25,
              transparent: false,
              blending: THREE.AdditiveBlending,
            },
          ]}
        ></meshStandardMaterial>
      </mesh>
      <mesh position={position} scale={5.901} rotation={rotation}>
        <icosahedronGeometry args={[2, 11]} />
        <shaderMaterial attach="material" {...SunFresnel} />
      </mesh>
    </group>
  );
};

export default Sun;
