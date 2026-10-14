import React, { useState, useEffect } from 'react';
import {
  Users,
  Heart,
  Truck,
  Home,
  Stethoscope,
  Camera,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Send,
  Loader2,
  Clock,
  AlertCircle,
  RefreshCw,
  Info,
  Calendar,
  MapPin,
  Check
} from 'lucide-react';
import { VolunteerApplication, VolunteerStatus } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { VolunteerStatusBadge } from '../common/Badge';

const VOLUNTEER_ROLES = [
  { id: 'rapid_rescue', label: 'Emergency Rescue & Spot Response', icon: <Truck className="w-4 h-4 text-orange-600" />, desc: 'Help reach the distress site quickly with first-aid gear' },
  { id: 'transport_pickup', label: 'Animal Transport & Ambulance Assistance', icon: <Truck className="w-4 h-4 text-emerald-600" />, desc: 'Transport injured or stray animals to veterinary hospitals' },
  { id: 'foster_care', label: 'Temporary Foster Home', icon: <Home className="w-4 h-4 text-teal-600" />, desc: 'Shelter recuperating puppies, kittens, or injured pets' },
  { id: 'veterinary_assist', label: 'Veterinary / Clinical Support', icon: <Stethoscope className="w-4 h-4 text-sky-600" />, desc: 'Assist vet surgeons in wound dressing, fluids, and medications' },
  { id: 'feeding_supply', label: 'Street Feeder & Ration Distribution', icon: <Heart className="w-4 h-4 text-rose-600" />, desc: 'Daily feeding drives and community food ration support' },
  { id: 'awareness_campaigns', label: 'Humane Education & Anti-Cruelty', icon: <Users className="w-4 h-4 text-indigo-600" />, desc: 'Conduct school awareness and report animal cruelty incidents' },
  { id: 'photography_social', label: 'Adoption & Search Photography', icon: <Camera className="w-4 h-4 text-purple-600" />, desc: 'Take high-quality pictures to find homes for rescued animals' }
];

