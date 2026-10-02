export async function notifyDiscordBot(drop: { id: string; title: string; categories: { name: string } }) {
  const webhookUrl = process.env.DISCORD_BOT_WEBHOOK_URL;
  if (!webhookUrl) return;

  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'NEW_DROP',
      drop: {
        id: drop.id,
        title: drop.title,
        category: drop.categories?.name,
        url: `${process.env.NEXT_PUBLIC_APP_URL}/today`,
      },
    }),
  });
}