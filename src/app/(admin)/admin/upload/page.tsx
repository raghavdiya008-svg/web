'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Upload,
  FileCheck,
  Check,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';

const STEPS = ['Upload Binary', 'Asset Metadata', 'Preview & Stems', 'Schedule Release'];

export default function UploadPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileName, setFileName] = useState('');

  // Form data
  const [formData, setFormData] = useState({
    title: '',
    category: 'sfx',
    license: 'MIT',
    format: 'WAV',
    sizeBytes: 142000000,
    description: '',
    compatibleSoftware: 'Adobe Premiere Pro, DaVinci Resolve, After Effects, CapCut',
    instructions: 'Unzip stems directly into your timeline.',
    scheduledDate: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
  });

  const handleSimulateFileDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          toast.success(`Binary uploaded: ${file.name}`);
          return 100;
        }
        return prev + 25;
      });
    }, 200);
  };

  const handlePublish = async () => {
    toast.success('Asset uploaded and added to the drop queue!');
    router.push('/admin/drops');
  };

  return (
    <div className="max-w-[760px] mx-auto space-y-10">
      {/* HEADER */}
      <div className="space-y-3 pb-6 border-b border-[#1A1A1A]">
        <span className="font-mono text-[10px] text-[#3F3F46] uppercase tracking-wider block">
          Asset Intake Pipeline
        </span>
        <h1 className="font-display text-2xl lg:text-3xl text-white tracking-tight">
          Upload New Daily Drop
        </h1>
      </div>

      {/* STEP PROGRESS BAR */}
      <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-4">
        {STEPS.map((step, idx) => (
          <div key={step} className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-[2px] font-mono text-xs flex items-center justify-center ${
                currentStep === idx
                  ? 'bg-accent text-[#0A0A0A] font-bold'
                  : currentStep > idx
                  ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                  : 'bg-[#1A1A1A] text-[#71717A]'
              }`}
            >
              {currentStep > idx ? <Check size={12} /> : idx + 1}
            </span>
            <span
              className={`hidden sm:inline font-mono text-xs ${
                currentStep === idx ? 'text-white' : 'text-[#71717A]'
              }`}
            >
              {step}
            </span>
          </div>
        ))}
      </div>

      {/* STEP 1: FILE DRAG & DROP */}
      {currentStep === 0 && (
        <div className="space-y-6">
          <div className="border-2 border-dashed border-[#1A1A1A] hover:border-accent/40 transition-colors p-12 text-center rounded-[2px] bg-[#111111] space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#1A1A1A] mx-auto flex items-center justify-center text-accent">
              <Upload size={20} />
            </div>
            <div>
              <p className="text-white font-medium text-sm">Drag and drop package archive here</p>
              <p className="font-mono text-xs text-[#71717A] mt-1">
                ZIP, WAV, MP3, CUBE, JSON, or MOV up to 500MB
              </p>
            </div>
            <input
              type="file"
              onChange={handleSimulateFileDrop}
              className="hidden"
              id="file-upload-input"
            />
            <label
              htmlFor="file-upload-input"
              className="inline-block px-4 py-2 border border-[#2A2A2A] hover:border-accent text-xs font-mono text-white rounded-[2px] cursor-pointer transition-colors"
            >
              Browse Local Files
            </label>
          </div>

          {fileName && (
            <div className="bg-[#111111] border border-[#1A1A1A] p-4 rounded-[2px] space-y-2">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-white flex items-center gap-2">
                  <FileCheck size={14} className="text-accent" />
                  {fileName}
                </span>
                <span className="text-accent">{uploadProgress}%</span>
              </div>
              <div className="w-full h-1 bg-[#1A1A1A] rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <Button
              variant="primary"
              onClick={() => setCurrentStep(1)}
              disabled={uploadProgress < 100 && !fileName}
              className="gap-2"
            >
              Next: Metadata
              <ArrowRight size={14} />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: METADATA */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block font-mono text-xs text-[#71717A] uppercase">Asset Title *</label>
            <input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Cinematic Sub Bass & Impact Suite 01"
              className="w-full px-4 py-3 bg-[#111111] border border-[#1A1A1A] text-white text-sm rounded-[2px] focus:outline-none focus:border-accent"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block font-mono text-xs text-[#71717A] uppercase">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 bg-[#111111] border border-[#1A1A1A] text-white text-sm rounded-[2px] focus:outline-none focus:border-accent"
              >
                <option value="sfx">SFX Packs</option>
                <option value="luts">Color Grading LUTs</option>
                <option value="contracts">Contracts & Templates</option>
                <option value="animations">Animation Presets</option>
                <option value="overlays">Motion Overlays</option>
                <option value="hooks">Hook Scripts</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block font-mono text-xs text-[#71717A] uppercase">License</label>
              <select
                value={formData.license}
                onChange={(e) => setFormData({ ...formData, license: e.target.value })}
                className="w-full px-4 py-3 bg-[#111111] border border-[#1A1A1A] text-white text-sm rounded-[2px] focus:outline-none focus:border-accent"
              >
                <option value="MIT">MIT License</option>
                <option value="Apache-2.0">Apache 2.0</option>
                <option value="CC0">CC0 (Public Domain)</option>
                <option value="CC-BY-4.0">CC-BY 4.0</option>
                <option value="EditX-Community">EditX Community</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block font-mono text-xs text-[#71717A] uppercase">Description</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what's in the pack..."
              className="w-full px-4 py-3 bg-[#111111] border border-[#1A1A1A] text-white text-sm rounded-[2px] focus:outline-none focus:border-accent"
            />
          </div>

          <div className="space-y-2">
            <label className="block font-mono text-xs text-[#71717A] uppercase">
              Compatible Software (comma separated)
            </label>
            <input
              value={formData.compatibleSoftware}
              onChange={(e) => setFormData({ ...formData, compatibleSoftware: e.target.value })}
              className="w-full px-4 py-3 bg-[#111111] border border-[#1A1A1A] text-white text-sm rounded-[2px] focus:outline-none focus:border-accent"
            />
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="ghost" onClick={() => setCurrentStep(0)} className="gap-2">
              <ArrowLeft size={14} /> Back
            </Button>
            <Button variant="primary" onClick={() => setCurrentStep(2)} className="gap-2">
              Next: Preview Generator <ArrowRight size={14} />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: PREVIEW & STEMS */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="bg-[#111111] border border-[#1A1A1A] p-6 rounded-[2px] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]">
              <span className="font-mono text-xs text-white">Waveform & Preview Generator</span>
              <span className="font-mono text-[10px] text-accent">Auto-analyzed</span>
            </div>
            <p className="text-xs text-[#71717A] leading-relaxed">
              We&apos;ve generated peak amplitude data and a 30-second preview stem from your uploaded binary.
            </p>
            <div className="h-16 bg-[#0A0A0A] border border-[#1A1A1A] flex items-center px-4 gap-1">
              {Array.from({ length: 40 }).map((_, i) => (
                <div
                  key={i}
                  className="w-full bg-accent/60 rounded-[1px]"
                  style={{ height: `${20 + (i % 5) * 15}%` }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block font-mono text-xs text-[#71717A] uppercase">
              Usage Instructions (Markdown)
            </label>
            <textarea
              rows={3}
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              className="w-full px-4 py-3 bg-[#111111] border border-[#1A1A1A] text-white text-sm rounded-[2px] focus:outline-none focus:border-accent font-mono text-xs"
            />
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="ghost" onClick={() => setCurrentStep(1)} className="gap-2">
              <ArrowLeft size={14} /> Back
            </Button>
            <Button variant="primary" onClick={() => setCurrentStep(3)} className="gap-2">
              Next: Schedule & Publish <ArrowRight size={14} />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 4: SCHEDULE & PUBLISH */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div className="bg-[#111111] border border-[#1A1A1A] p-6 rounded-[2px] space-y-4">
            <div className="flex items-center gap-2 text-white font-medium text-sm">
              <Calendar size={16} className="text-accent" />
              Schedule Release Timestamp
            </div>
            <input
              type="datetime-local"
              value={formData.scheduledDate}
              onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
              className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#1A1A1A] text-white font-mono text-sm rounded-[2px] focus:outline-none focus:border-accent"
            />
            <p className="font-mono text-xs text-[#71717A]">
              Drop will go live automatically via cron engine at this exact moment.
            </p>
          </div>

          {/* SUMMARY REVIEW */}
          <div className="p-5 bg-[#0A0A0A] border border-[#1A1A1A] rounded-[2px] space-y-2 text-xs font-mono">
            <div className="text-[#3F3F46] uppercase tracking-wider mb-2">Publish Summary</div>
            <div className="flex justify-between">
              <span className="text-[#71717A]">Title</span>
              <span className="text-white">{formData.title || 'Untitled Asset'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#71717A]">Category</span>
              <span className="text-accent uppercase">{formData.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#71717A]">License</span>
              <span className="text-white">{formData.license}</span>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="ghost" onClick={() => setCurrentStep(2)} className="gap-2">
              <ArrowLeft size={14} /> Back
            </Button>
            <Button variant="primary" size="lg" onClick={handlePublish} className="gap-2">
              <Sparkles size={16} />
              Publish to Drop Queue
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}