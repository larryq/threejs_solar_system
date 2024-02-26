import * as THREE from "three";
import { useFrame, extend } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import { useTexture, Html } from "@react-three/drei";
import JupiterFresnel from "./effects/JupiterFresnel";
import Marker from "./effects/Marker";
import { FaMapMarkerAlt } from "react-icons/fa";
import Rings from "./effects/Rings";

const Planet = ({ camRef, position, rotation, scale }) => {
  const materialRef = useRef();
  const meshRef = useRef();
  const groupRef = useRef();
  const markerRef = useRef();
  const htmlRef = useRef();

  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

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
    if (isOpen) {
      // Update the position of the Html element (optional)
      htmlRef.current.position = [0, 1, 0]; // Example position adjustment
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
              onClick={handleClick}
            >
              Saturn
            </div>
            <FaMapMarkerAlt style={{ color: "blue" }} />
          </Marker>
          {isOpen && (
            <Html ref={htmlRef}>
              <div
                onClick={handleClick}
                style={{
                  // Full screen dimensions (adjust as needed)
                  width: "30vw",
                  height: "30vh",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  // Transparent background with slight opacity
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                  // Center the text content
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  // Nice font and text styling
                  fontSize: "24px",
                  fontFamily: "Arial, sans-serif",
                  color: "#fff",
                  // Add a border for better visibility
                  border: "2px solid #fff",
                  borderRadius: "5px",
                  // Optional padding for better text spacing
                  padding: "20px",
                }}
              >
                {/* Title */}
                <h2
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    marginBottom: "10px",
                  }}
                >
                  Saturn
                </h2>
                {/* Regular text */}
                <p style={{ fontSize: "16px", lineHeight: "1.5" }}>
                  Distance to Earth: 994 million miles <br />
                  Has 146 moons
                  <br />
                  A Gas Giant
                  <br />
                </p>
                {/* Footnote */}
                <div style={{ fontSize: "12px", color: "#ccc" }}>
                  Click the "Saturn" marker above to close this dialog
                </div>
              </div>
            </Html>
          )}
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
