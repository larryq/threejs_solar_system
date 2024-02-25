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
  const [map, alphaMap, map2] = useTexture([
    "2k_saturn_ring.png",
    "2k_saturn_ring.png",
    "saturn-rings-top.png",
  ]);
  const [ringTexture] = useTexture(["2k_saturn_ring.png"]);
  const texture1 = new THREE.TextureLoader().load(
    "https://i.postimg.cc/zz7Gr430/saturn-rings-topp.png"
  );
  return (
    <Ring
      args={[3, 25, 64]} // Inner radius, outer radius, segments
      position={[0, 0, 0]}
      rotation={[Math.PI / 4, 0, 0]} // Rotate the ring
      side={THREE.DoubleSide}
    >
      <shaderMaterial
        attach="material"
        fragmentShader={RingShader.fragmentShader}
        vertexShader={RingShader.vertexShader}
        uniforms={{
          texture1: { value: ringTexture },
          innerRadius: { value: 3 },
          outerRadius: { value: 25 },
        }}
        side={THREE.DoubleSide}
      />
    </Ring>
  );
};

export default Rings;
