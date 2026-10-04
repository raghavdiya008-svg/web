'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { parseCubeLut } from '@/lib/lut/cubeParser';
import { Sliders, Maximize2, RotateCcw } from 'lucide-react';

interface WebglLutViewerProps {
  cubeUrl: string;
  defaultClip?: string;
  availableClips?: { id: string; label: string; src: string }[];
  title?: string;
  showClipSwitcher?: boolean;
}

const DEFAULT_CLIPS = [
  { id: 'skin', label: 'Arri Log-C3 (Skin tones)', src: '/samples/skin_tone.svg' },
  { id: 'night', label: 'Sony S-Log3 (Night exterior)', src: '/samples/night_exterior.svg' },
  { id: 'landscape', label: 'Red Log3G10 (Landscape)', src: '/samples/daylight_landscape.svg' },
  { id: 'chart', label: 'Macbeth ColorChecker 24', src: '/samples/colorchecker.svg' },
];

export function WebglLutViewer({
  cubeUrl,
  defaultClip,
  availableClips = DEFAULT_CLIPS,
  title = 'Kodak Vision3 5219 Emulation',
  showClipSwitcher = true,
}: WebglLutViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [selectedClip, setSelectedClip] = useState(defaultClip || availableClips[0].src);
  const [splitPos, setSplitPos] = useState(0.5); // 0.0 to 1.0
  const [strength, setStrength] = useState(1.0); // 0.0 to 1.0
  const [isDraggingSplit, setIsDraggingSplit] = useState(false);
  const [lutData, setLutData] = useState<any | null>(null);
  const [errorFallback, setErrorFallback] = useState(false);

  // Load and parse .cube file
  useEffect(() => {
    let mounted = true;
    fetch(cubeUrl)
      .then((res) => {
        if (!res.ok) throw new Error('LUT file fetch failed');
        return res.text();
      })
      .then((text) => {
        if (!mounted) return;
        const parsed = parseCubeLut(text);
        if (parsed) {
          setLutData(parsed);
        } else {
          setErrorFallback(true);
        }
      })
      .catch(() => {
        if (mounted) setErrorFallback(true);
      });

    return () => {
      mounted = false;
    };
  }, [cubeUrl]);

  // WebGL 2.0 / 3D Texture rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !lutData) return;

    const gl = canvas.getContext('webgl2', { preserveDrawingBuffer: true });
    if (!gl) {
      setErrorFallback(true);
      return;
    }

    const ext = gl.getExtension('EXT_color_buffer_float');

    // Compile Vertex Shader
    const vsSource = `#version 300 es
      in vec2 a_position;
      out vec2 v_uv;
      void main() {
        v_uv = (a_position + 1.0) * 0.5;
        // Flip Y for image texture coords
        v_uv.y = 1.0 - v_uv.y;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // Compile Fragment Shader with 3D Texture lookup
    const fsSource = `#version 300 es
      precision mediump float;
      precision mediump sampler3D;

      in vec2 v_uv;
      out vec4 fragColor;

      uniform sampler2D u_image;
      uniform sampler3D u_lut;
      uniform float u_split;
      uniform float u_strength;
      uniform float u_lut_size;

      void main() {
        vec2 uv = v_uv;
        vec4 original = texture(u_image, uv);

        // Normalized LUT coordinate offset for half-texel precision
        vec3 lutCoord = original.rgb * ((u_lut_size - 1.0) / u_lut_size) + (0.5 / u_lut_size);
        vec3 graded = texture(u_lut, lutCoord).rgb;
        vec3 finalGraded = mix(original.rgb, graded, u_strength);

        // Split comparison: left = original log, right = graded LUT
        float isGraded = step(u_split, uv.x);
        vec3 col = mix(original.rgb, finalGraded, isGraded);

        // Thin division line
        float lineDist = abs(uv.x - u_split);
        if (lineDist < 0.0018) {
          col = vec3(0.95, 0.95, 0.93);
        }

        fragColor = vec4(col, original.a);
      }
    `;

    function createShader(glCtx: WebGL2RenderingContext, type: number, src: string) {
      const shader = glCtx.createShader(type);
      if (!shader) return null;
      glCtx.shaderSource(shader, src);
      glCtx.compileShader(shader);
      if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
        glCtx.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) {
      setErrorFallback(true);
      return;
    }

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      setErrorFallback(true);
      return;
    }

    // Full screen quad
    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    // Create 3D Texture for LUT
    const lutTexture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_3D, lutTexture);
    gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);

    const size = lutData.size;
    // Prepare RGBA buffer from RGB data
    const rgbaData = new Float32Array(size * size * size * 4);
    for (let i = 0; i < size * size * size; i++) {
      rgbaData[i * 4] = lutData.data[i * 3];
      rgbaData[i * 4 + 1] = lutData.data[i * 3 + 1];
      rgbaData[i * 4 + 2] = lutData.data[i * 3 + 2];
      rgbaData[i * 4 + 3] = 1.0;
    }

    gl.texImage3D(
      gl.TEXTURE_3D,
      0,
      gl.RGBA32F,
      size,
      size,
      size,
      0,
      gl.RGBA,
      gl.FLOAT,
      rgbaData
    );

    // Image texture
    const imageTexture = gl.createTexture();
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = selectedClip;

    let animId = 0;

    image.onload = () => {
      canvas.width = image.naturalWidth || 1200;
      canvas.height = image.naturalHeight || 800;

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, imageTexture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

      const render = () => {
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.useProgram(program);

        const aPos = gl.getAttribLocation(program, 'a_position');
        gl.enableVertexAttribArray(aPos);
        gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
        gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

        gl.uniform1i(gl.getUniformLocation(program, 'u_image'), 0);
        gl.uniform1i(gl.getUniformLocation(program, 'u_lut'), 1);
        gl.uniform1f(gl.getUniformLocation(program, 'u_split'), splitPos);
        gl.uniform1f(gl.getUniformLocation(program, 'u_strength'), strength);
        gl.uniform1f(gl.getUniformLocation(program, 'u_lut_size'), size);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
      };

      render();
    };

    return () => {
      cancelAnimationFrame(animId);
      gl.deleteProgram(program);
      gl.deleteTexture(lutTexture);
      gl.deleteTexture(imageTexture);
    };
  }, [lutData, selectedClip, splitPos, strength]);

  // Mouse / Touch handlers for split wipe
  const handlePointerDown = () => setIsDraggingSplit(true);
  const handlePointerUp = () => setIsDraggingSplit(false);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDraggingSplit || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      setSplitPos(x);
    },
    [isDraggingSplit]
  );

  return (
    <div className="w-full flex flex-col gap-3">
      {/* MONITOR FRAME (10px radius, 8px dark bezel) */}
      <div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="relative w-full aspect-video bg-monitor rounded-monitor p-2 shadow-monitor border border-white/10 select-none overflow-hidden touch-none"
      >
        <div className="relative w-full h-full rounded-[6px] overflow-hidden bg-black flex items-center justify-center">
          {errorFallback ? (
            <div className="relative w-full h-full">
              <img
                src={selectedClip}
                alt="Source footage"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-amber-900/30 mix-blend-color" />
            </div>
          ) : (
            <canvas
              ref={canvasRef}
              className="w-full h-full object-contain"
            />
          )}

          {/* SPLIT HANDLE (Draggable line and handle) */}
          <div
            style={{ left: `${splitPos * 100}%` }}
            className="absolute top-0 bottom-0 w-0.5 z-20 pointer-events-none"
          >
            <div
              onPointerDown={handlePointerDown}
              className="pointer-events-auto absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-paper text-monitor flex items-center justify-center shadow-lg cursor-ew-resize hover:scale-105 active:scale-95 transition-transform"
              aria-label="Drag split wipe position"
            >
              <div className="flex gap-0.5">
                <div className="w-0.5 h-3 bg-monitor rounded-full" />
                <div className="w-0.5 h-3 bg-monitor rounded-full" />
              </div>
            </div>
          </div>

          {/* SPLIT LABELS */}
          <div className="absolute top-4 left-4 z-10 px-2 py-1 rounded bg-black/60 backdrop-blur-sm text-paper-dim text-xs font-medium">
            Ungraded Log
          </div>
          <div className="absolute top-4 right-4 z-10 px-2 py-1 rounded bg-black/60 backdrop-blur-sm text-paper font-medium text-xs flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-macbeth-orange" />
            {title} ({Math.round(strength * 100)}%)
          </div>
        </div>
      </div>

      {/* CONTROLS STRIP (Clip switcher, strength slider, reset) */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-2 text-sm text-paper-dim">
        {/* CLIP SELECTOR */}
        {showClipSwitcher && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-paper-muted">Test clip:</span>
            <div className="flex items-center gap-1">
              {availableClips.map((clip) => (
                <button
                  key={clip.id}
                  onClick={() => setSelectedClip(clip.src)}
                  className={`px-2.5 py-1 text-xs rounded transition-colors ${
                    selectedClip === clip.src
                      ? 'bg-paper text-monitor font-medium'
                      : 'bg-white/5 text-paper-dim hover:text-paper'
                  }`}
                >
                  {clip.label.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STRENGTH SLIDER */}
        <div className="flex items-center gap-3 ml-auto">
          <span className="text-xs text-paper-muted">Strength:</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={strength}
            onChange={(e) => setStrength(parseFloat(e.target.value))}
            className="w-28 accent-tally cursor-pointer"
            aria-label="LUT strength slider"
          />
          <span className="text-xs tabular-nums text-paper w-8 text-right">
            {Math.round(strength * 100)}%
          </span>
          <button
            onClick={() => {
              setSplitPos(0.5);
              setStrength(1.0);
            }}
            title="Reset viewer"
            className="p-1 text-paper-muted hover:text-paper"
            aria-label="Reset split wipe and strength"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
