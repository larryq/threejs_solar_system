import * as THREE from "three";
import { useFrame, extend } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { useTexture } from "@react-three/drei";
import JupiterFresnel from "./effects/JupiterFresnel";
import Marker from "./effects/Marker";
import { FaMapMarkerAlt } from "react-icons/fa";
import Rings from "./effects/Rings";

const Planet = ({ camRef, position, rotation, scale }) => {
  const materialRef = useRef();
  const meshRef = useRef();
  const groupRef = useRef();
  const markerRef = useRef();

  const [map] = useTexture(["8k_saturn.jpg"]);

  const matOpts = {
    map: map,
    //normalMap: normalMap,
  };

  const markerPosition = [0, 15.0, 0];

  useFrame((state, delta) => {
    const { clock, size } = state;

    meshRef.current.rotation.y += delta / 2;
    //markerRef.current.rotation.y += delta / 7;
    markerRef.current.position.y = 1;
    if (meshRef.current.geometry.boundingSphere?.radius) {
      markerRef.current.position.y =
        meshRef.current.position.y +
        meshRef.current.geometry.boundingSphere?.radius * scale +
        2.0;
    }
  });

  return (
    <>
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
          }}
        >
          <icosahedronGeometry args={[2, 11]} />
          <meshPhongMaterial
            //attach="material"
            args={[matOpts]}
            side={THREE.DoubleSide}
          ></meshPhongMaterial>
        </mesh>
        <mesh scale={scale * 1.01}>
          <icosahedronGeometry args={[2, 11]} />
          <shaderMaterial attach="material" {...JupiterFresnel} />
        </mesh>
        <group>
          <Rings />
        </group>
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
              onClick={() => {
                console.log("sdfsdfsdfsd");
              }}
            >
              Saturn
            </div>
            <FaMapMarkerAlt style={{ color: "blue" }} />
          </Marker>
        </group>
      </group>
    </>
  );
};

const Saturn = ({ camRef, position, rotation, scale }) => {
  return (
    <Planet
      camRef={camRef}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
};

export default Saturn;
