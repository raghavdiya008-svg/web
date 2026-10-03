import { MetadataRoute } from 'next';
import { EDITX_VAULT_CATALOG } from '@/data/vault_catalog';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://editxvault.vercel.app';
  const now = new Date();

  // Static high-priority pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/today`, lastModified: now, changeFrequency: 'daily', priority: 0.95 },
    { url: `${baseUrl}/vault`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/submit`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/legal/licenses`, lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${baseUrl}/legal/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${baseUrl}/legal/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${baseUrl}/legal/dmca`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
  ];

  // Dynamic asset catalog entries
  const dropPages: MetadataRoute.Sitemap = EDITX_VAULT_CATALOG.map((drop) => ({
    url: `${baseUrl}/vault?q=${encodeURIComponent(drop.title)}`,
    lastModified: new Date(drop.scheduled_for),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticPages, ...dropPages];
}