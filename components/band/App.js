'use client';
import './index.css';
import * as THREE from 'three';
import { useEffect, useRef, useState } from 'react';
import { Canvas, extend, useThree, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei/core/Gltf.js';
import { useTexture } from '@react-three/drei/core/Texture.js';
import { Environment } from '@react-three/drei/core/Environment.js';
import { Lightformer } from '@react-three/drei/core/Lightformer.js';
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';

extend({ MeshLineGeometry, MeshLineMaterial });

const GLTF_PATH = '/assets/kartu.glb';
const TEXTURE_PATH = '/assets/band_tegar_v3.png';
const CARD_TEXTURE_PATH = '/assets/card_custom.png';

useGLTF.preload(GLTF_PATH);
useTexture.preload(TEXTURE_PATH);
useTexture.preload(CARD_TEXTURE_PATH);

export default function App() {
  return (
    <div className="responsive-wrapper">
      <Canvas
        camera={{ position: [0, 0, 13], fov: 25 }}
        gl={{ alpha: true }}
        style={{ width: '100%', height: '100%' }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor(0x000000, 0);
          scene.background = null;
        }}
      >
        <ambientLight intensity={Math.PI} />
        <Physics interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
          <Band />
        </Physics>
        <Environment blur={0.75}>
          <Lightformer intensity={2} color="#55B8FF" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="#1677FF" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={10} color="#1264b2" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
        </Environment>
      </Canvas>
    </div>
  );
}

function Band({ maxSpeed = 50, minSpeed = 10 }) {
  const band = useRef(), fixed = useRef(), j1 = useRef(), j2 = useRef(), j3 = useRef(), card = useRef(); // prettier-ignore
  const vec = new THREE.Vector3(), ang = new THREE.Vector3(), rot = new THREE.Vector3(), dir = new THREE.Vector3(); // prettier-ignore
  const segmentProps = { type: 'dynamic', canSleep: true, colliders: false, angularDamping: 4, linearDamping: 4 };
  const { nodes, materials } = useGLTF(GLTF_PATH);
  const texture = useTexture(TEXTURE_PATH);
  const cardTexture = useTexture(CARD_TEXTURE_PATH);

  if (cardTexture && cardTexture.flipY) {
    cardTexture.flipY = false;
    cardTexture.needsUpdate = true;
  }

  const { width, height } = useThree((state) => state.size);
  const isMobile = width < 768;

  // Posisi anchor (titik gantung) di dunia 3D
  const groupX = isMobile ? 0 : 1.75;
  const groupY = 4; // Selalu di atas viewport (y_max ~2.9), band terlihat dari "langit-langit"

  const [curve] = useState(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3(),
  ]));
  const [dragged, drag] = useState(false);
  const [hovered, hover] = useState(false);

  // Rope joints — menghubungkan setiap segmen tali, panjang 1 unit
  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]); // prettier-ignore
  useRopeJoint(j1,   j2, [[0, 0, 0], [0, 0, 0], 1]); // prettier-ignore
  useRopeJoint(j2,   j3, [[0, 0, 0], [0, 0, 0], 1]); // prettier-ignore
  // Spherical joint: ujung tali (j3) → titik atas kartu [0, 1.45, 0]
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]]); // prettier-ignore

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => void (document.body.style.cursor = 'auto');
    }
  }, [hovered, dragged]);

  // Efek animasi mantul dari atas ke bawah saat web terbuka / masuk beranda
  useEffect(() => {
    const isFirstLoad = typeof window !== 'undefined' && !sessionStorage.getItem('loaded');
    const delay = isFirstLoad ? 1600 : 400;

    const timer1 = setTimeout(() => {
      if (card.current) {
        [card, j1, j2, j3].forEach((ref) => ref.current?.wakeUp());
        // Tarikan ke bawah dan dorongan 3D agar kartu memantul naik-turun secara interaktif
        card.current.applyImpulse({ x: 0.6, y: -24, z: 4.5 }, true);
        card.current.applyTorqueImpulse({ x: 0.2, y: 1.1, z: 0.3 }, true);
      }
    }, delay);

    // Pantulan susulan agar getaran elastis lebih terasa hidup
    const timer2 = setTimeout(() => {
      if (card.current) {
        card.current.applyImpulse({ x: -0.3, y: 14, z: -2 }, true);
      }
    }, delay + 420);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z });
    }
    if (fixed.current) {
      // Lerp j1 & j2 untuk render tali yang halus
      [j1, j2].forEach((ref) => {
        if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())));
        ref.current.lerped.lerp(ref.current.translation(), delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)));
      });
      // Kurva tali: dari j3 (bawah) → fixed (atas)
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());
      band.current.geometry.setPoints(curve.getPoints(32));
      // Stabilisasi rotasi kartu (mencegah berputar terus)
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
    }
  });

  curve.curveType = 'chordal';
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  return (
    <>
      {/*
        SEMUA elemen (fixed, j1, j2, j3, card) dalam SATU group di titik yang sama.
        Posisi awal VERTIKAL (hanging down) = posisi kesetimbangan alami.
        Ini mencegah band terlihat horizontal / tidak sinkron pada frame pertama.

        Layout vertikal:
          fixed  → (0,  0, 0) = groupY=4  → titik gantung di langit-langit
          j1     → (0, -1, 0) = groupY=3  → 1 unit di bawah fixed
          j2     → (0, -2, 0) = groupY=2  → 1 unit di bawah j1
          j3     → (0, -3, 0) = groupY=1  → 1 unit di bawah j2 (ujung tali)
          card   → (0, -4.45,0)= groupY≈-0.45 → kartu: j3 menyambung ke card-top [0,1.45,0]
                                              card-top = -4.45+1.45 = -3 ≡ j3 ✓
      */}
      <group position={[groupX, groupY, 0]}>
        {/* Titik gantung tetap — tidak bergerak */}
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />

        {/* Segmen tali 1 */}
        <RigidBody position={[0, -1, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>

        {/* Segmen tali 2 */}
        <RigidBody position={[0, -2, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>

        {/* Segmen tali 3 — ujung bawah tali, terhubung ke kartu */}
        <RigidBody position={[0, -3, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>

        {/* ID Card — menggantung di bawah ujung tali */}
        <RigidBody
          position={[0, -4.45, 0]}
          ref={card}
          {...segmentProps}
          linearDamping={2.2}
          angularDamping={2.5}
          type={dragged ? 'kinematicPosition' : 'dynamic'}
        >
          <CuboidCollider args={[0.66, 1.18, 0.01]} />
          <group
            scale={2.35}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => (e.target.releasePointerCapture(e.pointerId), drag(false))}
            onPointerDown={(e) => (e.target.setPointerCapture(e.pointerId), drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation()))))}
          >
            <mesh geometry={nodes.card.geometry} scale={[0.8206, 1, 1]}>
              <meshPhysicalMaterial map={cardTexture} map-anisotropy={16} clearcoat={1} clearcoatRoughness={0.15} roughness={0.3} metalness={0.5} />
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>

      {/* Tali/band sebagai MeshLine — mengikuti kurva physics */}
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={[width, height]}
          useMap
          map={texture}
          repeat={[-4, 1]}
          lineWidth={1}
        />
      </mesh>
    </>
  );
}