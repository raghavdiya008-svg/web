'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Check, Send, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { toast } from 'sonner';

const CATEGORIES = [
  { id: 'sfx', name: 'SFX Packs' },
  { id: 'luts', name: 'Color Grading LUTs' },
  { id: 'contracts', name: 'Contracts & Templates' },
  { id: 'animations', name: 'Animation Presets' },
  { id: 'overlays', name: 'Motion Overlays' },
  { id: 'hooks', name: 'Hook Scripts' },
  { id: 'typography', name: 'Typography Packs' },
  { id: 'icons', name: 'Icon Sets' },
];

const LICENSES = [
  { value: 'MIT', label: 'MIT License (Permissive, Attribution Required)' },
  { value: 'Apache-2.0', label: 'Apache 2.0 (Permissive, Patent Grant)' },
  { value: 'CC0', label: 'Creative Commons CC0 (Public Domain)' },
  { value: 'CC-BY-4.0', label: 'Creative Commons CC-BY 4.0' },
  { value: 'OFL', label: 'SIL Open Font License (Fonts only)' },
  { value: 'EditX-Community', label: 'EditX Community License' },
];

const submissionSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(120),
  category: z.string().min(1, 'Please select a category'),
  discord_username: z.string().min(2, 'Enter your Discord username for credit'),
  source_url: z.string().url('Must be a valid URL (Google Drive, GitHub, Dropbox)').optional().or(z.literal('')),
  license: z.string().min(1, 'Please select a license'),
  description: z.string().min(20, 'Description must be at least 20 characters').max(2000),
  confirm_license: z.boolean().refine((val) => val === true, {
    message: 'You must confirm license distribution rights',
  }),
});

type SubmissionForm = z.infer<typeof submissionSchema>;

