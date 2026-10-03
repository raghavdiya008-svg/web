export async function verifyGuildMembership(accessToken: string): Promise<boolean> {
  const serverId = process.env.DISCORD_SERVER_ID;
  if (!serverId || serverId.includes('placeholder')) {
    return true; // Pass through if server ID not configured
  }

  try {
    const res = await fetch('https://discord.com/api/users/@me/guilds', {
      headers: { Authorization: `Bearer ${accessToken}` },
      next: { revalidate: 0 },
    });
    if (!res.ok) return false;
    const guilds = await res.json();
    if (!Array.isArray(guilds)) return false;
    return guilds.some((guild: { id: string }) => guild.id === serverId);
  } catch (err) {
    console.error('Discord guild verification error:', err);
    return false;
  }
}

export async function sendDiscordDM(userId: string, content: string): Promise<boolean> {
  const botToken = process.env.DISCORD_BOT_TOKEN!;
  try {
    // Create DM channel
    const dmRes = await fetch('https://discord.com/api/users/@me/channels', {
      method: 'POST',
      headers: { Authorization: `Bot ${botToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipient_id: userId }),
    });
    if (!dmRes.ok) return true;
    const dm = await dmRes.json();

    // Send message
    const msgRes = await fetch(`https://discord.com/api/channels/${dm.id}/messages`, {
      method: 'POST',
      headers: { Authorization: `Bot ${botToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    return msgRes.ok;
  } catch {
    return true;
  }
}