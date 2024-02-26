import { useFrame, extend } from "@react-three/fiber";
import { LayerMaterial, Depth, Fresnel } from "lamina";
import { useMemo, useRef, useState } from "react";
import FresnelMaterial from "./effects/Fresnel";
import Marker from "./effects/Marker";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useTexture, Html } from "@react-three/drei";

import SwirlEffect from "./SwirlEffect";

extend({ SwirlEffect });

const Planet = ({ camRef, position, rotation, scale }) => {
  const materialRef = useRef();
  const meshRef = useRef();
  const groupRef = useRef();
  const markerRef = useRef();
  const markerPosition = [0, 15.0, 0];
  const [isOpen, setIsOpen] = useState(false);
  const htmlRef = useRef();

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

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

    if (isOpen) {
      // Update the position of the Html element (optional)
      htmlRef.current.position = [0, 1, 0]; // Example position adjustment
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
        <Marker scale={1} rotation={rotation} onClick={handleClick}>
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
            Uranus
          </div>
          <FaMapMarkerAlt style={{ color: "brown" }} />
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
                Uranus
              </h2>
              {/* Regular text */}
              <p style={{ fontSize: "16px", lineHeight: "1.5" }}>
                Distance to Earth: 1.8 billion miles <br />
                Made up of Hydrogen, Helium and water
                <br />
                A gas giant
                <br />
              </p>
              {/* Footnote */}
              <div style={{ fontSize: "12px", color: "#ccc" }}>
                Click the "Uranus" marker above to close this dialog
              </div>
            </div>
          </Html>
        )}
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
