import { useFrame, extend } from "@react-three/fiber";
import { LayerMaterial, Depth, Fresnel } from "lamina";
import { useMemo, useRef } from "react";
import FresnelMaterial from "./effects/Fresnel";
import Marker from "./effects/Marker";
import { FaMapMarkerAlt } from "react-icons/fa";

import SwirlEffect from "./SwirlEffect";

extend({ SwirlEffect });

const Planet = ({ camRef, position, rotation, scale }) => {
  const materialRef = useRef();
  const meshRef = useRef();
  const groupRef = useRef();
  const markerRef = useRef();
  const markerPosition = [0, 15.0, 0];

  useFrame((state, delta) => {
    const { clock, size } = state;
    materialRef.current.time = clock.getElapsedTime();
    materialRef.current.width = size.width;
    materialRef.current.height = size.height;
    meshRef.current.rotation.y += delta / 20;
    if (meshRef.current.geometry.boundingSphere?.radius) {
      markerRef.current.position.y =
        meshRef.current.position.y +
        meshRef.current.geometry.boundingSphere?.radius * scale +
        2.0;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      <mesh
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
      <mesh scale={scale * 1.01}>
        <icosahedronGeometry args={[2, 11]} />
        <shaderMaterial attach="material" {...FresnelMaterial} />
      </mesh>
      <group position={markerPosition} ref={markerRef}>
        <Marker scale={1} rotation={rotation}>
          <div
            style={{
              position: "absolute",
              fontSize: 10,
              color: "white",
              letterSpacing: -0.5,
              left: 17.5,
            }}
            onClick={() => {}}
          >
            Uranus
          </div>
          <FaMapMarkerAlt style={{ color: "brown" }} />
        </Marker>
      </group>
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
