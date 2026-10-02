'use client';
import { useEffect, useRef } from 'react';

interface HeroBackgroundProps {
  className?: string;
}

export function HeroBackground({ className = '' }: HeroBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    // Mouse coordinates with smooth lerp
    let mouseTargetX = 0;
    let mouseTargetY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      // Normalized between -1 and 1
      mouseTargetX = ((e.clientX - rect.left) / width - 0.5) * 2;
      mouseTargetY = ((e.clientY - rect.top) / height - 0.5) * 2;
    };

    const handleResize = () => {
      if (!canvas.parentElement) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.parentElement.clientWidth;
      height = canvas.parentElement.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 3D Projection configuration
    const focalLength = 380;
    const horizonY = height * 0.48; // horizon level
    let zOffset = 0;
    const speed = 0.85; // Z-axis forward scroll speed

    // Telemetry mock state
    let frameCount = 0;
    let smpteFrames = 21;
    let lastSmpteUpdate = 0;

    // 3D Bounding Boxes (CAD Scene Objects)
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

    const boxes: BoundingBox[] = [
      {
        x: -420,
        y: 60,
        z: 460,
        w: 150,
        h: 80,
        d: 120,
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

    // Helper: 3D Point to 2D Screen projection
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

    // Render loop (Strict 60 FPS requestAnimationFrame)
    const render = (time: number) => {
      animationFrameId = requestAnimationFrame(render);
      frameCount++;

      // Smooth mouse damping (Lerp)
      mouseX += (mouseTargetX - mouseX) * 0.045;
      mouseY += (mouseTargetY - mouseY) * 0.045;

      // Update Z scroll
      zOffset = (zOffset + speed) % 120;

      // Vanishing point shift based on mouse parallax
      const vpX = width * 0.5 + mouseX * 70;
      const vpY = horizonY + mouseY * 35;

      ctx.clearRect(0, 0, width, height);

      // Save context
      ctx.save();

      // ========================================================
      // 1. THE FOUNDATION: PERSPECTIVE 3D BLUEPRINT GRID
      // ========================================================
      const gridSpacingX = 140;
      const numLinesX = 14; // Left and right from center
      const maxZ = 1200;
      const minZ = 60;
      const stepZ = 120;

      // Longitudinal lines converging into vanishing point
      ctx.lineWidth = 1;
      for (let i = -numLinesX; i <= numLinesX; i++) {
        const worldX = i * gridSpacingX;
        const groundY = 180; // Distance below horizon

        const pNear = project(worldX, groundY, minZ, vpX, vpY);
        const pFar = project(worldX, groundY, maxZ, vpX, vpY);

        if (pNear.visible && pFar.visible) {
          const distAlpha = Math.max(0, 1 - Math.abs(i) / (numLinesX + 1));
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.045 * distAlpha})`;
          ctx.beginPath();
          ctx.moveTo(pNear.x, pNear.y);
          ctx.lineTo(pFar.x, pFar.y);
          ctx.stroke();
        }
      }

      // Transverse lines scrolling forward along Z
      for (let z = minZ; z <= maxZ; z += stepZ) {
        const currentZ = z - zOffset;
        if (currentZ < minZ) continue;

        const groundY = 180;
        const pLeft = project(-numLinesX * gridSpacingX, groundY, currentZ, vpX, vpY);
        const pRight = project(numLinesX * gridSpacingX, groundY, currentZ, vpX, vpY);

        if (pLeft.visible && pRight.visible) {
          // Falloff with depth
          const depthRatio = Math.max(0, 1 - (currentZ - minZ) / (maxZ - minZ));
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.055 * depthRatio})`;
          ctx.beginPath();
          ctx.moveTo(pLeft.x, pLeft.y);
          ctx.lineTo(pRight.x, pRight.y);
          ctx.stroke();

          // Dot-Matrix Intersections along transverse line (Crisp Monochrome dots)
          const dotStep = 2; // Every 2 columns
          for (let i = -numLinesX; i <= numLinesX; i += dotStep) {
            const pDot = project(i * gridSpacingX, groundY, currentZ, vpX, vpY);
            if (pDot.visible) {
              const dotAlpha = 0.16 * depthRatio;
              ctx.fillStyle = i === 0 ? `rgba(255, 255, 255, ${dotAlpha * 2})` : `rgba(161, 161, 170, ${dotAlpha})`;
              ctx.fillRect(pDot.x - 1, pDot.y - 1, 2, 2);
            }
          }
        }
      }

      // ========================================================
      // 2. 3D WIREFRAME BOUNDING BOXES (CAD OBJECT VOLUMES)
      // ========================================================
      boxes.forEach((box) => {
        box.rotY += box.rotSpeed;
        const cos = Math.cos(box.rotY);
        const sin = Math.sin(box.rotY);

        // 8 local vertices of the cuboid
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

        // Transform vertices: Rotate around Y, translate to box.x, box.y, box.z
        const projVerts = localVerts.map(([vx, vy, vz]) => {
          const rx = vx * cos - vz * sin;
          const rz = vx * sin + vz * cos;
          const wx = box.x + rx;
          const wy = box.y + vy;
          const wz = box.z + rz;
          return project(wx, wy, wz, vpX, vpY);
        });

        // 12 edges connecting cuboid vertices
        const edges = [
          [0, 1], [1, 2], [2, 3], [3, 0], // front
          [4, 5], [5, 6], [6, 7], [7, 4], // back
          [0, 4], [1, 5], [2, 6], [3, 7], // sides
        ];

        // Draw faint wireframe edges
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
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

        // CAD Corner Brackets / Vertex Crosshairs
        projVerts.forEach((pv) => {
          if (pv.visible) {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
            const bSize = 3;
            ctx.beginPath();
            ctx.moveTo(pv.x - bSize, pv.y);
            ctx.lineTo(pv.x + bSize, pv.y);
            ctx.moveTo(pv.x, pv.y - bSize);
            ctx.lineTo(pv.x, pv.y + bSize);
            ctx.stroke();
          }
        });

        // Object Wireframe Label
        const topCenter = projVerts[0];
        if (topCenter && topCenter.visible) {
          ctx.font = '8px var(--font-mono, monospace)';
          ctx.fillStyle = 'rgba(230, 230, 235, 0.4)';
          ctx.fillText(box.label, topCenter.x - 30, topCenter.y - 8);
          ctx.fillText(`DIM: [${box.w}x${box.h}x${box.d}]`, topCenter.x - 30, topCenter.y + 2);
        }
      });

      // ========================================================
      // 3. THE DYNAMIC ELEMENT: OSCILLOSCOPE WAVEFORM
      // ========================================================
      // Single glowing green sine wave monitoring live telemetry signal
      const waveY = horizonY + 25 + mouseY * 15;
      const wavePoints: { x: number; y: number }[] = [];
      const numWavePoints = 80;
      const stepX = width / numWavePoints;

      for (let i = 0; i <= numWavePoints; i++) {
        const x = i * stepX;
        // Waveform calculation with carrier frequency & harmonic modulation
        const normX = x / width;
        const envelope = Math.sin(normX * Math.PI); // Taper at edges
        const waveTime = time * 0.0018;

        const primarySine = Math.sin(normX * 12 + waveTime * 4.2);
        const subHarmonic = Math.sin(normX * 24 - waveTime * 6.5) * 0.35;
        const audioImpulse = Math.cos(normX * 4 + waveTime) * 0.2;

        const yOffset = (primarySine + subHarmonic + audioImpulse) * 22 * envelope;
        wavePoints.push({ x, y: waveY + yOffset });
      }

      // Draw faint secondary phosphor ghost trace
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 158, 27, 0.08)';
      ctx.lineWidth = 3;
      for (let i = 0; i < wavePoints.length; i++) {
        const pt = wavePoints[i];
        if (i === 0) ctx.moveTo(pt.x, pt.y + 2);
        else ctx.lineTo(pt.x, pt.y + 2);
      }
      ctx.stroke();

      // Draw primary crisp oscilloscope beam with glow
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
      ctx.shadowBlur = 0; // Reset shadow

      // Lead cursor point on the oscilloscope wave
      const leadIdx = Math.floor((frameCount * 0.8) % wavePoints.length);
      const leadPt = wavePoints[leadIdx];
      if (leadPt) {
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = '#FFFFFF';
        ctx.shadowBlur = 6;
        ctx.fillRect(leadPt.x - 2, leadPt.y - 2, 4, 4);
        ctx.shadowBlur = 0;
      }

      // ========================================================
      // 4. THE HUD OVERLAYS: CAD AXES, CROSSHAIRS & CALIPERS
      // ========================================================
      // Center Crosshairs spanning the viewport
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;

      // X-Axis (Horizontal)
      ctx.beginPath();
      ctx.moveTo(0, vpY);
      ctx.lineTo(width, vpY);
      ctx.stroke();

      // Y-Axis (Vertical)
      ctx.beginPath();
      ctx.moveTo(vpX, 0);
      ctx.lineTo(vpX, height);
      ctx.stroke();

      // Caliper Ticks along X-Axis
      const tickSpacing = 40;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      for (let tx = tickSpacing; tx < width; tx += tickSpacing) {
        const tickH = tx % (tickSpacing * 4) === 0 ? 6 : 3;
        ctx.beginPath();
        ctx.moveTo(tx, vpY - tickH);
        ctx.lineTo(tx, vpY + tickH);
        ctx.stroke();
      }

      // Caliper Ticks along Y-Axis
      for (let ty = tickSpacing; ty < height; ty += tickSpacing) {
        const tickW = ty % (tickSpacing * 4) === 0 ? 6 : 3;
        ctx.beginPath();
        ctx.moveTo(vpX - tickW, ty);
        ctx.lineTo(vpX + tickW, ty);
        ctx.stroke();
      }

      // Coordinate Labels at Axis Intersections
      ctx.font = '8px var(--font-mono, monospace)';
      ctx.fillStyle = 'rgba(255, 158, 27, 0.45)';

      const rawX = mouseX * 180;
      const rawY = mouseY * -120;
      ctx.fillText(`X: ${rawX > 0 ? '+' : ''}${rawX.toFixed(2)}`, vpX + 8, vpY - 8);
      ctx.fillText(`Y: ${rawY > 0 ? '+' : ''}${rawY.toFixed(2)}`, vpX + 8, vpY + 16);
      ctx.fillText('Z: 0.00', vpX + 8, vpY + 28);

      // ========================================================
      // 5. SCATTERED MONOSPACE TELEMETRY DATA READOUTS
      // ========================================================
      // SMPTE Frame calculation (30 fps frame counter)
      if (time - lastSmpteUpdate > 33) {
        smpteFrames = (smpteFrames + 1) % 30;
        lastSmpteUpdate = time;
      }
      const smpteStr = `00:00:14:${String(smpteFrames).padStart(2, '0')}`;
      const blink = Math.floor(time / 500) % 2 === 0;

      ctx.font = '8px var(--font-mono, monospace)';
      ctx.fillStyle = 'rgba(230, 230, 235, 0.35)';

      // Top-Left Telemetry
      ctx.fillText('VIEW: CAD_PERSP // CAM_01', 28, 48);
      ctx.fillText('PROJ: 35MM EQUIV · FL: 380MM', 28, 62);
      ctx.fillText(`SYNC: ${blink ? '● ONLINE' : '○ ONLINE'}`, 28, 76);

      // Top-Right Telemetry
      const trX = width - 180;
      ctx.fillText(`SMPTE: ${smpteStr}`, trX, 48);
      ctx.fillText('TIMEBASE: 29.97 NDF', trX, 62);
      ctx.fillText('CALIBRATION: MATRIX_01', trX, 76);

      // Bottom-Left Telemetry
      const blY = height - 48;
      ctx.fillText('VRAM: 12.4 GB / 24.0 GB', 28, blY);
      ctx.fillText('BUFFER: 24-BIT DUAL-CH', 28, blY + 14);
      ctx.fillText('RENDER: 60.0 FPS [LOCKED]', 28, blY + 28);

      // Bottom-Right Telemetry
      const brX = width - 200;
      ctx.fillText('GRID: 100.0 MM [ORTHO-Z]', brX, blY);
      ctx.fillText('NODE: 01/A · STACK: 04', brX, blY + 14);
      ctx.fillText('AES ENCLAVE: ARMED', brX, blY + 28);

      ctx.restore();
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      className={`absolute inset-0 pointer-events-none select-none overflow-hidden z-0 ${className}`}
      style={{ opacity: 0.85 }} // Overall wrapper is subtle, canvas elements draw with low 0.08 - 0.3 alpha
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ mixBlendMode: 'screen' }}
      />
    </div>
  );
}
