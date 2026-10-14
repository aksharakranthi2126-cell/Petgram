import React, { useState } from 'react';
import {
  Sparkles,
  AlertTriangle,
  ShieldCheck,
  AlertOctagon,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Loader2,
  PhoneCall,
  MapPin,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { AIFirstAidRequest, AIFirstAidResponse } from '../../types';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const QUICK_TEST_PRESETS = [
  {
    title: '🐕 Injured Indie Dog (Hit & Bleeding)',
    animalType: 'Dog',
    observedCondition: 'Road Accident & Bleeding',
    symptoms: 'Hit by two-wheeler, bleeding from hind leg, alert but whimpering, unable to stand.'
  },
  {
    title: '🦅 Kite Trapped in Manja String',
    animalType: 'Bird (Black Kite)',
    observedCondition: 'Trapped & Entangled in Glass String',
    symptoms: 'Entangled in kite thread in acacia tree branch, flapping one wing frantically.'
  },
  {
    title: '🐄 Cow with Heat Exhaustion',
    animalType: 'Cow',
    observedCondition: 'Heatstroke & Dehydration',
    symptoms: 'Open mouth breathing, excessive drooling, lying on side in sun, sunken eyes.'
  },
  {
    title: '🐱 Abandoned Hypothermic Kitten',
    animalType: 'Cat / Kitten',
    observedCondition: 'Abandoned & Severely Cold',
    symptoms: 'Found in wet drain box, eyes unopened, continuous crying, shivering.'
  }
];

export const AIFirstAidPage: React.FC = () => {
  const { showToast } = useToast();

  const [animalType, setAnimalType] = useState('Dog');
  const [observedCondition, setObservedCondition] = useState('Bleeding Wound');
  const [symptoms, setSymptoms] = useState('');
  const [location, setLocation] = useState('Local Area');

  const [loading, setLoading] = useState(false);
  const [guidance, setGuidance] = useState<AIFirstAidResponse | null>(null);

  const handleConsultAI = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!animalType || !observedCondition) {
      showToast('Please specify the animal type and condition.', 'error');
      return;
    }

    setLoading(true);
    setGuidance(null);
    try {
      const req: AIFirstAidRequest = {
        animalType,
        observedCondition,
        symptoms: symptoms.trim(),
        location
      };

      const res = await api.getGuidance(req);
      setGuidance(res);
      showToast('First-aid guidance protocol loaded.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to retrieve first-aid advice.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPreset = (p: (typeof QUICK_TEST_PRESETS)[0]) => {
    setAnimalType(p.animalType);
    setObservedCondition(p.observedCondition);
    setSymptoms(p.symptoms);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Gemini 3.8 Flash Veterinary Triage Assistant</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Emergency Animal First-Aid Guidance
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          Get safe, non-invasive triage protocols for distressed or injured animals while emergency veterinary care is en route. Designed under strict veterinary safety guidelines.
        </p>
      </div>

      {/* Safety Notice Warning */}
      <div className="bg-rose-50 border-2 border-rose-200 rounded-3xl p-5 sm:p-6 text-rose-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <AlertOctagon className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-extrabold text-rose-900">
              Crucial Safety & Medical Policy:
            </h4>
            <p className="text-xs text-rose-800 leading-relaxed">
              Petgram AI is strictly informational and does <strong>NOT</strong> substitute for a licensed veterinarian. 
              <strong> NEVER give human painkillers (Paracetamol, Aspirin, Ibuprofen)</strong> to animals—even a fraction of a human dose can trigger fatal liver/kidney collapse.
            </p>
          </div>
        </div>
        <div className="shrink-0 bg-white px-3 py-2 rounded-xl border border-rose-200 text-center">
          <p className="text-[10px] font-bold uppercase text-slate-500">Urgent Rescue</p>
          <p className="text-sm font-extrabold text-rose-600 font-mono">Dial 1962</p>
        </div>
      </div>

      {/* Input Form & Presets */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Quick Test Cases (One-Click Auto-Fill):
            </label>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {QUICK_TEST_PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(p)}
                className="text-left p-3 rounded-xl border border-slate-200 hover:border-teal-400 hover:bg-teal-50/50 text-xs font-semibold text-slate-700 transition-all"
              >
                <p className="font-bold text-slate-900 truncate">{p.title}</p>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">{p.observedCondition}</p>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleConsultAI} className="space-y-5 pt-3 border-t border-slate-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Animal Species / Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={animalType}
                onChange={e => setAnimalType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="Dog">Dog / Indie Pup</option>
                <option value="Cat">Cat / Kitten</option>
                <option value="Cow">Cow / Cattle</option>
                <option value="Buffalo">Buffalo</option>
                <option value="Bird (Avian / Raptor)">Bird (Kite, Pigeon, Owl)</option>
                <option value="Goat">Goat</option>
                <option value="Sheep">Sheep</option>
                <option value="Horse">Horse / Donkey</option>
                <option value="Rabbit">Rabbit</option>
                <option value="Wildlife">Wildlife (Deer, Monkey, Reptile)</option>
                <option value="Other Animal">Other Animal</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Observed Condition / Emergency <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={observedCondition}
                onChange={e => setObservedCondition(e.target.value)}
                placeholder="e.g., Road accident bleeding, trapped in string, convulsions..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Visible Symptoms & Situation Details
            </label>
            <textarea
              rows={3}
              value={symptoms}
              onChange={e => setSymptoms(e.target.value)}
              placeholder="Describe breathing speed, whether the animal is conscious, bleeding location, visible swelling, or signs of distress..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <p className="text-xs text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Safety-screened prompt • Non-invasive triage only</span>
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 disabled:opacity-70 transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Safety Protocol...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-teal-200" />
                  <span>Generate AI First-Aid Guidance</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Guidance Results Display */}
      {guidance && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-teal-200 shadow-xl space-y-8 animate-in fade-in zoom-in-95">
          {/* Result Source Banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  First-Aid Triage Protocol
                </h3>
                <p className="text-xs text-slate-500">Case: {animalType} — {observedCondition}</p>
              </div>
            </div>

            <div>
              {guidance.source === 'gemini-live' ? (
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold flex items-center gap-1.5 border border-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                  Live Gemini 3.8 Flash Guidance
                </span>
              ) : (
                <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold border border-amber-300">
                  DEMO GUIDANCE — NOT GENERATED BY LIVE GEMINI
                </span>
              )}
            </div>
          </div>

          {/* Summary Box */}
          <div className="bg-teal-50/70 p-4 rounded-2xl border border-teal-200/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-900 mb-1">
              Assessment Summary
            </h4>
            <p className="text-sm font-semibold text-teal-950 leading-relaxed">
              {guidance.summary}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Box 1: Immediate Safety Precautions */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                1. Immediate Safety Precautions
              </h4>
              <ul className="text-xs text-slate-700 space-y-2">
                {guidance.immediatePrecautions.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0"></span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Box 2: Safe Non-Invasive Actions */}
            <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-200 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                2. Safe Steps You Can Take
              </h4>
              <ul className="text-xs text-emerald-950 space-y-2">
                {guidance.safeActions.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 mt-1.5 shrink-0"></span>
                    <span className="leading-relaxed font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Box 3: Strictly Avoid */}
            <div className="bg-rose-50/70 p-5 rounded-2xl border border-rose-200 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-900 flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-rose-600" />
                3. Actions to Strictly Avoid (Hazardous)
              </h4>
              <ul className="text-xs text-rose-950 space-y-2">
                {guidance.actionsToAvoid.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-1.5 shrink-0"></span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Box 4: Emergency Red Flags */}
            <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-200 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                4. Critical Emergency Red Flags
              </h4>
              <ul className="text-xs text-amber-950 space-y-2">
                {guidance.emergencyRedFlags.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0"></span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommended Facilities */}
          <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-600">
              <span className="font-bold text-slate-800">Facilities to alert immediately: </span>
              <span>{guidance.recommendedServices.join(' • ')}</span>
            </div>

            <a
              href="tel:1962"
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-sm"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call Emergency Vet Helpline (1962)</span>
            </a>
          </div>

          {/* Disclaimer Footer */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
            {guidance.disclaimer}
          </div>
        </div>
      )}
    </div>
  );
};
