"use client";

import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import { useAspect, useTexture } from "@react-three/drei";
import { useMemo, useRef, useEffect, memo } from "react";
import * as THREE from "three/webgpu";
import { bloom } from "three/examples/jsm/tsl/display/BloomNode.js";
import { Mesh } from "three";

import {
  abs,
  blendScreen,
  float,
  mod,
  mx_cell_noise_float,
  oneMinus,
  smoothstep,
  texture,
  uniform,
  uv,
  vec2,
  vec3,
  pass,
  add,
} from "three/tsl";

const TEXTUREMAP = { src: "https://i.postimg.cc/XYwvXN8D/img-4.png" };
const DEPTHMAP = { src: "https://i.postimg.cc/2SHKQh2q/raw-4.webp" };
const TITLE_WORDS = ["Build", "Your", "Dreams"] as const;
type WebGpuRendererOptions = ConstructorParameters<typeof THREE.WebGPURenderer>[0];

function setNumericUniform(target: { value: number }, next: number) {
  target.value = next;
}

function setVectorUniform(target: { value: THREE.Vector2 }, next: THREE.Vector2) {
  target.value.copy(next);
}

extend(THREE as unknown as never);

const PostProcessing = ({
  strength = 1,
  threshold = 1,
  fullScreenEffect = true,
  visibleRef,
}: {
  strength?: number;
  threshold?: number;
  fullScreenEffect?: boolean;
  visibleRef: React.RefObject<boolean>;
}) => {
  const { gl, scene, camera } = useThree();
  const scanProgress = useMemo(() => uniform(0), []);
  const scanPulse = useMemo(() => uniform(1), []);

  const render = useMemo(() => {
    const postProcessing = new THREE.PostProcessing(gl as unknown as THREE.WebGPURenderer);
    const scenePass = pass(scene, camera);
    const scenePassColor = scenePass.getTextureNode("output");

    const scanPos = float(scanProgress);
    const uvY = uv().y;
    const beamDistance = abs(uvY.sub(scanPos));

    const beamCore = oneMinus(smoothstep(0, 0.0028, beamDistance));
    const beamGlow = oneMinus(smoothstep(0.0028, 0.026, beamDistance));
    const beamAura = oneMinus(smoothstep(0.026, 0.09, beamDistance));

    const sparkleNoise = mx_cell_noise_float(vec2(uv().x.mul(140), scanPos.mul(42))).mul(0.35).add(0.65);
    const pulse = float(scanPulse);

    const coreColor = vec3(1.0, 0.2, 0.24).mul(beamCore).mul(1.35).mul(pulse);
    const glowColor = vec3(1.0, 0.08, 0.16).mul(beamGlow).mul(0.75).mul(sparkleNoise);
    const auraColor = vec3(0.8, 0.03, 0.12).mul(beamAura).mul(0.26);
    const laserOverlay = add(add(coreColor, glowColor), auraColor);

    const withScanEffect = fullScreenEffect ? add(scenePassColor, laserOverlay) : scenePassColor;
    const bloomPass = bloom(withScanEffect, strength, 0.35, threshold);

    const final = add(withScanEffect, bloomPass);
    postProcessing.outputNode = final;
    return postProcessing;
  }, [camera, gl, scene, strength, threshold, fullScreenEffect, scanProgress, scanPulse]);

  useFrame(({ clock }) => {
    if (!visibleRef.current) return;
    const elapsed = clock.getElapsedTime();
    setNumericUniform(scanProgress, Math.sin(elapsed * 0.48) * 0.5 + 0.5);
    setNumericUniform(scanPulse, 0.88 + Math.sin(elapsed * 6.2) * 0.12);
    void render.renderAsync();
  }, 1);

  return null;
};

const WIDTH = 300;
const HEIGHT = 300;

