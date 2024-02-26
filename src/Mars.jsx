import * as THREE from "three";
import { useFrame, extend } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import { useTexture, Html } from "@react-three/drei";
import MarsFresnel from "./effects/MarsFresnel";
import Marker from "./effects/Marker";
import { FaMapMarkerAlt } from "react-icons/fa";

const Planet = ({ camRef, position, rotation, scale }) => {
  const materialRef = useRef();
  const meshRef = useRef();
  const groupRef = useRef();
  const markerRef = useRef();
  const markerPosition = [0, 4.0, 0];

  const [map, normalMap] = useTexture(["8k_mars.jpg", "Mars-normalmap_2k.png"]);
  const [isOpen, setIsOpen] = useState(false);
  const htmlRef = useRef();

  const matOpts = {
    map: map,
    normalMap: normalMap,
  };

  useFrame((state, delta) => {
    const { clock, size } = state;

    meshRef.current.rotation.y += delta / 10;
    if (isOpen) {
      // Update the position of the Html element (optional)
      htmlRef.current.position = [0, 1, 0]; // Example position adjustment
    }
  });

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      <mesh scale={scale} ref={meshRef}>
        <icosahedronGeometry args={[2, 11]} />
        <meshPhongMaterial
          //attach="material"
          args={[matOpts]}
          side={THREE.DoubleSide}
        ></meshPhongMaterial>
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
            onClick={handleClick}
          >
            Mars
          </div>
          <FaMapMarkerAlt style={{ color: "lightblue" }} />
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
                Mars
              </h2>
              {/* Regular text */}
              <p style={{ fontSize: "16px", lineHeight: "1.5" }}>
                Distance to Earth: 140 million miles <br />
                Covered in Iron Oxide dust
                <br />
                The Red Planet
                <br />
              </p>
              {/* Footnote */}
              <div style={{ fontSize: "12px", color: "#ccc" }}>
                Click the "Mars" marker above to close this dialog
              </div>
            </div>
          </Html>
        )}
      </group>
    </group>
  );
};

const Mars = ({ camRef, position, rotation, scale }) => {
  return (
    <Planet
      camRef={camRef}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
};

export default Mars;