export const CommunityVolunteerPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [communityVolunteers, setCommunityVolunteers] = useState<VolunteerApplication[]>([]);
  const [myApplication, setMyApplication] = useState<VolunteerApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshingStatus, setRefreshingStatus] = useState(false);

  // Form State
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [name, setName] = useState(currentUser.name || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [phone, setPhone] = useState('+91 98490 00000');
  const [serviceArea, setServiceArea] = useState('Kondapur / Hitec City Corridor');
  const [availability, setAvailability] = useState('Weekends & Evenings (10 hrs/week)');
  const [experience, setExperience] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<string[]>(['rapid_rescue', 'foster_care']);
  const [consent, setConsent] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Load public approved volunteers and user's own application
  const loadData = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshingStatus(true);

    try {
      // 1. Fetch public approved volunteers
      const publicVols = await api.getVolunteers();
      setCommunityVolunteers(publicVols);

      // 2. Fetch user's own submitted application from persistent database
      if (currentUser.id) {
        const userApps = await api.getVolunteers(
          { userId: currentUser.id },
          { id: currentUser.id, role: currentUser.role }
        );
        if (userApps && userApps.length > 0) {
          setMyApplication(userApps[0]);
        } else {
          setMyApplication(null);
        }
      }
    } catch (err: any) {
      console.error(err);
      if (!isSilent) showToast('Could not load volunteer records.', 'error');
    } finally {
      setLoading(false);
      setRefreshingStatus(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const toggleRole = (roleId: string) => {
    setSelectedRoles(prev =>
      prev.includes(roleId) ? prev.filter(r => r !== roleId) : [...prev, roleId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name.trim().length < 2) {
      showToast('Please enter your full name (at least 2 characters).', 'error');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    if (selectedRoles.length === 0) {
      showToast('Please select at least one preferred volunteer role.', 'error');
      return;
    }

    if (!serviceArea.trim()) {
      showToast('Please specify your general service area.', 'error');
      return;
    }

    if (!consent) {
      showToast('Please accept the volunteer humane conduct agreement.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const newVol = await api.applyVolunteer(
        {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          preferredRoles: selectedRoles,
          serviceArea: serviceArea.trim(),
          availability: availability.trim(),
          experience: experience.trim() || 'Compassionate animal lover ready to assist on-ground.',
          userId: currentUser.id
        },
        { id: currentUser.id, role: currentUser.role }
      );

      setMyApplication(newVol);
      setShowApplyForm(false);
      showToast('Volunteer application submitted with status "Pending Review"!', 'success');
      loadData(true);
    } catch (err: any) {
      showToast(err.message || 'Failed to submit application. Please check input fields.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold">
          <Users className="w-3.5 h-3.5" />
          <span>Compassionate Community Network</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Volunteer & Foster Care Force
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
          Animals in distress survive because ordinary citizens step up. Join our volunteer network to offer emergency pickup, temporary shelter, feeding, or vet assistance.
        </p>
      </div>

      {/* SECTION 1: APPLICANT'S CURRENT APPLICATION STATUS CARD (WHEN PRESENT) */}
      {myApplication && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-indigo-200/80 shadow-md space-y-6 animate-in fade-in zoom-in-95">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Your Volunteer Application
                </span>
                <span className="font-mono font-extrabold text-xs text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
                  {myApplication.id}
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                Application Status: <VolunteerStatusBadge status={myApplication.status} />
              </h2>
            </div>

            <button
              onClick={() => loadData(true)}
              disabled={refreshingStatus}
              className="px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200 flex items-center gap-1.5 self-start sm:self-auto transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshingStatus ? 'animate-spin text-indigo-600' : ''}`} />
              <span>{refreshingStatus ? 'Checking Server...' : 'Check Latest Status'}</span>
            </button>
          </div>

          {/* Visual Progress Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                <Check className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-950">1. Submitted</p>
                <p className="text-[10px] text-emerald-800">
                  {new Date(myApplication.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div
              className={`p-3.5 rounded-2xl border flex items-center gap-3 ${
                myApplication.status === 'under_review' || myApplication.status === 'approved'
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-amber-50 border-amber-200'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                  myApplication.status === 'under_review' || myApplication.status === 'approved'
                    ? 'bg-blue-600 text-white'
                    : 'bg-amber-500 text-white animate-pulse'
                }`}
              >
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">
                  2. {myApplication.status === 'under_review' ? 'Under Review' : 'Coordinator Review'}
                </p>
                <p className="text-[10px] text-slate-500">
                  {myApplication.status === 'pending'
                    ? 'Queued for desk assessment'
                    : 'Evaluated by Rescue Desk'}
                </p>
              </div>
            </div>

            <div
              className={`p-3.5 rounded-2xl border flex items-center gap-3 ${
                myApplication.status === 'approved'
                  ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-400/20'
                  : myApplication.status === 'rejected'
                  ? 'bg-rose-50 border-rose-200'
                  : 'bg-slate-50 border-slate-200 opacity-60'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                  myApplication.status === 'approved'
                    ? 'bg-emerald-600 text-white'
                    : myApplication.status === 'rejected'
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-300 text-slate-600'
                }`}
              >
                {myApplication.status === 'approved' ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <span>3</span>
                )}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">
                  3. {myApplication.status === 'approved' ? 'Verified Volunteer' : myApplication.status === 'rejected' ? 'Application Declined' : 'Approval & Dispatch'}
                </p>
                <p className="text-[10px] text-slate-500">
                  {myApplication.status === 'approved'
                    ? 'Active in emergency network'
                    : myApplication.status === 'rejected'
                    ? 'Requirements not met'
                    : 'Pending final review'}
                </p>
              </div>
            </div>
          </div>

          {/* Admin Review Note (if reviewed) */}
          {myApplication.reviewNote && (
            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-indigo-950">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  Rescue Desk Coordinator Note:
                </span>
                {myApplication.reviewedAt && (
                  <span className="text-[10px] font-normal text-indigo-700">
                    Reviewed on {new Date(myApplication.reviewedAt).toLocaleString()}
                  </span>
                )}
              </div>
              <p className="text-xs text-indigo-900 leading-relaxed font-medium">
                "{myApplication.reviewNote}"
              </p>
            </div>
          )}

          {/* Details summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600 pt-1">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                <strong>Service Area: </strong>{myApplication.serviceArea}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                <strong>Availability: </strong>{myApplication.availability}
              </span>
            </div>
            <div className="sm:col-span-2">
              <strong className="text-slate-700">Preferred Roles: </strong>
              <div className="inline-flex flex-wrap gap-1 ml-2">
                {myApplication.preferredRoles.map(r => (
                  <span
                    key={r}
                    className="text-[10px] bg-slate-100 border border-slate-200 px-2 py-0.5 rounded font-medium text-slate-700 capitalize"
                  >
                    {r.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Notification / Gateways Disclaimer */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-semibold text-slate-800">
                Real-Time In-App Status Tracking Active
              </p>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                External SMS and automated outbound email gateways are not configured in this sandbox environment. Your verification status and coordinator feedback are updated live in your Petgram account.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: APPLICATION FORM OR REGISTRATION INTAKE */}
      {(!myApplication || showApplyForm) && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Registration Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Register as an Animal Welfare Volunteer
                </h3>
                <p className="text-xs text-slate-500">
                  Select your skills and availability. Applications are saved with status <strong className="text-amber-700">"Pending Review"</strong> and evaluated by authorized administrators.
                </p>
              </div>

              {/* Roles selection */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  Preferred Volunteer Roles (Select all that apply) <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {VOLUNTEER_ROLES.map(role => {
                    const isSelected = selectedRoles.includes(role.id);
                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => toggleRole(role.id)}
                        className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 ring-2 ring-indigo-500/20'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">{role.icon}</div>
                        <div>
                          <p className="text-xs font-bold">{role.label}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">{role.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Name & Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. Priya Sundaram"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500"
                    placeholder="priya@example.com"
                  />
                </div>
              </div>

              {/* Area & Availability */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your City & Local Service Area <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={serviceArea}
                    onChange={e => setServiceArea(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. Secunderabad, Begumpet, Jubilee Hills"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Availability / Time Commitment
                  </label>
                  <input
                    type="text"
                    value={availability}
                    onChange={e => setAvailability(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. On-call 24/7 or Weekends only"
                  />
                </div>
              </div>

              {/* Experience */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Relevant Experience or Animal Care Background (Optional)
                </label>
                <textarea
                  rows={3}
                  value={experience}
                  onChange={e => setExperience(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. Fostered street pups, vehicle with safety crate, vet student, passionate dog feeder..."
                />
              </div>

              {/* Consent check */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={e => setConsent(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4 shrink-0"
                />
                <span>
                  I agree to treat animals with utmost compassion and follow humane handling guidelines. I understand registration is voluntary and subject to admin review.
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3.5 rounded-2xl bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting to Database...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Application (Status: Pending Review)</span>
                    </>
                  )}
                </button>

                {myApplication && (
                  <button
                    type="button"
                    onClick={() => setShowApplyForm(false)}
                    className="px-4 py-3.5 rounded-2xl border border-slate-300 text-slate-700 font-bold text-xs"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Right: Volunteer Orientation & Guidelines */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Volunteer Approval Workflow
              </h3>
              <ul className="text-xs text-slate-600 space-y-2.5 list-disc pl-4 leading-relaxed">
                <li>
                  <strong>Submission:</strong> Form is validated and stored in persistent database with <span className="font-semibold text-amber-800">"Pending Review"</span> status.
                </li>
                <li>
                  <strong>Admin Verification:</strong> Only authenticated Rescue Desk coordinators have authorization to review unmasked contacts, evaluate experience, and assign service sectors.
                </li>
                <li>
                  <strong>Decisions & Notes:</strong> Coordinators approve, request further details, or decline with internal review notes viewable directly on your dashboard.
                </li>
                <li>
                  <strong>Active Dispatch:</strong> Approved volunteers appear in the verified community roster and can be assigned to emergency road rescues.
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-emerald-900 to-teal-900 text-white rounded-3xl p-6 shadow-md space-y-3">
              <h4 className="text-sm font-bold flex items-center gap-2 text-emerald-200">
                <Sparkles className="w-4 h-4" /> Safety Protocol
              </h4>
              <p className="text-xs text-emerald-100 leading-relaxed">
                Always carry heavy-duty work gloves, clean blankets, and sterile gauze in your vehicle trunk. Never attempt to corner a terrified street dog without a slip lead or muzzle.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: VERIFIED COMMUNITY VOLUNTEER ROSTER */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              Verified Community Volunteer Roster ({communityVolunteers.length})
            </h3>
            <p className="text-xs text-slate-500">
              Approved on-ground advocates vetted by Petgram Rescue Desk coordinators
            </p>
          </div>

          {!showApplyForm && myApplication && (
            <button
              onClick={() => setShowApplyForm(true)}
              className="text-xs font-bold text-indigo-700 hover:text-indigo-800 underline self-start sm:self-auto"
            >
              + Submit Another Application
            </button>
          )}
        </div>

        {loading ? (
          <div className="py-12 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
            <p className="text-xs font-semibold text-slate-600">Loading approved volunteer roster...</p>
          </div>
        ) : communityVolunteers.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl text-xs text-slate-500">
            No approved volunteers in the directory yet. Approved applications appear here.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {communityVolunteers.map(vol => (
              <div
                key={vol.id}
                className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900">{vol.name}</h4>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {vol.serviceArea}
                    </p>
                  </div>
                  <VolunteerStatusBadge status={vol.status} />
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {vol.experience}
                </p>

                <div className="flex flex-wrap gap-1 pt-1 border-t border-slate-200/60">
                  {vol.preferredRoles.map(role => (
                    <span
                      key={role}
                      className="text-[10px] bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-medium capitalize"
                    >
                      {role.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
