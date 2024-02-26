import * as THREE from "three";
import { useFrame, extend } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { useTexture } from "@react-three/drei";
import MarsFresnel from "./effects/MarsFresnel";
import Marker from "./effects/Marker";
import { FaMapMarkerAlt } from "react-icons/fa";

const Planet = ({ camRef, position, rotation, scale }) => {
  const materialRef = useRef();
  const meshRef = useRef();
  const groupRef = useRef();
  const cloudRef = useRef();
  const markerRef = useRef();

  const markerPosition = [0, 5.0, 0];

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
      <mesh scale={3.013} ref={cloudRef}>
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
      <mesh scale={scale * 1.01}>
        <icosahedronGeometry args={[2, 11]} />
        <shaderMaterial attach="material" {...MarsFresnel} />
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
            Venus
          </div>
          <FaMapMarkerAlt style={{ color: "grey" }} />
        </Marker>
      </group>
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
