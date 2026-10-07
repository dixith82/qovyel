import { Suspense, useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

// Builds an irregular, angular "rock" geometry by jittering an icosahedron's
// vertices with a seeded pseudo-random function, then re-computing flat
// normals — this gives the asymmetric, hand-cut-gem silhouette from the
// reference instead of a perfectly uniform polyhedron.
function useRockGeometry() {
  return useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1.35, 0);
    const pos = geo.attributes.position;
    let seed = 7;
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const jitter = 0.14;
      pos.setXYZ(
        i,
        x + (rand() - 0.5) * jitter,
        y + (rand() - 0.5) * jitter * 1.3,
        z + (rand() - 0.5) * jitter
      );
    }
    geo.computeVertexNormals();
    return geo;
  }, []);
}

function RockObject({ mouse }) {
  const group = useRef();
  const mesh = useRef();
  const geometry = useRockGeometry();

  useFrame((state, delta) => {
    if (mesh.current) {
      mesh.current.rotation.y += delta * 0.13;
      mesh.current.rotation.x += delta * 0.03;
    }
    if (group.current) {
      group.current.rotation.y += (mouse.current.x * 0.3 - group.current.rotation.y) * 0.03;
      group.current.rotation.x += (mouse.current.y * 0.18 - group.current.rotation.x) * 0.03;
    }
  });

  return (
    <group ref={group} position={[0, -0.1, 0]} scale={[1.2, 1.48, 1.15]}>
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.45}>
        {/* rim-glow shell: an emissive backside pass that reads as a bright
            edge highlight no matter how the scene lights fall, guaranteeing
            the silhouette pops the way the reference's glossy rock does */}
        <mesh geometry={geometry} scale={1.025}>
          <meshBasicMaterial
            color="#e9c48f"
            side={THREE.BackSide}
            transparent
            opacity={0.4}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        <mesh ref={mesh} geometry={geometry} castShadow>
          <meshPhysicalMaterial
            color="#3c3c44"
            metalness={0.65}
            roughness={0.28}
            clearcoat={1}
            clearcoatRoughness={0.12}
            flatShading
          />
        </mesh>
        {/* the ring "aperture" cut into the rock, echoing the reference */}
        <mesh position={[0.55, -0.35, 0.55]} rotation={[0.4, 0.6, 0]}>
          <torusGeometry args={[0.42, 0.1, 32, 64]} />
          <meshPhysicalMaterial color="#0a0a0c" metalness={0.6} roughness={0.35} clearcoat={0.6} />
        </mesh>
        {/* bright curved highlight streak, echoing the reference's crescent
            glint — a thin partial-arc torus with a lighting-independent
            emissive material so it always reads as a sharp specular line */}
        <mesh position={[0.2, 0.15, 0.9]} rotation={[0.3, -0.4, 0.9]}>
          <torusGeometry args={[0.95, 0.012, 8, 48, Math.PI * 0.55]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.85} />
        </mesh>
      </Float>
    </group>
  );
}

function Particles({ speed = 0.02, count = 180, size = 0.018, opacity = 0.45, spread = 10 }) {
  const points = useRef();
  const positions = useState(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * spread;
      arr[i * 3 + 1] = (Math.random() - 0.5) * spread;
      arr[i * 3 + 2] = (Math.random() - 0.5) * (spread * 0.6);
    }
    return arr;
  })[0];

  useFrame((_, delta) => {
    if (points.current) points.current.rotation.y += delta * speed;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={size} color="#ffffff" transparent opacity={opacity} />
    </points>
  );
}

// A key light that drifts slowly around the object on an elliptical path
// and breathes in intensity, so the rim highlight actually moves and
// flickers subtly over time rather than sitting in one fixed position —
// like a camera light source slowly passing the object.
function DriftingKeyLight() {
  const light = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (light.current) {
      light.current.position.x = 4 + Math.sin(t * 0.15) * 1.4;
      light.current.position.y = 5 + Math.cos(t * 0.12) * 1.1;
      light.current.intensity = 8 + Math.sin(t * 0.4) * 1.6;
    }
  });
  return <spotLight ref={light} angle={0.45} penumbra={0.8} color="#f0d9b8" />;
}

export default function Hero3D() {
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 4.6], fov: 42 }}
      gl={{ antialias: true, alpha: true, toneMappingExposure: 1.3 }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        {/* slow-drifting warm key/rim light, matching the reference's glint */}
        <DriftingKeyLight />
        <spotLight position={[-4, -2, 3]} angle={0.5} penumbra={1} intensity={3} color="#9aa0ac" />
        <pointLight position={[2, 1, 4]} intensity={2} color="#ffffff" />
        <hemisphereLight args={["#ffffff", "#26262c", 0.6]} />
        <RockObject mouse={mouse} />
        {/* two depth layers drifting at different speeds for parallax */}
        <Particles speed={0.015} count={130} size={0.016} opacity={0.35} spread={12} />
        <Particles speed={0.045} count={60} size={0.022} opacity={0.55} spread={6} />
      </Suspense>
    </Canvas>
  );
}
