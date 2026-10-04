export interface CubeLutData {
  title: string;
  size: number;
  domainMin: [number, number, number];
  domainMax: [number, number, number];
  data: Float32Array; // size * size * size * 3 or RGBA
}

export function parseCubeLut(cubeText: string): CubeLutData | null {
  const lines = cubeText.split(/\r?\n/);
  let size = 0;
  let title = 'LUT';
  let domainMin: [number, number, number] = [0, 0, 0];
  let domainMax: [number, number, number] = [1, 1, 1];
  const tableData: number[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith('#')) continue;

    if (line.startsWith('TITLE')) {
      title = line.replace(/^TITLE\s+["']?/, '').replace(/["']?$/, '');
    } else if (line.startsWith('LUT_3D_SIZE')) {
      const parts = line.split(/\s+/);
      size = parseInt(parts[1], 10);
    } else if (line.startsWith('DOMAIN_MIN')) {
      const parts = line.split(/\s+/).slice(1).map(Number);
      if (parts.length === 3) domainMin = [parts[0], parts[1], parts[2]];
    } else if (line.startsWith('DOMAIN_MAX')) {
      const parts = line.split(/\s+/).slice(1).map(Number);
      if (parts.length === 3) domainMax = [parts[0], parts[1], parts[2]];
    } else {
      const parts = line.split(/\s+/).map(Number);
      if (parts.length >= 3 && !isNaN(parts[0])) {
        tableData.push(parts[0], parts[1], parts[2]);
      }
    }
  }

  if (size <= 0 || tableData.length === 0) {
    return null;
  }

  return {
    title,
    size,
    domainMin,
    domainMax,
    data: new Float32Array(tableData),
  };
}
