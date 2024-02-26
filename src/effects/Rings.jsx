import * as THREE from "three";
import {
  OrbitControls,
  Stage,
  CameraControls,
  Ring,
  Environment,
  useTexture,
} from "@react-three/drei";

import RingShader from "./RingShader";

const Rings = ({ camRef, position, rotation, scale, color, numRings }) => {
  const [ringTexture] = useTexture(["2k_saturn_ring.png"]);

  return (
    <Ring
      args={[9, 16, 7200]} // Inner radius, outer radius, segments
      rotation={[Math.PI / 4, 0, 0]} // Rotate the ring
      side={THREE.DoubleSide}
    >
      <shaderMaterial
        attach="material"
        fragmentShader={RingShader.fragmentShader}
        vertexShader={RingShader.vertexShader}
        uniforms={{
          texture1: { value: ringTexture },
          innerRadius: { value: 1 },
          outerRadius: { value: 80 },
        }}
        side={THREE.DoubleSide}
        args={[
          {
            opacity: 0.55,
            transparent: false,
            blending: THREE.MultiplyBlending,
          },
        ]}
      />
    </Ring>
  );
};

export default Rings;
