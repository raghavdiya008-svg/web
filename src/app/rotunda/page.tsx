import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Grand Digital Library — 3D Rotunda Asset Vault',
  description:
    'Explore the 3D Cihannüma Rotunda Asset Vault. 16,400+ archival tomes, sound design stems, LUTs, and GLSL shaders.',
};

export default function RotundaPage() {
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
