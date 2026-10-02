import { ImageResponse } from 'next/og';

export async function GET(request: Request, { params }: { params: Promise<{ dropId: string }> }) {
  const { dropId } = await params;
  return new ImageResponse(
    (
      <div style={{ backgroundColor: '#0A0A0A', color: 'white', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64 }}>
        EDITX VAULT
      </div>
    ),
    { width: 1200, height: 630 }
  );
}