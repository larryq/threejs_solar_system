import * as THREE from "three";
import { extend, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";

const fragmentShader=  `

uniform vec3 sunColor; // Base color of the sun
//uniform float noiseScale; // Scale of the noise
//uniform float noiseAmplitude; // Amplitude of the noise
uniform float time; // Time passed as a uniform
varying vec3 vertexPosition;

float perlin3(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);

    // Smoothstep interpolation
    vec3 u = f * f * (3.0 - 2.0 * f);
 
    // Gradient vectors (normalized)
    vec3 g000 = normalize(vec3(1.0, 1.0, 0.0));
    vec3 g100 = normalize(vec3(-1.0, 1.0, 0.0));
    vec3 g010 = normalize(vec3(1.0, -1.0, 0.0));
    vec3 g110 = normalize(vec3(-1.0, -1.0, 0.0));
    vec3 g001 = normalize(vec3(1.0, 0.0, 1.0));
    vec3 g101 = normalize(vec3(-1.0, 0.0, 1.0));
    vec3 g011 = normalize(vec3(1.0, 0.0, -1.0));
    vec3 g111 = normalize(vec3(-1.0, 0.0, -1.0));   

    // Compute dot products
    float n000 = dot(g000, f);
    float n100 = dot(g100, f - vec3(1.0, 0.0, 0.0));
    float n010 = dot(g010, f - vec3(0.0, 1.0, 0.0));
    float n110 = dot(g110, f - vec3(1.0, 1.0, 0.0));
    float n001 = dot(g001, f - vec3(0.0, 0.0, 1.0));
    float n101 = dot(g101, f - vec3(1.0, 0.0, 1.0));
    float n011 = dot(g011, f - vec3(0.0, 1.0, 1.0));
    float n111 = dot(g111, f - vec3(1.0, 1.0, 1.0));

    // Trilinear interpolation
    float n = mix(
        mix(mix(n000, n100, u.x), mix(n010, n110, u.x), u.y),
        mix(mix(n001, n101, u.x), mix(n011, n111, u.x), u.y),
        u.z
    );

    return n;
}

void main() {
  // Normalize position vector to get surface coordinates
  vec3 normal = normalize(vertexPosition);
  float noiseAmplitude = 0.2;
  float noiseScale = 0.3;

  // Calculate time-dependent offset based on noise scale and time
  vec3 noiseOffset = normal * noiseScale + vec3(time, time * 0.5, time * 0.25);

  // Calculate noise value based on position, offset, and scale
  float noiseValue = perlin3(noiseOffset) * noiseAmplitude;

  // Blend base color with noise value for a sun-like appearance
  vec3 finalColor = mix(sunColor, sunColor * (1.0 - noiseValue), noiseValue);


  // Apply lighting and other effects here if needed


  vec3 testColor=vec3(1.0, 0., 0.);
  gl_FragColor = vec4(finalColor, 1.0);
}

`

const vertexShader = `   

    varying vec3 vertexPosition;  

    void main() {
    vertexPosition = position;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
    }
`



const fragmentShader2 = `

//Based on : https://www.shadertoy.com/view/4sBfDw


/*
Zachary Shore
DPA8090: Rendering and Shading
HW2: Fractal Brownian Motion
*/

#define M_PI 3.14159265359

uniform float time;
uniform float height;
uniform float width;

//
// Description : Array and textureless GLSL 2D/3D/4D simplex 
//               noise functions.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : stegu
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//               https://github.com/stegu/webgl-noise

vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
    return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
    return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v)
{ 
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

    // First corner
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 =   v - i + dot(i, C.xxx) ;

    // Other corners
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );

    //   x0 = x0 - 0.0 + 0.0 * C.xxx;
    //   x1 = x0 - i1  + 1.0 * C.xxx;
    //   x2 = x0 - i2  + 2.0 * C.xxx;
    //   x3 = x0 - 1.0 + 3.0 * C.xxx;
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
    vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

    // Permutations
    i = mod289(i); 
    vec4 p = 
        permute
        (
            permute
            ( 
                permute
                (
                    i.z + vec4(0.0, i1.z, i2.z, 1.0)
                )
                + i.y + vec4(0.0, i1.y, i2.y, 1.0 )
            )
            + i.x + vec4(0.0, i1.x, i2.x, 1.0 )
        );

    // Gradients: 7x7 points over a square, mapped onto an octahedron.
    // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
    float n_ = 0.142857142857; // 1.0/7.0
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );

    //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
    //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);

    //Normalise gradients
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    // Mix final noise value
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
}

// p: position
// o: how many layers
// f: frequency
// lac: how fast frequency changes between layers
// r: how fast amplitude changes between layers
float fbm4(vec3 p, float theta, float f, float lac, float r)
{
    mat3 mtx = mat3(
        cos(theta), -sin(theta), 0.0,
        sin(theta), cos(theta), 0.0,
        0.0, 0.0, 1.0);

    float frequency = f;
    float lacunarity = lac;
    float roughness = r;
    float amp = 1.0;
    float total_amp = 0.0;

    float accum = 0.0;
    vec3 X = p * frequency;
    for(int i = 0; i < 4; i++)
    {
        accum += amp * snoise(X);
        X *= (lacunarity + (snoise(X) + 0.1) * 0.006);
        X = mtx * X;

        total_amp += amp;
        amp *= roughness;
    }

    return accum / total_amp;
}


float turbulence(float val)
{
    float n = 1.0 - abs(val);
    return n * n;
}

float pattern(in vec3 p, inout vec3 q, inout vec3 r)
{
    q.x = fbm4( p + 0.0, 0.0, 1.0, 2.0, 0.33 );
    q.y = fbm4( p + 6.0, 0.0, 1.0, 2.0, 0.33 );

    r.x = fbm4( p + q - 2.4, 2.0, 1.0, 2.0, 0.5 );
    r.y = fbm4( p + q + 8.2, 02.0, 1.0, 2.0, 0.5 );

    q.x = turbulence( q.x );
    q.y = turbulence( q.y );

    float f = fbm4( p + (1.0 * r), 0.0, 1.0, 2.0, 0.5);

    return f;
}

void main()
{
    vec2 st = gl_FragCoord.xy / vec2(width, height);
    float aspect = width / height;
    st.x *= aspect;

    vec2 uv = st;

    float t = time * 0.1;

    vec3 spectrum[4];
    spectrum[0] = vec3(1.00, 1.00, 0.00);
    spectrum[1] = vec3(0.50, 0.00, 0.00);
    spectrum[2] = vec3(1.00, 0.40, 0.20);
    spectrum[3] = vec3(1.00, 0.60, 0.00);

    uv -= 0.5;
    //uv-=10.*iMouse.xy/ vec2(width, height);
    uv *= 30.;

    vec3 p = vec3(uv.x, uv.y, t);
    vec3 q = vec3(0.0);
    vec3 r = vec3(0.0);
	vec3 brigth_q = vec3(0.0);
    vec3 brigth_r = vec3(0.0);
	vec3 black_q = vec3(0.0);
    vec3 black_r = vec3(0.0);
	vec3 p2=vec3(p.xy*0.02,p.z*0.1);
    
    float black= pattern(p2 ,black_q ,black_r );
    black = smoothstep(0.9,0.1,length(black_q*black));
           
    float brigth= pattern( p2*2.,brigth_q ,brigth_r );
    brigth = smoothstep(0.0,0.8,brigth*length(brigth_q));

    p+=min(length(brigth_q) ,length(black_q)  )*5.;

    float f = pattern(p, q, r);

    vec3 color = vec3(0.0);
    color = mix(spectrum[1], spectrum[3], pow(length(q), 2.0));
    color = mix(color, spectrum[3], pow(length(r), 1.4));

    color = pow(color, vec3(2.0));

    gl_FragColor =vec4( pow(black,2.)*(color +  spectrum[2]*brigth*5.), 1.0);

}

`

const fragmentShader3 = `
// Based on Shanes' Fiery Spikeball https://www.shadertoy.com/view/4lBXzy (I think that his implementation is more understandable than the original :) ) 
// Relief come from Siggraph workshop by Beautypi/2015 https://www.shadertoy.com/view/MtsSRf
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0

//#define ULTRAVIOLET
#define DITHERING

#define pi 3.14159265
#define R(p, a) p=cos(a)*p+sin(a)*vec2(p.y, -p.x)

// IQ's noise
float pn( in vec3 p )
{
    vec3 ip = floor(p);
    p = fract(p);
    p *= p*(3.0-2.0*p);
    vec2 uv = (ip.xy+vec2(37.0,17.0)*ip.z) + p.xy;
    uv = textureLod( iChannel0, (uv+ 0.5)/256.0, 0.0 ).yx;
    return mix( uv.x, uv.y, p.z );
}

// FBM
float fpn(vec3 p) {
    return pn(p*.06125)*.57 + pn(p*.125)*.28 + pn(p*.25)*.15;
}

float rand(vec2 co){// implementation found at: lumina.sourceforge.net/Tutorials/Noise.html
	return fract(sin(dot(co*0.123,vec2(12.9898,78.233))) * 43758.5453);
}

float cosNoise( in vec2 p )
{
    return 0.5*( sin(p.x) + sin(p.y) );
}

const mat2 m2 = mat2(1.6,-1.2,
                     1.2, 1.6);

float sdTorus( vec3 p, vec2 t )
{
  return length( vec2(length(p.xz)-t.x*1.2,p.y) )-t.y;
}

float smin( float a, float b, float k )
{
	float h = clamp( 0.5 + 0.5*(b-a)/k, 0.0, 1.0 );
	return mix( b, a, h ) - k*h*(1.0-h);
}

float SunSurface( in vec3 pos )
{
    float h = 0.0;
    vec2 q = pos.xz*0.5;
    
    float s = 0.5;
    
    float d2 = 0.0;
    
    for( int i=0; i<6; i++ )
    {
        h += s*cosNoise( q ); 
        q = m2*q*0.85; 
        q += vec2(2.41,8.13);
        s *= 0.48 + 0.2*h;
    }
    h *= 2.0;
    
    float d1 = pos.y - h;
   
    // rings
    vec3 r1 = mod(2.3+pos+1.0,10.0)-5.0;
    r1.y = pos.y-0.1 - 0.7*h + 0.5*sin( 3.0*iTime+pos.x + 3.0*pos.z);
    float c = cos(pos.x); float s1 = 1.0;//sin(pos.x);
    r1.xz=c*r1.xz+s1*vec2(r1.z, -r1.x);
    d2 = sdTorus( r1.xzy, vec2(clamp(abs(pos.x/pos.z),0.7,2.5), 0.20) );

    
    return smin( d1, d2, 1.0 );
}

float map(vec3 p) {
   p.z += 1.;
   R(p.yz, -25.5);// -1.0+0.003);
   //R(p.xz, 1.0*0.008*pi+iTime*0.1);
   return SunSurface(p) +  fpn(p*50.+iTime*25.) * 0.45;
}

// See "Combustible Voronoi"
// https://www.shadertoy.com/view/4tlSzl
vec3 firePalette(float i){

    float T = 1400. + 1300.*i; // Temperature range (in Kelvin).
    vec3 L = vec3(7.4, 5.6, 4.4); // Red, green, blue wavelengths (in hundreds of nanometers).
    L = pow(L,vec3(5.0)) * (exp(1.43876719683e5/(T*L))-1.0);
    return 1.0-exp(-5e8/L); // Exposure level. Set to "50." For "70," change the "5" to a "7," etc.
}


void main()
{  
   // p: position on the ray
   // rd: direction of the ray
   vec3 rd = normalize(vec3((gl_FragCoord.xy-0.5*vec2(1280.,720.))/720., 1.));
   vec3 ro = vec3(0., 0., -22.);
   
   // ld, td: local, total density 
   // w: weighting factor
   float ld=0., td=0., w=0.;

   // t: length of the ray
   // d: distance function
   float d=1., t=1.;
   
   // Distance threshold.
   const float h = .1;
    
   // total color
   vec3 tc = vec3(0.);
   
   #ifdef DITHERING
   vec2 pos = ( gl_FragCoord.xy / vec2(1280.0,720.));
   vec2 seed = pos + fract(iTime);
   //t=(1.+0.2*rand(seed));
   #endif
    
   // rm loop
   for (int i=0; i<56; i++) {

      // Loop break conditions. Seems to work, but let me
      // know if I've overlooked something.
      if(td>(1.-1./80.) || d<0.001*t || t>40.)break;
       
      // evaluate distance function
      d = map(ro+t*rd); 
       
      // fix some holes deep inside
      //d=max(d,-.3);
      
      // check whether we are close enough (step)
      // compute local density and weighting factor 
      //const float h = .1;
      ld = (h - d) * step(d, h);
      w = (1. - td) * ld;   
     
      // accumulate color and density
      tc += w*w + 1./50.;  // Different weight distribution.
      td += w + 1./200.;

	  // dithering implementation come from Eiffies' https://www.shadertoy.com/view/MsBGRh
      #ifdef DITHERING  
      #ifdef ULTRAVIOLET
      // enforce minimum stepsize
      d = max(d, 0.04);
      // add in noise to reduce banding and create fuzz
      d=abs(d)*(1.+0.28*rand(seed*vec2(i)));
      #else
      // add in noise to reduce banding and create fuzz
      d=abs(d)*(.8+0.28*rand(seed*vec2(i)));
      // enforce minimum stepsize
      d = max(d, 0.04);
      #endif 
      #else
      // enforce minimum stepsize
      d = max(d, 0.04);        
      #endif

      // step forward
      t += d*0.5;
      
   }

   // Fire palette.
   tc = firePalette(tc.x);
   
   #ifdef ULTRAVIOLET
   tc *= 1. / exp( ld * 2.82 ) * 1.05;
   #endif
    
   gl_FragColor = vec4(tc, 1.0);
}

`



const SunShader = {
    uniforms : {
        sunColor:  { value: new THREE.Color(0xfff00)}, 
        sunIntensity: {value: 1.0},
        noiseTexture: {value: new THREE.Texture()},
        time: {value : 0.0},
        uColorStart:  {value: new THREE.Color("#ffffff")},
        uColorEnd:  {value: new THREE.Color("#000000")},
        noiseScale:  {value: 2.0},
        noiseAmplitude:  {value: 3.0},
    
    },
      fragmentShader: fragmentShader,
      vertexShader,
      //transparent: true,
      //blending: THREE.AdditiveBlending,

}


/* const vertexShaderCode = `
  void main() {
    // Your vertex shader code here
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShaderCode = `
  uniform float time;

  void main() {
    // Your fragment shader code here
    gl_FragColor = vec4(1.0, 0.0, sin(time * 5.0) + 0.5, 1.0);
  }
`;

const MyCustomShader = ({ camRef, position, rotation, scale }) => {
    const materialRef = useRef();
    const [time, setTime] = useState(0);
  
    useFrame((state) => {
      // Update the time value
      //setTime(state.clock.elapsedTime);
      materialRef.current.uniforms.time.value = state.clock.elapsedTime;
    });
  
    return (
      <mesh position={position} rotation={rotation} scale={scale}>
        <boxGeometry args={[1, 1, 1]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShaderCode}
          fragmentShader={fragmentShaderCode}
          uniforms={{
            time: { value: 0.0 }, // Pass the updated time value
          }}
        />
      </mesh>
    );
  };
 */


export default SunShader
//export default MyCustomShader