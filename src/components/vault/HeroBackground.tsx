'use client';
import { useEffect, useRef } from 'react';

interface HeroBackgroundProps {
  className?: string;
}

interface BoundingBox {
  x: number;
  y: number;
  z: number;
  w: number;
  h: number;
  d: number;
  label: string;
  rotY: number;
  rotSpeed: number;
}

export function HeroBackground({ className = '' }: HeroBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.parentElement?.clientHeight || window.innerHeight);

    // Mouse coordinates with smooth lerp
    let mouseTargetX = 0;
    let mouseTargetY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseTargetX = ((e.clientX - rect.left) / width - 0.5) * 2;
      mouseTargetY = ((e.clientY - rect.top) / height - 0.5) * 2;
    };

    const handleResize = () => {
      if (!canvas.parentElement) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.parentElement.clientWidth;
      height = canvas.parentElement.clientHeight;
      
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      
      // Reset transform before re-applying scale to avoid DPR accumulation
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    let resizeTimer: NodeJS.Timeout | null = null;
    const debouncedResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(handleResize, 100);
    };

    handleResize();
    window.addEventListener('resize', debouncedResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 3D Projection configuration
    const focalLength = 380;
    const horizonY = height * 0.48;
    let zOffset = 0;
    const speed = 0.85;

    // Telemetry mock state
    let frameCount = 0;
    let smpteFrames = 21;
    let lastSmpteUpdate = 0;

    const boxes: BoundingBox[] = [
      {
        x: -720,
        y: 260,
        z: 520,
        w: 180,
        h: 90,
        d: 140,
        label: 'OBJ_BOUNDS // AUDIO_STEM_RIG',
        rotY: 0.2,
        rotSpeed: 0.002,
      },
      {
        x: 440,
        y: 90,
        z: 560,
        w: 200,
        h: 120,
        d: 160,
        label: 'OBJ_BOUNDS // CAM_LENS_CHASSIS',
        rotY: -0.3,
        rotSpeed: -0.0015,
      },
    ];

    const project = (
      px: number,
      py: number,
      pz: number,
      cx: number,
      cy: number
    ): { x: number; y: number; scale: number; visible: boolean } => {
      if (pz <= 20) return { x: 0, y: 0, scale: 0, visible: false };
      const scale = focalLength / pz;
      const sx = cx + px * scale;
      const sy = cy + py * scale;
      return { x: sx, y: sy, scale, visible: true };
    };

    const render = (time: number) => {
      animationFrameId = requestAnimationFrame(render);
      frameCount++;

      mouseX += (mouseTargetX - mouseX) * 0.045;
      mouseY += (mouseTargetY - mouseY) * 0.045;

      zOffset = (zOffset + speed) % 120;

      const vpX = width * 0.5 + mouseX * 70;
      const vpY = horizonY + mouseY * 35;

      ctx.clearRect(0, 0, width, height);
      ctx.save();

      const isLight = document.documentElement.classList.contains('light');
      const strokeBase = isLight ? '0, 0, 0' : '255, 255, 255';
      const textBase = isLight ? '#09090B' : '#FFFFFF';

      // 1. THE FOUNDATION: PERSPECTIVE 3D BLUEPRINT GRID
      const gridSpacingX = 140;
      const numLinesX = 14;
      const maxZ = 1200;
      const minZ = 60;
      const stepZ = 120;

      ctx.lineWidth = 1;
      for (let i = -numLinesX; i <= numLinesX; i++) {
        const worldX = i * gridSpacingX;
        const groundY = 180;

        const pNear = project(worldX, groundY, minZ, vpX, vpY);
        const pFar = project(worldX, groundY, maxZ, vpX, vpY);

        if (pNear.visible && pFar.visible) {
          const distAlpha = Math.max(0, 1 - Math.abs(i) / (numLinesX + 1));
          ctx.strokeStyle = `rgba(${strokeBase}, ${0.08 * distAlpha})`;
          ctx.beginPath();
          ctx.moveTo(pNear.x, pNear.y);
          ctx.lineTo(pFar.x, pFar.y);
          ctx.stroke();
        }
      }

      for (let z = minZ; z <= maxZ; z += stepZ) {
        const currentZ = z - zOffset;
        if (currentZ < minZ) continue;

        const groundY = 180;
        const pLeft = project(-numLinesX * gridSpacingX, groundY, currentZ, vpX, vpY);
        const pRight = project(numLinesX * gridSpacingX, groundY, currentZ, vpX, vpY);

        if (pLeft.visible && pRight.visible) {
          const depthRatio = Math.max(0, 1 - (currentZ - minZ) / (maxZ - minZ));
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.18 * depthRatio})`;
          ctx.beginPath();
          ctx.moveTo(pLeft.x, pLeft.y);
          ctx.lineTo(pRight.x, pRight.y);
          ctx.stroke();

          const dotStep = 2;
          for (let i = -numLinesX; i <= numLinesX; i += dotStep) {
            const pDot = project(i * gridSpacingX, groundY, currentZ, vpX, vpY);
            if (pDot.visible) {
              const dotAlpha = 0.42 * depthRatio;
              ctx.fillStyle = i === 0 ? `rgba(255, 255, 255, ${Math.min(1, dotAlpha * 2)})` : `rgba(200, 200, 210, ${dotAlpha})`;
              ctx.fillRect(pDot.x - 1.5, pDot.y - 1.5, 3, 3);
            }
          }
        }
      }

      // 2. 3D WIREFRAME BOUNDING BOXES
      boxes.forEach((box) => {
        box.rotY += box.rotSpeed;
        const cos = Math.cos(box.rotY);
        const sin = Math.sin(box.rotY);

        const halfW = box.w / 2;
        const halfH = box.h / 2;
        const halfD = box.d / 2;

        const localVerts = [
          [-halfW, -halfH, -halfD],
          [halfW, -halfH, -halfD],
          [halfW, halfH, -halfD],
          [-halfW, halfH, -halfD],
          [-halfW, -halfH, halfD],
          [halfW, -halfH, halfD],
          [halfW, halfH, halfD],
          [-halfW, halfH, halfD],
        ];

        const projVerts = localVerts.map(([vx, vy, vz]) => {
          const rx = vx * cos - vz * sin;
          const rz = vx * sin + vz * cos;
          const wx = box.x + rx;
          const wy = box.y + vy;
          const wz = box.z + rz;
          return project(wx, wy, wz, vpX, vpY);
        });

        const edges = [
          [0, 1], [1, 2], [2, 3], [3, 0],
          [4, 5], [5, 6], [6, 7], [7, 4],
          [0, 4], [1, 5], [2, 6], [3, 7],
        ];

        ctx.strokeStyle = `rgba(${strokeBase}, 0.12)`;
        ctx.lineWidth = 1;
        edges.forEach(([v1, v2]) => {
          const p1 = projVerts[v1];
          const p2 = projVerts[v2];
          if (p1.visible && p2.visible) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });

        projVerts.forEach((pv) => {
          if (pv.visible) {
            ctx.strokeStyle = `rgba(${strokeBase}, 0.25)`;
            const bSize = 2;
            ctx.beginPath();
            ctx.moveTo(pv.x - bSize, pv.y);
            ctx.lineTo(pv.x + bSize, pv.y);
            ctx.moveTo(pv.x, pv.y - bSize);
            ctx.lineTo(pv.x, pv.y + bSize);
            ctx.stroke();
          }
        });

        const topCenter = projVerts[0];
        if (topCenter && topCenter.visible) {
          // Debug text removed for clarity
        }
      });

      // 3. THE DYNAMIC ELEMENT: OSCILLOSCOPE WAVEFORM
      const waveY = horizonY + 25 + mouseY * 15;
      const wavePoints: { x: number; y: number }[] = [];
      const numWavePoints = 80;
      const stepX = width / numWavePoints;

      for (let i = 0; i <= numWavePoints; i++) {
        const x = i * stepX;
        const normX = x / width;
        const envelope = Math.sin(normX * Math.PI);
        const waveTime = time * 0.0018;

        const primarySine = Math.sin(normX * 12 + waveTime * 4.2);
        const subHarmonic = Math.sin(normX * 24 - waveTime * 6.5) * 0.35;
        const audioImpulse = Math.cos(normX * 4 + waveTime) * 0.2;

        const yOffset = (primarySine + subHarmonic + audioImpulse) * 22 * envelope;
        wavePoints.push({ x, y: waveY + yOffset });
      }

      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 68, 0, 0.08)';
      ctx.lineWidth = 3;
      for (let i = 0; i < wavePoints.length; i++) {
        const pt = wavePoints[i];
        if (i === 0) ctx.moveTo(pt.x, pt.y + 2);
        else ctx.lineTo(pt.x, pt.y + 2);
      }
      ctx.stroke();

      ctx.shadowColor = '#FFFFFF';
      ctx.shadowBlur = 4;
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
      ctx.lineWidth = 1;
      for (let i = 0; i < wavePoints.length; i++) {
        const pt = wavePoints[i];
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      const leadIdx = Math.floor((frameCount * 0.8) % wavePoints.length);
      const leadPt = wavePoints[leadIdx];
      if (leadPt) {
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = '#FFFFFF';
        ctx.shadowBlur = 6;
        ctx.fillRect(leadPt.x - 2, leadPt.y - 2, 4, 4);
        ctx.shadowBlur = 0;
      }

      // 4. THE HUD OVERLAYS: CAD AXES & CROSSHAIRS
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.moveTo(0, vpY);
      ctx.lineTo(width, vpY);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(vpX, 0);
      ctx.lineTo(vpX, height);
      ctx.stroke();

      const tickSpacing = 40;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      for (let tx = tickSpacing; tx < width; tx += tickSpacing) {
        const tickH = tx % (tickSpacing * 4) === 0 ? 6 : 3;
        ctx.beginPath();
        ctx.moveTo(tx, vpY - tickH);
        ctx.lineTo(tx, vpY + tickH);
        ctx.stroke();
      }

      for (let ty = tickSpacing; ty < height; ty += tickSpacing) {
        const tickW = ty % (tickSpacing * 4) === 0 ? 6 : 3;
        ctx.beginPath();
        ctx.moveTo(vpX - tickW, ty);
        ctx.lineTo(vpX + tickW, ty);
        ctx.stroke();
      }

      ctx.font = '8px var(--font-mono, monospace)';
      ctx.fillStyle = 'rgba(255, 68, 0, 0.45)';

      // Coordinate text removed for clarity

      ctx.restore();
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (resizeTimer) clearTimeout(resizeTimer);
      window.removeEventListener('resize', debouncedResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      className={`absolute inset-0 pointer-events-none select-none overflow-hidden z-0 opacity-70 ${className}`}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block dark:mix-blend-screen light:mix-blend-multiply"
      />
    </div>
  );
}
