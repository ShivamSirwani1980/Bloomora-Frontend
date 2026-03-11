import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense, useMemo } from "react";
import * as THREE from "three";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────
interface FlowerType {
  type: string;
  color: string;
  quantity: number;
  price: number;
}

interface Props {
  selectedFlowers: FlowerType[];
  wrapStyle?: string;
}

interface PlacedFlower {
  type: string;
  color: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
}

// ─────────────────────────────────────────────────────────────
// WRAP COLOURS
// ─────────────────────────────────────────────────────────────
const WRAP_CONFIG: Record<
  string,
  { primary: string; mid: string; dark: string; ribbon: string }
> = {
  "Classic White":  { primary: "#f4f0ec", mid: "#e0dbd4", dark: "#c8c0b8", ribbon: "#a09088" },
  "Kraft Paper":    { primary: "#d4a96a", mid: "#b88840", dark: "#8c6020", ribbon: "#5c3c10" },
  "Blush Pink":     { primary: "#f2ccd8", mid: "#d8a0b4", dark: "#b87890", ribbon: "#9c5070" },
  "Sage Green":     { primary: "#b8d4b0", mid: "#8caa84", dark: "#608058", ribbon: "#3c5830" },
  "Midnight Black": { primary: "#484848", mid: "#303030", dark: "#181818", ribbon: "#888888" },
  "Lavender":       { primary: "#d8c8f4", mid: "#b0a0cc", dark: "#8878a8", ribbon: "#605880" },
  default:          { primary: "#f2ccd8", mid: "#d8a0b4", dark: "#b87890", ribbon: "#9c5070" },
};

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────

// Each flower head is rendered at this world-unit diameter
const FLOWER_TARGET = 0.36;

// All flower heads sit at this fixed Y — same level, flat
const FLOWER_Y = 0.72;

// Wrapper fixed dimensions — never change with flower count
const W_TOP_R = 0.40;   // top opening radius
const W_MID_R = 0.28;   // waist radius (vase pinch)
const W_BOT_R = 0.20;   // base radius (stable, not a sharp tip)
const W_H     = 0.65;   // total wrapper height
const W_RIM_Y = 0.68;   // world-Y of the wrapper top rim

// The usable radius inside the wrapper opening.
// Every flower centre must stay within this circle.
// = opening radius minus half a flower so petals don't cross the rim.
const INNER_R = W_TOP_R - FLOWER_TARGET * 0.55; // ~0.20

// ─────────────────────────────────────────────────────────────
// GLB NORMALISER
// Bakes all transforms, recolours, scales to FLOWER_TARGET.
// Fixes mismatched pivot points across different GLB files.
// ─────────────────────────────────────────────────────────────
function normalizeGLB(scene: THREE.Object3D, color: string): THREE.Group {
  const clone = scene.clone(true);
  clone.updateMatrixWorld(true);

  const flat = new THREE.Group();
  clone.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh || !mesh.geometry) return;
    const geo = mesh.geometry.clone();
    geo.applyMatrix4(mesh.matrixWorld);
    const rawMat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
    const mat = (rawMat as THREE.MeshStandardMaterial).clone();
    try { mat.color.set(color); } catch (_) {}
    mat.roughness = 0.45;
    mat.metalness = 0.0;
    flat.add(new THREE.Mesh(geo, mat));
  });

  const box    = new THREE.Box3().setFromObject(flat);
  const size   = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  if (maxDim === 0) return flat;

  const tx = new THREE.Matrix4().makeTranslation(-center.x, -box.min.y, -center.z);
  flat.children.forEach((c) => (c as THREE.Mesh).geometry.applyMatrix4(tx));
  flat.scale.setScalar(FLOWER_TARGET / maxDim);
  return flat;
}

// ─────────────────────────────────────────────────────────────
// CONSTRAINED PHYLLOTAXIS PLACEMENT
//
// Generates a golden-angle sunflower spiral then RESCALES the
// entire result so the outermost point always equals INNER_R.
// This is a hard mathematical guarantee: no flower can ever
// escape the wrapper opening regardless of how many are added.
//
// Steps:
//   1. Compute raw spiral with unscaled radii (sqrt(i))
//   2. Find the largest raw radius across all flowers
//   3. scaleFactor = INNER_R / maxRawRadius
//   4. Multiply every position by scaleFactor
//   => outermost flower always lands exactly at INNER_R
//   => all other flowers land proportionally inside
// ─────────────────────────────────────────────────────────────
const GOLDEN_ANGLE = 2.399963; // 137.508 degrees in radians