export default function SubmitPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SubmissionForm>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      license: 'MIT',
      category: 'sfx',
      confirm_license: false,
    },
  });

  const onSubmit = async (data: SubmissionForm) => {
    setLoading(true);
    try {
      // In production calls Supabase or mock submission endpoint
      await new Promise((r) => setTimeout(r, 800));
      setSubmitted(true);
      toast.success('Submission received! Our team will review it within 48 hours.');
    } catch (err: any) {
      toast.error(err.message ?? 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-[1280px] mx-auto px-5 lg:px-8 py-24 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 bg-[#06B6D4]/10 border border-[#06B6D4]/40 flex items-center justify-center text-accent mb-6 rounded-[2px]">
          <Check size={24} />
        </div>
        <h1 className="font-display text-3xl md:text-4xl text-white mb-4">Submission Received</h1>
        <p className="text-sm text-[#71717A] max-w-md mb-8 leading-relaxed">
          Thanks for contributing to the Vault. Our curation team will review the asset and ping your Discord account once approved.
        </p>
        <div className="flex gap-4">
          <Button onClick={() => setSubmitted(false)} variant="outline">
            Submit Another Asset
          </Button>
          <Link href="/vault">
            <Button variant="primary">Browse Vault</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[720px] mx-auto px-5 lg:px-8 py-14 space-y-10">
      {/* HEADER */}
      <div className="space-y-3 pb-8 border-b border-[#1A1A1A]">
        <span className="font-mono text-[10px] tracking-[0.15em] text-[#3F3F46] uppercase block">
          Community Contributions
        </span>
        <h1 className="font-display text-3xl md:text-4xl text-white tracking-tight">
          Submit an Asset
        </h1>
        <p className="text-sm text-[#71717A] leading-relaxed">
          Have an SFX pack, LUT, preset, or template that editors need? Submit it for review. Approved drops will be credited to your Discord handle in the daily announcement.
        </p>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* ASSET TITLE */}
        <div className="space-y-2">
          <label className="block font-mono text-[11px] text-[#71717A] uppercase tracking-wider">
            Asset Title *
          </label>
          <input
            {...register('title')}
            placeholder="e.g. 16mm Analog Film Grain 4K"
            className="w-full px-4 py-3 bg-[#111111] border border-[#1A1A1A] text-white placeholder-[#3F3F46] text-sm font-body rounded-[2px] focus:outline-none focus:border-accent transition-colors"
          />
          {errors.title && (
            <p className="font-mono text-xs text-red-400">{errors.title.message}</p>
          )}
        </div>

        {/* CATEGORY & LICENSE ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block font-mono text-[11px] text-[#71717A] uppercase tracking-wider">
              Category *
            </label>
            <select
              {...register('category')}
              className="w-full px-4 py-3 bg-[#111111] border border-[#1A1A1A] text-white text-sm rounded-[2px] focus:outline-none focus:border-accent transition-colors"
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#111111] text-white">
                  {c.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="font-mono text-xs text-red-400">{errors.category.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block font-mono text-[11px] text-[#71717A] uppercase tracking-wider">
              License *
            </label>
            <select
              {...register('license')}
              className="w-full px-4 py-3 bg-[#111111] border border-[#1A1A1A] text-white text-sm rounded-[2px] focus:outline-none focus:border-accent transition-colors"
            >
              {LICENSES.map((lic) => (
                <option key={lic.value} value={lic.value} className="bg-[#111111] text-white">
                  {lic.label}
                </option>
              ))}
            </select>
            {errors.license && (
              <p className="font-mono text-xs text-red-400">{errors.license.message}</p>
            )}
          </div>
        </div>

        {/* DISCORD USERNAME & SOURCE URL */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block font-mono text-[11px] text-[#71717A] uppercase tracking-wider">
              Your Discord Username *
            </label>
            <input
              {...register('discord_username')}
              placeholder="e.g. alex_editor#0000"
              className="w-full px-4 py-3 bg-[#111111] border border-[#1A1A1A] text-white placeholder-[#3F3F46] text-sm font-mono rounded-[2px] focus:outline-none focus:border-accent transition-colors"
            />
            {errors.discord_username && (
              <p className="font-mono text-xs text-red-400">{errors.discord_username.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block font-mono text-[11px] text-[#71717A] uppercase tracking-wider">
              Source URL (Drive / GitHub / Dropbox)
            </label>
            <input
              {...register('source_url')}
              placeholder="https://..."
              className="w-full px-4 py-3 bg-[#111111] border border-[#1A1A1A] text-white placeholder-[#3F3F46] text-sm font-mono rounded-[2px] focus:outline-none focus:border-accent transition-colors"
            />
            {errors.source_url && (
              <p className="font-mono text-xs text-red-400">{errors.source_url.message}</p>
            )}
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="space-y-2">
          <label className="block font-mono text-[11px] text-[#71717A] uppercase tracking-wider">
            Description & Notes for Curation Team *
          </label>
          <textarea
            {...register('description')}
            rows={5}
            placeholder="Tell us what makes this asset special, format details, and recommended workflow..."
            className="w-full px-4 py-3 bg-[#111111] border border-[#1A1A1A] text-white placeholder-[#3F3F46] text-sm rounded-[2px] focus:outline-none focus:border-accent transition-colors resize-none leading-relaxed"
          />
          {errors.description && (
            <p className="font-mono text-xs text-red-400">{errors.description.message}</p>
          )}
        </div>

        {/* LICENSE CONFIRMATION CHECKBOX */}
        <div className="p-4 bg-[#111111] border border-[#1A1A1A] rounded-[2px] flex items-start gap-3">
          <input
            type="checkbox"
            id="confirm_license"
            {...register('confirm_license')}
            className="mt-1 w-4 h-4 accent-[#06B6D4] bg-[#0A0A0A] border-[#1A1A1A] rounded-[2px] cursor-pointer"
          />
          <label htmlFor="confirm_license" className="text-xs text-[#71717A] leading-relaxed cursor-pointer select-none">
            I confirm that I hold the necessary rights to distribute this asset under the chosen license, and that it contains no infringing third-party material.
            {errors.confirm_license && (
              <span className="block text-red-400 mt-1 font-mono">{errors.confirm_license.message}</span>
            )}
          </label>
        </div>

        {/* SUBMIT BUTTON */}
        <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full gap-2 font-medium">
          <Send size={15} />
          Submit Asset for Review
        </Button>
      </form>
    </div>
  );
}