const Scene = ({ visibleRef }: { visibleRef: React.RefObject<boolean> }) => {
  const [rawMap, depthMap] = useTexture([TEXTUREMAP.src, DEPTHMAP.src]);
  const meshRef = useRef<Mesh>(null);
  const uPointer = useMemo(() => uniform(new THREE.Vector2(0, 0)), []);
  const uProgress = useMemo(() => uniform(0), []);
  const visible = Boolean(rawMap && depthMap);

  const material = useMemo(() => {
    const tDepthMap = texture(depthMap);
    const tMap = texture(
      rawMap,
      uv().add(tDepthMap.r.mul(uPointer).mul(0.01))
    );

    const aspect = float(WIDTH).div(HEIGHT);
    const tUv = vec2(uv().x.mul(aspect), uv().y);
    const tiling = vec2(120.0);
    const tiledUv = mod(tUv.mul(tiling), 2.0).sub(1.0);
    const brightness = mx_cell_noise_float(tUv.mul(tiling).div(2));
    const dist = float(tiledUv.length());
    const dot = float(smoothstep(0.5, 0.49, dist)).mul(brightness);
    const depth = tDepthMap;

    // @ts-expect-error — three/tsl vec4/float mismatch, works at runtime
    const flow = oneMinus(smoothstep(0, 0.02, abs(depth.sub(uProgress))));
    const mask = dot.mul(flow).mul(vec3(10, 0, 0));
    const final = blendScreen(tMap, mask);

    const mat = new THREE.MeshBasicNodeMaterial({
      colorNode: final,
      transparent: true,
      opacity: 0,
    });

    return mat;
  }, [rawMap, depthMap, uPointer, uProgress]);

  const [w, h] = useAspect(WIDTH, HEIGHT);

  useFrame(({ clock }) => {
    if (!visibleRef.current) return;
    setNumericUniform(uProgress, Math.sin(clock.getElapsedTime() * 0.5) * 0.5 + 0.5);
    const currentMaterial = meshRef.current?.material;
    if (currentMaterial && !Array.isArray(currentMaterial) && typeof currentMaterial.opacity === "number") {
      currentMaterial.opacity = THREE.MathUtils.lerp(currentMaterial.opacity, visible ? 1 : 0, 0.07);
    }
  });

  useFrame(({ pointer }) => {
    if (!visibleRef.current) return;
    setVectorUniform(uPointer, pointer);
  });

  return (
    <mesh ref={meshRef} scale={[w * 0.4, h * 0.4, 1]} material={material}>
      <planeGeometry />
    </mesh>
  );
};

/*
 * Canvas is memo'd and fully isolated — no parent state can cause it to re-render.
 * This is the key performance fix: text animation setState calls won't interrupt the GPU.
 */
const HeroCanvas = memo(function HeroCanvas({ visibleRef }: { visibleRef: React.RefObject<boolean> }) {
  return (
    <Canvas
      flat
      gl={async (props) => {
        const renderer = new THREE.WebGPURenderer(props as WebGpuRendererOptions);
        await renderer.init();
        return renderer;
      }}
    >
      <PostProcessing fullScreenEffect={false} visibleRef={visibleRef} />
      <Scene visibleRef={visibleRef} />
    </Canvas>
  );
});

/*
 * Text overlay — manages its own animation state, completely separate from Canvas.
 * Uses refs + CSS classes instead of React state for the actual visual transitions.
 */
function HeroOverlay() {
  const subtitle = "AI-powered creativity for the next generation.";
  const containerRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fade in the title block, then subtitle
    const el = containerRef.current;
    if (el) {
      el.classList.add("fade-in");
    }

    setTimeout(() => {
      if (subtitleRef.current) {
        subtitleRef.current.classList.add("fade-in-subtitle");
      }
    }, 1000);
  }, []);

  return (
    <div className="h-svh uppercase items-center w-full absolute z-60 pointer-events-none px-10 flex justify-center flex-col">
      <div
        ref={containerRef}
        className="text-3xl md:text-5xl xl:text-6xl 2xl:text-7xl font-extrabold"
        style={{ opacity: 0 }}
      >
        <div className="flex space-x-2 lg:space-x-6 hero-shimmer">
          {TITLE_WORDS.map((word, i) => (
            <div key={i}>{word}</div>
          ))}
        </div>
      </div>
      <div className="text-xs md:text-xl xl:text-2xl 2xl:text-3xl mt-2 overflow-hidden text-white font-bold">
        <div ref={subtitleRef} style={{ opacity: 0 }}>
          {subtitle}
        </div>
      </div>
    </div>
  );
}

export const HeroFuturistic = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const visibleRef = useRef(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { visibleRef.current = entry.isIntersecting; },
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="relative h-svh w-full">
      <HeroOverlay />

      <HeroCanvas visibleRef={visibleRef} />
    </div>
  );
};

export default HeroFuturistic;
