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
  const cloudRef = useRef();
  const markerRef = useRef();

  const markerPosition = [0, 5.0, 0];

  const [map, normalMap, cloudMap, cloudTransMap] = useTexture([
    "8k_venus_surface.jpg",
    "venus_normal_map_8k.png",
    "04_earthcloudmap.jpg",
    "05_earthcloudmaptrans.jpg",
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const htmlRef = useRef();

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
      <mesh scale={scale} ref={meshRef} onClick={() => {}}>
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
            onClick={handleClick}
          >
            Venus
          </div>
          <FaMapMarkerAlt style={{ color: "grey" }} />
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
                Venus
              </h2>
              {/* Regular text */}
              <p style={{ fontSize: "16px", lineHeight: "1.5" }}>
                Distance to Earth: 139 million miles <br />
                It rains sulfuric acid
                <br />
                Hottest planet in the solar system
                <br />
              </p>
              {/* Footnote */}
              <div style={{ fontSize: "12px", color: "#ccc" }}>
                Click the "Venus" marker above to close this dialog
              </div>
            </div>
          </Html>
        )}
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
