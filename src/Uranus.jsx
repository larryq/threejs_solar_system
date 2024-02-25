import { useFrame, extend } from "@react-three/fiber";
import { LayerMaterial, Depth, Fresnel } from "lamina";
import { useMemo, useRef } from "react";
import FresnelMaterial from "./effects/Fresnel";

import SwirlEffect from "./SwirlEffect";

extend({ SwirlEffect });

const Planet = ({ camRef, position, rotation, scale }) => {
  const materialRef = useRef();
  const meshRef = useRef();
  const groupRef = useRef();

  useFrame((state, delta) => {
    const { clock, size } = state;
    materialRef.current.time = clock.getElapsedTime();
    materialRef.current.width = size.width;
    materialRef.current.height = size.height;
    meshRef.current.rotation.y += delta / 20;
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
            meshRef.current.geometry.boundingSphere.radius + 3,
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
        <LayerMaterial lighting="lambert">
          {/* First layer is our own custom layer that's based of the FBM shader */}
          {/* 
          Notice how we can use *any* uniforms as prop here 👇
          You can tweak the colors by adding a colorA or colorB prop!
        */}
          <swirlEffect
            ref={materialRef}
            width={4.0}
            height={0.0}
            time={0.0}
            lacunarity={2.3}
          />
          {/* Second layer is a depth based gradient that we "add" on top of our custom layer*/}
          <Depth colorA="blue" colorB="aqua" alpha={0.2} mode="add" />
          {/* Third Layer is a Fresnel shading effect that we add on*/}
          {/* <Fresnel color="#FEB3D9" mode="add" /> */}
        </LayerMaterial>
      </mesh>
      <mesh position={position} rotation={rotation} scale={scale * 1.01}>
        <icosahedronGeometry args={[2, 11]} />
        <shaderMaterial attach="material" {...FresnelMaterial} />
      </mesh>
    </group>
  );
};

const Uranus = ({ camRef, position, rotation, scale }) => {
  return (
    <>
      <Planet
        camRef={camRef}
        position={position}
        rotation={rotation}
        scale={scale}
      />
    </>
  );
};

export default Uranus;
