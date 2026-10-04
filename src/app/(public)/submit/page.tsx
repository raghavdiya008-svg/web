'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Check, UploadCloud, FileCheck, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const CATEGORIES = [
  { id: 'luts', name: 'Color Grading LUTs (.cube)' },
  { id: 'sfx', name: 'Sound FX & Audio Stems (.wav)' },
  { id: 'overlays', name: 'Film Grain & Mattes (ProRes / PNG)' },
  { id: 'animations', name: 'Kinetic & Motion Presets (Lottie / JSON)' },
  { id: 'typography', name: 'Typography Suites (.otf / .ttf)' },
  { id: 'contracts', name: 'Production Contracts & Specs (.md)' },
];

const LICENSES = [
  { value: 'CC0', label: 'Creative Commons CC0 1.0 (Public Domain Dedication)' },
  { value: 'MIT', label: 'MIT Open License (Permissive Commercial Use)' },
  { value: 'OFL', label: 'SIL Open Font License (Fonts only)' },
];

const submissionSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(120),
  category: z.string().min(1, 'Please select an asset category'),
  discord_username: z.string().min(2, 'Enter your Discord username for verification and credit'),
  source_url: z.string().url('Must be a valid cloud download URL (Dropbox, Drive, GitHub)').optional().or(z.literal('')),
  license: z.string().min(1, 'Please select a license'),
  description: z.string().min(20, 'Please provide at least 20 characters describing the technical specs').max(2000),
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
  } = useForm<SubmissionForm>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      license: 'CC0',
      category: 'luts',
      confirm_license: false,
    },
  });

  const onSubmit = async (data: SubmissionForm) => {
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      setSubmitted(true);
      toast.success('Asset specimen received for calibration check.');
    } catch (err: any) {
      toast.error(err.message ?? 'Submission error.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-[800px] mx-auto px-6 lg:px-10 py-28 flex flex-col items-start gap-6 text-left">
        <div className="w-12 h-12 rounded bg-white/10 flex items-center justify-center text-paper">
          <FileCheck className="w-6 h-6 text-macbeth-orange" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-paper">
            Asset specimen submitted
          </h1>
          <p className="text-base text-paper-dim max-w-lg leading-relaxed">
            Thank you for contributing to the open vault. Our studio will calibrate the package, verify checksums, and publish it with credit to your Discord handle.
          </p>
        </div>

        <div className="flex items-center gap-4 pt-4">
          <button
            onClick={() => setSubmitted(false)}
            className="px-5 py-2.5 rounded bg-white/10 text-paper text-sm font-semibold hover:bg-white/20 transition-colors"
          >
            Submit another specimen
          </button>
          <Link
            href="/vault"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-paper text-monitor text-sm font-semibold hover:bg-white transition-colors"
          >
            Browse vault reels
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[840px] mx-auto px-6 lg:px-10 pt-24 pb-28">
      {/* HEADER */}
      <div className="space-y-3 pb-8 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-macbeth-orange" />
          <span className="text-xs font-semibold text-macbeth-orange uppercase tracking-wider">
            Open Submission Pipeline
          </span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-paper">
          Submit a creative specimen
        </h1>
        <p className="text-base text-paper-dim leading-relaxed">
          Created a high-fidelity LUT, analog sound stem, film grain plate, or motion preset? Submit it to the public archive. All accepted assets remain 100% free with creator attribution.
        </p>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pt-8">
        {/* ASSET TITLE */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-paper uppercase tracking-wider">
            Asset Title *
          </label>
          <input
            {...register('title')}
            placeholder="e.g. 16mm Vision3 250D Analog Grain Plate"
            className="w-full px-4 py-3 bg-suite-deep border border-white/10 text-paper placeholder-paper-muted text-sm rounded focus:outline-none focus:border-paper transition-colors"
          />
          {errors.title && (
            <p className="text-xs text-red-400">{errors.title.message}</p>
          )}
        </div>

        {/* CATEGORY & LICENSE ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-paper uppercase tracking-wider">
              Category *
            </label>
            <select
              {...register('category')}
              className="w-full px-4 py-3 bg-suite-deep border border-white/10 text-paper text-sm rounded focus:outline-none focus:border-paper transition-colors"
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id} className="bg-suite-deep text-paper">
                  {c.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-xs text-red-400">{errors.category.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-paper uppercase tracking-wider">
              License *
            </label>
            <select
              {...register('license')}
              className="w-full px-4 py-3 bg-suite-deep border border-white/10 text-paper text-sm rounded focus:outline-none focus:border-paper transition-colors"
            >
              {LICENSES.map((lic) => (
                <option key={lic.value} value={lic.value} className="bg-suite-deep text-paper">
                  {lic.label}
                </option>
              ))}
            </select>
            {errors.license && (
              <p className="text-xs text-red-400">{errors.license.message}</p>
            )}
          </div>
        </div>

        {/* DISCORD USERNAME & SOURCE URL */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-paper uppercase tracking-wider">
              Your Discord Handle (for attribution) *
            </label>
            <input
              {...register('discord_username')}
              placeholder="e.g. editor_studio"
              className="w-full px-4 py-3 bg-suite-deep border border-white/10 text-paper placeholder-paper-muted text-sm rounded focus:outline-none focus:border-paper transition-colors"
            />
            {errors.discord_username && (
              <p className="text-xs text-red-400">{errors.discord_username.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-paper uppercase tracking-wider">
              Cloud Source URL (Dropbox / Drive / GitHub)
            </label>
            <input
              {...register('source_url')}
              placeholder="https://..."
              className="w-full px-4 py-3 bg-suite-deep border border-white/10 text-paper placeholder-paper-muted text-sm rounded focus:outline-none focus:border-paper transition-colors"
            />
            {errors.source_url && (
              <p className="text-xs text-red-400">{errors.source_url.message}</p>
            )}
          </div>
        </div>

        {/* DESCRIPTION & SPECS */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-paper uppercase tracking-wider">
            Technical Specifications & Notes *
          </label>
          <textarea
            {...register('description')}
            rows={4}
            placeholder="Bit depth, color space, sample rate, software compatibility, and recommended application instructions..."
            className="w-full px-4 py-3 bg-suite-deep border border-white/10 text-paper placeholder-paper-muted text-sm rounded focus:outline-none focus:border-paper transition-colors resize-none leading-relaxed"
          />
          {errors.description && (
            <p className="text-xs text-red-400">{errors.description.message}</p>
          )}
        </div>

        {/* LICENSE CONFIRMATION CHECKBOX */}
        <div className="p-4 bg-suite-deep/60 border border-white/10 rounded flex items-start gap-3">
          <input
            type="checkbox"
            id="confirm_license"
            {...register('confirm_license')}
            className="mt-1 w-4 h-4 accent-tally cursor-pointer"
          />
          <label htmlFor="confirm_license" className="text-xs text-paper-dim leading-relaxed cursor-pointer select-none">
            I confirm that I hold full distribution rights for this asset specimen, and authorize its release into EditX Vault under the chosen open-source license.
            {errors.confirm_license && (
              <span className="block text-red-400 mt-1">{errors.confirm_license.message}</span>
            )}
          </label>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-paper text-monitor font-bold text-sm rounded hover:bg-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <UploadCloud className="w-4 h-4" />
          {loading ? 'Transmitting specimen...' : 'Submit Specimen for Calibration Review'}
        </button>
      </form>
    </div>
  );
}