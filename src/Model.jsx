import React from "react";
import { Sphere, useTexture } from "@react-three/drei";

const Model = () => {
  const [map, displacementMap, normalMap, roughnessMap] = useTexture([
    "2k_earth_daymap.jpg", //"2_no_clouds_8k.jpg", //"Marble006_1K_Color.jpg",
    "2k_earth_normal_map.jpg", //Marble006_1K_Displacement.jpg",
    "2k_earth_normal_map.jpg", //"Marble006_1K_Normal.jpg",
    "Marble006_1K_Roughness.jpg",
  ]);
  return (
    <>
      <Sphere args={[1, 200, 200]} positionY={2}>
        <meshPhysicalMaterial
          // aoMap={aoMap}
          map={map}
          displacementMap={displacementMap}
          //normalMap={normalMap}
          roughnessMap={roughnessMap}
          displacementScale={0.001}
        />
      </Sphere>
    </>
  );
};

export default Model;