function computeConstrainedPlacements(
  flowers: { type: string; color: string }[]
): PlacedFlower[] {
  const total = flowers.length;
  if (total === 0) return [];

  // Step 1 — raw spiral (radius = sqrt(i), unscaled)
  const raw: Array<{ x: number; z: number; theta: number }> = [];
  for (let i = 0; i < total; i++) {
    const theta = i * GOLDEN_ANGLE;
    const r     = i === 0 ? 0 : Math.sqrt(i);
    raw.push({ x: r * Math.cos(theta), z: r * Math.sin(theta), theta });
  }

  // Step 2 — find largest raw radius
  const maxRaw = raw.reduce(
    (m, p) => Math.max(m, Math.sqrt(p.x * p.x + p.z * p.z)),
    0
  );

  // Step 3 — scale so outermost flower sits exactly at INNER_R
  // If only 1 flower (maxRaw = 0) it stays at centre
  const sf = maxRaw > 0 ? INNER_R / maxRaw : 0;

  const placements: PlacedFlower[] = [];

  for (let i = 0; i < total; i++) {
    const { x: rx, z: rz } = raw[i];

    // Step 4 — apply scale, slight z-compression for 3/4 camera view
    const x = rx * sf;
    const z = rz * sf * 0.75;

    // Normalised distance from centre (0 = centre, 1 = rim)
    const dist  = Math.sqrt(x * x + z * z);
    const normR = INNER_R > 0 ? Math.min(dist / INNER_R, 1) : 0;

    // Edge flowers fractionally smaller — subtle depth cue
    const scale = 1.0 - normR * 0.10;

    // Gentle deterministic Y rotation for natural variety
    const rotY = ((i * 61) % 360) * (Math.PI / 180) * 0.16;

    placements.push({
      type:     flowers[i].type,
      color:    flowers[i].color,
      position: [x, FLOWER_Y, z],
      rotation: [0, rotY, 0],
      scale,
    });
  }

  // Back-to-front so front flowers paint over rear ones
  placements.sort((a, b) => b.position[2] - a.position[2]);
  return placements;
}

