import React from "react";
import { Sphere, useTexture, Icosahedron } from "@react-three/drei";
import { useFrame, extend } from "@react-three/fiber";
import * as THREE from "three";

import FresnelMaterial from "./effects/Fresnel";

export default function Earth({ camRef, position, rotation, scale }) {
  const [map, specularMap, bumpMap, cloudMap, cloudTransMap, lightsMap] =
    useTexture([
      "1_earth_8k.jpg", //"2_no_clouds_8k.jpg", //"00_earthmap1k.jpg",
      "02_earthspec1k.jpg",
      "01_earthbump1k.jpg",
      "04_earthcloudmap.jpg",
      "05_earthcloudmaptrans.jpg",
      "03_earthlights1k.jpg",
    ]);
  const matOpts = {
    map: map,
    specularMap: specularMap,
    bumpMap: bumpMap,
    bumpScale: 0.04,
  };

  useFrame((state, delta) => {
    const { clock } = state;
    //groupRef.current["rotation-z"] = (clock.getElapsedTime() * Math.PI) / 180;
    groupRef.current.rotation.y += delta / 20;
    cloudRef.current.rotation.y += delta / 25;
  });

  const groupRef = React.useRef();
  const cloudRef = React.useRef();
  const meshRef = React.useRef();

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <mesh
        ref={meshRef}
        onClick={() => {
          console.log(position);
          camRef.current?.setLookAt(
            meshRef.current.geometry.boundingSphere.radius + 1,
            meshRef.current.geometry.boundingSphere.radius - 1,
            meshRef.current.geometry.boundingSphere.radius + 1,
            meshRef.current.position.x,
            meshRef.current.position.y,
            meshRef.current.position.z,
            // position.x,
            // position.y,
            // position.z,
            false
          );
        }}
      >
        <icosahedronGeometry args={[1, 12]} />
        <meshPhongMaterial
          //attach="material"
          args={[matOpts]}
          side={THREE.DoubleSide}
        ></meshPhongMaterial>
      </mesh>

      <mesh scale={1.003} ref={cloudRef}>
        <icosahedronGeometry args={[1, 12]} />
        <meshStandardMaterial
          //attach="material"
          args={[
            {
              map: cloudMap,
              alphaMap: cloudTransMap,
              opacity: 0.7,
              transparent: true,
              blending: THREE.AdditiveBlending,
            },
          ]}
        ></meshStandardMaterial>
      </mesh>
      <mesh scale={1.01}>
        <icosahedronGeometry args={[1, 12]} />
        <shaderMaterial attach="material" {...FresnelMaterial} />
      </mesh>
    </group>
  );
}
