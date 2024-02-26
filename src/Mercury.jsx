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

  const [map] = useTexture(["2k_mercury.jpg"]);

  const matOpts = {
    map: map,
  };

  useFrame((state, delta) => {
    const { clock, size } = state;

    meshRef.current.rotation.y -= delta / 30;
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
          side={THREE.DoubleSide}
        ></meshPhongMaterial>
      </mesh>
      <mesh
        scale={1.013}
        ref={cloudRef}
        position={position}
        rotation={rotation}
      >
        <icosahedronGeometry args={[1, 12]} />
        <meshStandardMaterial
          //attach="material"
          args={[
            {
              map: map,

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

const Mercury = ({ camRef, position, rotation, scale }) => {
  return (
    <Planet
      camRef={camRef}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
};

export default Mercury;
