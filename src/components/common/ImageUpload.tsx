import React, { useRef, useState } from 'react';
import { UploadCloud, X, Image as ImageIcon, Sparkles } from 'lucide-react';

interface ImageUploadProps {
  value?: string;
  onChange: (base64OrUrl: string) => void;
  label?: string;
  required?: boolean;
}

const PRESET_SAMPLE_PHOTOS = [
  { label: 'Injured Dog', url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80' },
  { label: 'Desi Cow', url: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=800&q=80' },
  { label: 'Injured Bird', url: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=800&q=80' },
  { label: 'Lost Cat', url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80' }
];

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  label = 'Animal Photograph',
  required = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPEG, PNG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image file size exceeds 5MB limit. Please choose a smaller photo.');
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onChange(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-slate-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-xs text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" /> Remove photo
          </button>
        )}
      </div>

      {value ? (
        <div className="relative group rounded-xl overflow-hidden border-2 border-emerald-500/30 bg-slate-100 max-h-64 flex items-center justify-center">
          <img
            src={value}
            alt="Animal preview"
            className="w-full h-56 object-cover rounded-lg group-hover:scale-[1.01] transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-white text-slate-800 text-xs font-semibold rounded-lg shadow-md hover:bg-slate-50 transition-colors"
            >
              Replace Photo
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="px-3 py-1.5 bg-rose-600 text-white text-xs font-semibold rounded-lg shadow-md hover:bg-rose-700 transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 hover:border-emerald-600 rounded-xl p-6 text-center cursor-pointer transition-colors bg-white/60 hover:bg-emerald-50/30 group"
        >
          <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:scale-110 transition-transform">
            <UploadCloud className="w-6 h-6" />
          </div>
          <p className="mt-3 text-sm font-semibold text-slate-800">
            Click to upload animal photo or drag and drop
          </p>
          <p className="mt-1 text-xs text-slate-500">
            PNG, JPG, or WEBP up to 5MB. Clear close-ups help rescue teams assess injuries.
          </p>
        </div>
      )}

      {/* Quick Test Preset Selector */}
      {!value && (
        <div className="pt-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Or choose a demo test photo:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESET_SAMPLE_PHOTOS.map(sample => (
              <button
                key={sample.label}
                type="button"
                onClick={() => onChange(sample.url)}
                className="text-xs px-2.5 py-1 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-lg text-slate-700 hover:text-emerald-800 font-medium transition-colors shadow-2xs"
              >
                + {sample.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};