// ─────────────────────────────────────────────────────────────
// BOUQUET WRAPPER
// Vase shape: wide rim, pinched waist, rounded base.
// Material: MeshPhysicalMaterial with transmission so it looks
// like translucent wrapping paper, not solid plastic.
// ─────────────────────────────────────────────────────────────
function BouquetWrapper({ wrapStyle }: { wrapStyle: string }) {
  const cfg    = WRAP_CONFIG[wrapStyle] ?? WRAP_CONFIG.default;
  const groupY = W_RIM_Y - W_H / 2;
  const halfH  = W_H / 2;

  // Split into top (flared) and bottom (tapered) halves
  const topH = W_H * 0.42;
  const botH = W_H * 0.58;
  const topY =  halfH - topH / 2;
  const botY = -halfH + botH / 2;

  // Ribbon sits at the waist — junction of top and bottom halves
  const cinchLocalY = halfH - topH;
  const cinchR      = W_MID_R + 0.009;

  // Paper material props — used on every wrapper surface
  const paper = (color: string, opacity = 0.88, transmission = 0.26) => ({
    color,
    roughness:    0.82,
    metalness:    0.0,
    transmission,
    thickness:    0.08,
    transparent:  true,
    opacity,
    side:         THREE.DoubleSide,
    depthWrite:   false,
  });

  return (
    <group position={[0, groupY, 0]}>

      {/* Bottom half — shadow layer */}
      <mesh position={[0, botY - 0.008, -0.009]}>
        <cylinderGeometry args={[W_MID_R * 1.05, W_BOT_R * 1.08, botH * 1.02, 48, 1, true]} />
        <meshPhysicalMaterial {...paper(cfg.dark, 0.70, 0.18)} />
      </mesh>
      {/* Bottom half — mid layer */}
      <mesh position={[0, botY - 0.004, -0.004]}>
        <cylinderGeometry args={[W_MID_R * 1.025, W_BOT_R * 1.04, botH * 1.01, 48, 1, true]} />
        <meshPhysicalMaterial {...paper(cfg.mid, 0.78, 0.22)} />
      </mesh>
      {/* Bottom half — primary */}
      <mesh position={[0, botY, 0]}>
        <cylinderGeometry args={[W_MID_R, W_BOT_R, botH, 48, 1, true]} />
        <meshPhysicalMaterial {...paper(cfg.primary)} />
      </mesh>

      {/* Top half — shadow layer */}
      <mesh position={[0, topY - 0.006, -0.007]}>
        <cylinderGeometry args={[W_TOP_R * 1.05, W_MID_R * 1.05, topH * 1.02, 48, 1, true]} />
        <meshPhysicalMaterial {...paper(cfg.dark, 0.66, 0.20)} />
      </mesh>
      {/* Top half — mid layer */}
      <mesh position={[0, topY - 0.003, -0.003]}>
        <cylinderGeometry args={[W_TOP_R * 1.025, W_MID_R * 1.025, topH * 1.01, 48, 1, true]} />
        <meshPhysicalMaterial {...paper(cfg.mid, 0.74, 0.24)} />
      </mesh>
      {/* Top half — primary */}
      <mesh position={[0, topY, 0]}>
        <cylinderGeometry args={[W_TOP_R, W_MID_R, topH, 48, 1, true]} />
        <meshPhysicalMaterial {...paper(cfg.primary)} />
      </mesh>

      {/* Rim ring at top opening */}
      <mesh position={[0, halfH - 0.014, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[W_TOP_R * 0.95, 0.012, 8, 48]} />
        <meshPhysicalMaterial {...paper(cfg.dark, 0.50, 0.10)} />
      </mesh>

      {/* Flat base cap */}
      <mesh position={[0, -halfH, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[W_BOT_R, 24]} />
        <meshPhysicalMaterial {...paper(cfg.dark, 0.80, 0.10)} />
      </mesh>

      {/* Vertical crease lines — subtle paper fold texture */}
      {Array.from({ length: 10 }).map((_, i) => {
        const a  = (i / 10) * Math.PI * 2;
        const rr = W_MID_R * 0.97;
        return (
          <mesh key={i} position={[Math.cos(a) * rr, 0, Math.sin(a) * rr]}>
            <cylinderGeometry args={[0.0022, 0.0007, W_H * 0.86, 3, 1]} />
            <meshStandardMaterial color={cfg.dark} transparent opacity={0.16} />
          </mesh>
        );
      })}

      {/* Ribbon at waist */}
      <mesh position={[0, cinchLocalY, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[cinchR, 0.012, 8, 64]} />
        <meshStandardMaterial color={cfg.ribbon} roughness={0.18} metalness={0.25} />
      </mesh>

      {/* Bow — torus loops + sphere knot + cylinder tails */}
      <group position={[0, cinchLocalY, cinchR]}>
        <mesh position={[-0.055, 0.022, 0]} rotation={[0.10, 0, -0.44]}>
          <torusGeometry args={[0.044, 0.008, 8, 24, Math.PI]} />
          <meshStandardMaterial color={cfg.ribbon} roughness={0.18} metalness={0.25} />
        </mesh>
        <mesh position={[0.055, 0.022, 0]} rotation={[0.10, 0, 0.44]}>
          <torusGeometry args={[0.044, 0.008, 8, 24, Math.PI]} />
          <meshStandardMaterial color={cfg.ribbon} roughness={0.18} metalness={0.25} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.013, 10, 10]} />
          <meshStandardMaterial color={cfg.ribbon} roughness={0.26} />
        </mesh>
        <mesh position={[-0.038, -0.032, 0]} rotation={[0, 0, -0.22]}>
          <cylinderGeometry args={[0.005, 0.003, 0.062, 6]} />
          <meshStandardMaterial color={cfg.ribbon} roughness={0.18} metalness={0.25} />
        </mesh>
        <mesh position={[0.038, -0.032, 0]} rotation={[0, 0, 0.22]}>
          <cylinderGeometry args={[0.005, 0.003, 0.062, 6]} />
          <meshStandardMaterial color={cfg.ribbon} roughness={0.18} metalness={0.25} />
        </mesh>
      </group>

      {/* Stem bundle */}
      <mesh position={[0, -halfH - 0.082, 0]}>
        <cylinderGeometry args={[0.012, 0.009, 0.20, 10]} />
        <meshStandardMaterial color="#3a5c28" roughness={0.94} />
      </mesh>
      <mesh position={[0.008, -halfH - 0.078, 0.005]}>
        <cylinderGeometry args={[0.007, 0.005, 0.17, 8]} />
        <meshStandardMaterial color="#4a6a34" roughness={0.94} />
      </mesh>
      <mesh position={[-0.007, -halfH - 0.078, 0.005]}>
        <cylinderGeometry args={[0.006, 0.004, 0.15, 8]} />
        <meshStandardMaterial color="#4a6a34" roughness={0.94} />
      </mesh>

      {/* Ground shadow */}
      <mesh
        position={[0, -halfH - 0.17, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[1, 0.58, 1]}
      >
        <circleGeometry args={[W_BOT_R * 2.5, 36]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.07} />
      </mesh>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────
// FLOWER MODEL
// ─────────────────────────────────────────────────────────────
function FlowerModel({
  type, color, position, rotation, scale,
}: {
  type: string;
  color: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
}) {
  const { scene } = useGLTF(`/models/${type.toLowerCase()}.glb`);
  const normalized = useMemo(
    () => normalizeGLB(scene as unknown as THREE.Object3D, color),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [scene, color]
  );

  return (
    <group position={position} rotation={rotation} scale={[scale, scale, scale]}>
      <primitive object={normalized} />
    </group>
  );
}

// ─────────────────────────────────────────────────────────────
// BOUQUET MODEL
// ─────────────────────────────────────────────────────────────
function BouquetModel({ selectedFlowers, wrapStyle = "Blush Pink" }: Props) {
  const flowers = selectedFlowers.flatMap((f) =>
    Array.from({ length: f.quantity }, () => ({ type: f.type, color: f.color }))
  );

  const placements = useMemo(
    () => computeConstrainedPlacements(flowers),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(flowers)]
  );

  if (flowers.length === 0) return null;

  return (
    <group>
      <BouquetWrapper wrapStyle={wrapStyle} />
      {placements.map((p, i) => (
        <FlowerModel
          key={`${p.type}-${p.color}-${i}`}
          type={p.type}
          color={p.color}
          position={p.position}
          rotation={p.rotation}
          scale={p.scale}
        />
      ))}
    </group>
  );
}

// ─────────────────────────────────────────────────────────────
// LOADING PLACEHOLDER
// ─────────────────────────────────────────────────────────────
function LoadingPlaceholder() {
  return (
    <mesh position={[0, 0.72, 0]}>
      <sphereGeometry args={[0.24, 16, 16]} />
      <meshStandardMaterial color="#f2ccd8" transparent opacity={0.25} wireframe />
    </mesh>
  );
}

// ─────────────────────────────────────────────────────────────
// CANVAS EXPORT
// ─────────────────────────────────────────────────────────────
export default function Bouquet3D({ selectedFlowers, wrapStyle }: Props) {
  return (
    <div style={{ height: "100%", width: "100%", minHeight: "420px" }}>
      <Canvas
        camera={{ position: [0, 1.6, 3.2], fov: 42 }}
        gl={{
          antialias:           true,
          alpha:               true,
          toneMapping:         THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.12,
        }}
      >
        <directionalLight position={[2.5, 6, 4]}  intensity={1.55} color="#fff8f0" />
        <directionalLight position={[-3, 2.5, 2]} intensity={0.48} color="#e8f0ff" />
        <directionalLight position={[0, 2, -5]}   intensity={0.30} color="#ffe0f5" />
        <directionalLight position={[0, -3, 2]}   intensity={0.15} color="#fff4f0" />
        <ambientLight intensity={0.52} color="#fff6f2" />

        <Suspense fallback={<LoadingPlaceholder />}>
          <BouquetModel selectedFlowers={selectedFlowers} wrapStyle={wrapStyle} />
        </Suspense>

        <OrbitControls
          enableZoom
          minDistance={1.8}
          maxDistance={6.0}
          maxPolarAngle={Math.PI / 2.4}
          minPolarAngle={Math.PI / 6}
          autoRotate
          autoRotateSpeed={0.50}
          enablePan={false}
          target={[0, 0.52, 0]}
        />
      </Canvas>
    </div>
  );
}