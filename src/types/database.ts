export type UserRole = 'admin' | 'moderator' | 'contributor' | 'user' | 'banned';
export type UserStatus = 'active' | 'pending' | 'suspended' | 'banned';

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          discord_id: string;
          discord_username: string;
          discord_avatar: string | null;
          is_server_member: boolean;
          role: UserRole;
          email: string | null;
          email_notifications: boolean;
          total_downloads: number;
          created_at: string;
          updated_at: string;
          last_seen_at: string;
        };
      };
      drops: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string | null;
          category_id: string | null;
          file_url: string;
          file_size: number;
          file_format: string;
          preview_url: string | null;
          license: string;
          tags: string[];
          compatible_software: string[];
          instructions: string | null;
          scheduled_for: string;
          is_live: boolean;
          download_count: number;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
      };
    };
  };
}