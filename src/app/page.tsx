import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Grand Digital Library — 3D Rotunda Asset Vault',
  description:
    'Cihannüma Archive — 16,400 tomes across Sound Design, Color LUTs, GLSL Shaders, 3D Assets, and Wasm Kernels.',
};

export default function HomePage() {
  return (
    <main className="fixed inset-0 w-screen h-screen z-50 bg-[#080a0c] overflow-hidden">
      <iframe
        src="/rotunda.html"
        className="w-full h-full border-0 block"
        title="The Grand Digital Library — 3D Rotunda Asset Vault"
        allow="autoplay; clipboard-write"
      />
    </main>
  );
}
