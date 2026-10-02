import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      discordId: string;
      discordUsername: string;
      discordAvatar: string;
      isServerMember: boolean;
      role: 'admin' | 'member' | 'banned';
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    id: string;
    discordId?: string;
    discordUsername?: string;
    discordAvatar?: string;
    isServerMember?: boolean;
    role?: 'admin' | 'member' | 'banned';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    discordId?: string;
    discordUsername?: string;
    discordAvatar?: string;
    isServerMember?: boolean;
    guildCheckedAt?: number;
    role?: 'admin' | 'member' | 'banned';
  }
}