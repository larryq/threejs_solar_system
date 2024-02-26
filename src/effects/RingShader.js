import * as THREE from "three";
import { extend, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";

const texture1 = new THREE.TextureLoader().load(
    "2k_saturn_ring.png"
  );

const vertexShader = `
uniform float innerRadius;
uniform float outerRadius;

varying vec3 localPosition;

void main() {
  localPosition = position;
  vec3 viewPosition = (modelViewMatrix * vec4(localPosition, 1.)).xyz;
  gl_Position = projectionMatrix * vec4(viewPosition, 1.);
}
`
const fragmentShader = `
uniform sampler2D texture1;
uniform float innerRadius;
uniform float outerRadius;

varying vec3 localPosition;

vec4 color() {
    float outer = 1.5;
    float inner = 1.;
  vec2 uv;
  uv.x = (length(localPosition) - innerRadius) / (outerRadius - innerRadius);
  if (uv.x < 0.0 || uv.x > 1.0) {
    discard;
  }
  
  vec4 pixel = texture(texture1, uv);
  return pixel;
}

void main() {
    vec4 testColor = vec4(color().xyz, 0.8);
  gl_FragColor = color();
}
`


const RingShader = {
    
    uniforms: {
            texture1: { value: 0 },
            innerRadius: { value: 0 },
            outerRadius: { value: 0 }
        },
      fragmentShader,
      vertexShader,
      transparent: true,
      //blending: THREE.AdditiveBlending,

}



export default RingShader
