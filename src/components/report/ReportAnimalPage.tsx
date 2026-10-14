import React, { useState } from 'react';
import {
  AlertTriangle,
  MapPin,
  Clock,
  Camera,
  ShieldCheck,
  CheckCircle2,
  Navigation,
  Loader2,
  Info,
  HelpCircle,
  ArrowRight,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import {
  AnimalCategory,
  DistressProblem,
  UrgencyLevel,
  DistressReport
} from '../../types';
import { ImageUpload } from '../common/ImageUpload';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { NavTab } from '../common/Navbar';

interface ReportAnimalPageProps {
  onSelectTab: (tab: NavTab) => void;
  onViewReport: (reportId: string) => void;
}

const ANIMAL_CATEGORIES: { id: AnimalCategory; label: string; icon: string }[] = [
  { id: 'dog', label: 'Dog / Puppy', icon: '🐕' },
  { id: 'cat', label: 'Cat / Kitten', icon: '🐈' },
  { id: 'cow', label: 'Cow / Bull', icon: '🐄' },
  { id: 'buffalo', label: 'Buffalo', icon: '🐃' },
  { id: 'goat', label: 'Goat', icon: '🐐' },
  { id: 'sheep', label: 'Sheep', icon: '🐑' },
  { id: 'horse', label: 'Horse / Donkey', icon: '🐎' },
  { id: 'bird', label: 'Bird / Raptor', icon: '🦅' },
  { id: 'rabbit', label: 'Rabbit', icon: '🐇' },
  { id: 'wildlife', label: 'Wildlife / Reptile', icon: '🦌' },
  { id: 'other', label: 'Other Animal', icon: '🐾' }
];

const OBSERVED_PROBLEMS: { id: DistressProblem; label: string; description: string }[] = [
  { id: 'road_accident', label: 'Road Accident', description: 'Hit by vehicle, fractured limb, or lying on transit lane' },
  { id: 'bleeding', label: 'Severe Bleeding', description: 'Active open wound, lacerations, or puncture trauma' },
  { id: 'injured', label: 'Physical Injury / Limping', description: 'Unable to bear weight, wound or eye injury' },
  { id: 'trapped', label: 'Trapped / Entangled', description: 'Stuck in manja string, well, drain, wire fence, or motor' },
  { id: 'sick', label: 'Severe Illness', description: 'High fever, vomiting, diarrhea, lethargy, skin mange' },
  { id: 'unable_to_move', label: 'Unable to Stand / Paralyzed', description: 'Recumbent, spinal trauma, or extreme weakness' },
  { id: 'suspected_poisoning', label: 'Suspected Poisoning', description: 'Frothing at mouth, seizures, tremors, sudden collapse' },
  { id: 'abandoned', label: 'Abandoned Litter / Newborns', description: 'Orphaned pups/kittens without mother in exposed area' },
  { id: 'unsafe_situation', label: 'Cruelty / Unsafe Hazard', description: 'Abuse, tied without water, or construction hazard' },
  { id: 'other', label: 'Other Emergency', description: 'Specific animal distress circumstance' }
];

export const ReportAnimalPage: React.FC<ReportAnimalPageProps> = ({
  onSelectTab,
  onViewReport
}) => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  // Form State
  const [animalCategory, setAnimalCategory] = useState<AnimalCategory>('dog');
  const [observedProblem, setObservedProblem] = useState<DistressProblem>('road_accident');
  const [urgency, setUrgency] = useState<UrgencyLevel>('high');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [latitude, setLatitude] = useState<number | undefined>(undefined);
  const [longitude, setLongitude] = useState<number | undefined>(undefined);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [consentAccepted, setConsentAccepted] = useState(true);

  // Status & Validation
  const [detectingGps, setDetectingGps] = useState(false);
  const [gpsSuccess, setGpsSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState<DistressReport | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // GPS Geolocation Handler
  const handleDetectGps = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser.', 'error');
      return;
    }

    setDetectingGps(true);
    navigator.geolocation.getCurrentPosition(
      position => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLatitude(lat);
        setLongitude(lng);
        setGpsSuccess(true);
        setDetectingGps(false);
        showToast('Exact GPS coordinates captured successfully!', 'success');

        if (!address) {
          setAddress(`Incident Location (Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)})`);
        }
      },
      error => {
        setDetectingGps(false);
        setGpsSuccess(false);
        let msg = 'Could not access GPS. Please type the incident address manually.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission was denied. You can enter the street address or landmark manually below.';
        }
        showToast(msg, 'warning');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!description.trim()) {
      errs.description = 'Please describe the animal’s visible condition and circumstances.';
    } else if (description.trim().length < 15) {
      errs.description = 'Please provide at least 15 characters of detail for rescue triage.';
    }

    if (!address.trim()) {
      errs.address = 'Please provide the incident address or click "Detect My Location".';
    }

    if (!consentAccepted) {
      errs.consent = 'Please confirm that the information provided is truthful for rescue dispatch.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Please fix the highlighted fields before submitting.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const payload: Partial<DistressReport> = {
        animalCategory,
        observedProblem,
        urgency,
        description: description.trim(),
        location: {
          address: address.trim(),
          latitude,
          longitude,
          landmark: landmark.trim()
        },
        incidentDateTime: new Date().toISOString(),
        imageUrl: imageUrl || undefined,
        reporter: {
          id: currentUser.id,
          name: isAnonymous ? 'Anonymous Citizen' : currentUser.name,
          isAnonymous,
          contactMasked: isAnonymous ? undefined : currentUser.phoneMasked
        }
      };

      const result = await api.createReport(payload);
      setSubmittedReport(result);
      showToast(`Report ${result.id} submitted to Petgram Rescue Network!`, 'success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      showToast(err.message || 'Failed to submit report. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // If report submitted successfully, show Confirmation Screen
  if (submittedReport) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 animate-in fade-in zoom-in-95">
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-emerald-200 space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Report Successfully Dispatched
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900">
              Thank You for Being a Good Samaritan
            </h1>
            <p className="text-sm text-slate-600 max-w-xl mx-auto">
              Your report has been logged to the Petgram database and is visible to nearby veterinary ambulances, animal welfare NGOs, and community volunteers.
            </p>
          </div>

          {/* Reference ID card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-left space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
              <div>
                <p className="text-xs text-slate-500 font-semibold">Incident Reference ID</p>
                <p className="text-xl font-mono font-extrabold text-emerald-800">{submittedReport.id}</p>
              </div>
              <div>
                <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold uppercase">
                  Status: {submittedReport.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 pt-1">
              <div>
                <span className="font-bold text-slate-700">Animal: </span>
                <span className="capitalize">{submittedReport.animalCategory}</span> ({submittedReport.observedProblem.replace('_', ' ')})
              </div>
              <div>
                <span className="font-bold text-slate-700">Urgency: </span>
                <span className="uppercase font-semibold text-rose-700">{submittedReport.urgency}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="font-bold text-slate-700">Location: </span>
                <span>{submittedReport.location.address}</span>
              </div>
            </div>
          </div>

          {/* Actionable Next Steps */}
          <div className="text-left bg-emerald-50/60 rounded-2xl p-6 border border-emerald-200/80 space-y-3">
            <h4 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              Immediate On-Ground Guidance While Help is Contacted:
            </h4>
            <ul className="text-xs text-emerald-900 space-y-2 list-disc pl-5">
              <li>
                <strong>Do not leave animal unattended if safe:</strong> Street animals in shock often wander onto highway traffic lanes. Keep an eye from a safe distance of 5-10 meters.
              </li>
              <li>
                <strong>Keep bystanders calm:</strong> Crowding causes injured animals to panic, triggering defensive biting or running into danger.
              </li>
              <li>
                <strong>Do not give human medicines:</strong> Never administer paracetamol, aspirin, or milk to traumatized animals.
              </li>
              <li>
                <strong>Consult AI First-Aid:</strong> Get instant, safe non-invasive guidance for this specific animal and problem.
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 justify-center pt-2">
            <button
              onClick={() => onSelectTab('nearby')}
              className="px-5 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md flex items-center gap-2"
            >
              <MapPin className="w-4 h-4" />
              <span>Call Nearby Veterinary Hospital</span>
            </button>

            <button
              onClick={() => onSelectTab('firstaid')}
              className="px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Get AI First-Aid Protocol</span>
            </button>

            <button
              onClick={() => onSelectTab('activity')}
              className="px-5 py-3 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs"
            >
              View in My Reports
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Animal Distress Intake Portal</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Report an Injured, Sick, or Trapped Animal
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
          Provide as much accurate detail as possible. Petgram routes this report to animal rescue organizations, shelters, and emergency ambulances in your vicinity.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-md space-y-8">
        {/* Step 1: Animal Category */}
        <div className="space-y-3">
          <label className="block text-sm font-bold text-slate-900">
            1. What kind of animal is in distress? <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {ANIMAL_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setAnimalCategory(cat.id)}
                className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                  animalCategory === cat.id
                    ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-bold ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <span className="text-xl shrink-0">{cat.icon}</span>
                <span className="text-xs leading-tight">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Observed Problem */}
        <div className="space-y-3">
          <label className="block text-sm font-bold text-slate-900">
            2. What is the observed problem? <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {OBSERVED_PROBLEMS.map(prob => (
              <button
                key={prob.id}
                type="button"
                onClick={() => setObservedProblem(prob.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  observedProblem === prob.id
                    ? 'border-orange-500 bg-orange-50/70 text-slate-900 font-bold ring-2 ring-orange-400/20'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <p className="text-xs font-bold text-slate-900">{prob.label}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{prob.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Step 3: Urgency Level */}
        <div className="space-y-3">
          <label className="block text-sm font-bold text-slate-900">
            3. Urgency Level <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { id: 'critical', label: 'Critical', desc: 'Profuse bleeding, road hit, unconscious' },
              { id: 'high', label: 'High', desc: 'Severe fracture, severe pain, trapped' },
              { id: 'medium', label: 'Medium', desc: 'Limping, deep mange, abandoned' },
              { id: 'low', label: 'Low', desc: 'Minor scratch, safe location' }
            ].map(urg => (
              <button
                key={urg.id}
                type="button"
                onClick={() => setUrgency(urg.id as UrgencyLevel)}
                className={`p-3 rounded-xl border text-center transition-all ${
                  urgency === urg.id
                    ? urg.id === 'critical'
                      ? 'border-rose-600 bg-rose-50 text-rose-900 font-bold ring-2 ring-rose-500/20'
                      : 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-500/20'
                    : 'border-slate-200 text-slate-700'
                }`}
              >
                <p className="text-xs font-bold uppercase">{urg.label}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{urg.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Step 4: Photo Upload */}
        <div className="space-y-2">
          <ImageUpload
            value={imageUrl}
            onChange={setImageUrl}
            label="4. Animal Photograph (Evidence & Triage)"
          />
        </div>

        {/* Step 5: Incident Location */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-bold text-slate-900">
              5. Incident Location <span className="text-rose-500">*</span>
            </label>
            <button
              type="button"
              onClick={handleDetectGps}
              disabled={detectingGps}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors flex items-center gap-1.5"
            >
              {detectingGps ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Locating via GPS...</span>
                </>
              ) : (
                <>
                  <Navigation className="w-3.5 h-3.5" />
                  <span>{gpsSuccess ? 'GPS Coordinates Locked ✓' : 'Detect My GPS Location'}</span>
                </>
              )}
            </button>
          </div>

          <input
            type="text"
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder="e.g. Near Pillar 18, Cyber Towers Junction, Hitec City Road"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
          {errors.address && <p className="text-xs text-rose-600 font-medium">{errors.address}</p>}

          <input
            type="text"
            value={landmark}
            onChange={e => setLandmark(e.target.value)}
            placeholder="Specific landmark or spot description (e.g., Under the neem tree opposite SBI ATM)"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Step 6: Description */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-900">
            6. Visible Condition & Circumstances <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe visible wounds, bleeding, whether the animal can walk, presence of mother (if babies), behavior (scared/aggressive), etc."
            className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
          {errors.description && <p className="text-xs text-rose-600 font-medium">{errors.description}</p>}
          <p className="text-xs text-slate-500">
            Include behavioral signs like panting, shivering, or defensive growling to help responders bring proper safety gear.
          </p>
        </div>

        {/* Step 7: Privacy & Reporter Identity */}
        <div className="pt-2 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-900">Reporter Privacy Controls</p>
              <p className="text-xs text-slate-500">
                Reporting as: <strong className="text-slate-800">{currentUser.name}</strong> ({currentUser.email})
              </p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={e => setIsAnonymous(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
              />
              <span>Submit Anonymously</span>
            </label>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl text-xs text-slate-600 space-y-2 border border-slate-200/80">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={consentAccepted}
                onChange={e => setConsentAccepted(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4 shrink-0"
              />
              <span>
                I confirm this report represents a genuine animal in need. I understand that false or prank emergency reports divert critical rescue ambulances from real life-or-death cases.
              </span>
            </label>
            {errors.consent && <p className="text-xs text-rose-600 font-bold">{errors.consent}</p>}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-600 to-rose-600 hover:from-orange-700 hover:to-rose-700 text-white font-bold text-base shadow-xl shadow-orange-950/20 flex items-center justify-center gap-2 disabled:opacity-70 transition-all cursor-pointer active:scale-[0.99]"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Broadcasting to Petgram Rescue Grid...</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-5 h-5" />
                <span>Submit Distress Report & Alert Responders</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
