import { Stars } from "@react-three/drei";

export default function Starz() {
  return (
    <Stars
      radius={10}
      depth={50}
      count={5000}
      factor={4}
      saturation={0}
      fade
      speed={1}
    />
  );
}
