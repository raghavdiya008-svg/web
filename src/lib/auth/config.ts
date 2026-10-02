import NextAuth from 'next-auth';
import Discord from 'next-auth/providers/discord';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { encrypt, decrypt } from '@/lib/utils/crypto';
import { verifyGuildMembership } from '@/lib/auth/discord';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      authorization: {
        params: { scope: 'identify guilds' },
      },
      profile(profile) {
        return {
          id: profile.id,
          name: profile.username,
          email: profile.email,
          image: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`,
          discordId: profile.id,
          discordUsername: profile.username,
          discordAvatar: profile.avatar,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile, trigger, session }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.discordId = profile?.discordId as string;
        token.discordUsername = profile?.discordUsername as string;
        token.discordAvatar = profile?.discordAvatar as string;
      }

      if (trigger === 'update' && session) {
        token.isServerMember = session.user.isServerMember;
        token.role = session.user.role;
      }

      // Refresh guild membership check every hour
      if (token.accessToken && Date.now() > ((token.guildCheckedAt as number) ?? 0) + 3600_000) {
        const isMember = await verifyGuildMembership(token.accessToken as string);
        token.isServerMember = isMember;
        token.guildCheckedAt = Date.now();

        // Sync to Supabase
        const supabase = createSupabaseServerClient();
        await supabase
          .from('users')
          .update({ is_server_member: isMember, last_seen_at: new Date().toISOString() })
          .eq('discord_id', token.discordId as string);
      }

      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.sub as string,
        discordId: token.discordId as string,
        discordUsername: token.discordUsername as string,
        discordAvatar: token.discordAvatar as string,
        isServerMember: token.isServerMember as boolean ?? false,
        role: token.role as any ?? 'member',
      };
      return session;
    },
    async signIn({ user, account, profile }) {
      if (!account?.access_token) return false;

      const isMember = await verifyGuildMembership(account.access_token);
      const supabase = createSupabaseServerClient();

      // Upsert user
      const { error } = await supabase.from('users').upsert({
        discord_id: user.id as string,
        discord_username: user.name as string,
        discord_avatar: user.image as string,
        discord_access_token: encrypt(account.access_token),
        discord_refresh_token: account.refresh_token ? encrypt(account.refresh_token) : null,
        is_server_member: isMember,
        email: user.email,
        last_seen_at: new Date().toISOString(),
      }, { onConflict: 'discord_id' });

      if (error) {
        console.error('User upsert failed:', error);
        return false;
      }

      return true;
    },
  },
  pages: {
    signIn: '/',
    error: '/',
  },
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
  cookies: {
    sessionToken: { name: 'editx-session', options: { httpOnly: true, secure: true, sameSite: 'lax', path: '/' } },
  },
});