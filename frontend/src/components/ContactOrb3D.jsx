import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";

// A second, simpler abstract 3D object for the contact section — a
// dodecahedron catching the same warm rim light as the hero crystal, kept
// lightweight (single mesh, no particle field) since it sits lower on the page.
function Orb() {
  const mesh = useRef();
  useFrame((_, delta) => {
    if (mesh.current) {
      mesh.current.rotation.y += delta * 0.12;
      mesh.current.rotation.x += delta * 0.05;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.3} floatIntensity={0.6}>
      <mesh ref={mesh} scale={1.4}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshPhysicalMaterial
          color="#2a2a30"
          metalness={0.72}
          roughness={0.3}
          clearcoat={1}
          clearcoatRoughness={0.18}
          flatShading
        />
      </mesh>
    </Float>
  );
}

// A key light that drifts slowly so the highlight visibly moves across the
// orb's surface over time, echoing the hero object's treatment.
function DriftingKeyLight() {
  const light = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (light.current) {
      light.current.position.x = 4 + Math.sin(t * 0.18) * 1.2;
      light.current.position.y = 3 + Math.cos(t * 0.14) * 1;
      light.current.intensity = 6.5 + Math.sin(t * 0.5) * 1.4;
    }
  });
  return <spotLight ref={light} angle={0.4} penumbra={1} color="#e7c9a3" />;
}

export default function ContactOrb3D() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 4.5], fov: 40 }}
      gl={{ antialias: true, alpha: true, toneMappingExposure: 1.4 }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={1} />
        <DriftingKeyLight />
        <spotLight position={[-4, -2, 2]} angle={0.5} penumbra={1} intensity={4} color="#cfd3da" />
        <pointLight position={[0, 0, 3]} intensity={1.8} color="#ffffff" />
        <hemisphereLight args={["#ffffff", "#3a3a42", 0.7]} />
        <Orb />
      </Suspense>
    </Canvas>
  );
}
