import * as THREE from "three";
import { useFrame, extend } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { useTexture } from "@react-three/drei";
import MarsFresnel from "./effects/MarsFresnel";

const Planet = ({ camRef, position, rotation, scale }) => {
  const materialRef = useRef();
  const meshRef = useRef();
  const groupRef = useRef();
  const cloudRef = useRef();

  const [map, normalMap, cloudMap, cloudTransMap] = useTexture([
    "8k_venus_surface.jpg",
    "venus_normal_map_8k.png",
    "04_earthcloudmap.jpg",
    "05_earthcloudmaptrans.jpg",
  ]);

  const matOpts = {
    map: map,
    normalMap: normalMap,
  };

  useFrame((state, delta) => {
    const { clock, size } = state;

    meshRef.current.rotation.y -= delta / 30;
    cloudRef.current.rotation.y += delta / 20;
  });

  return (
    <group ref={groupRef}>
      <mesh
        position={position}
        rotation={rotation}
        scale={scale}
        ref={meshRef}
        onClick={() => {
          camRef.current?.setLookAt(
            meshRef.current.geometry.boundingSphere.radius + 3,
            meshRef.current.geometry.boundingSphere.radius - 3,
            meshRef.current.geometry.boundingSphere.radius + 3,
            meshRef.current.position.x,
            meshRef.current.position.y,
            meshRef.current.position.z,
            true
          );
          console.log(meshRef.current);
        }}
      >
        <icosahedronGeometry args={[2, 11]} />
        <meshPhongMaterial
          //attach="material"
          args={[matOpts]}
        ></meshPhongMaterial>
      </mesh>
      <mesh
        scale={3.013}
        ref={cloudRef}
        position={position}
        rotation={rotation}
      >
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
      <mesh position={position} rotation={rotation} scale={scale * 1.01}>
        <icosahedronGeometry args={[2, 11]} />
        <shaderMaterial attach="material" {...MarsFresnel} />
      </mesh>
    </group>
  );
};

const Venus = ({ camRef, position, rotation, scale }) => {
  return (
    <Planet
      camRef={camRef}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
};

export default Venus;
