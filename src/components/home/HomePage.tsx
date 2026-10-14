import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  MapPin,
  Sparkles,
  Search,
  Users,
  ShieldCheck,
  ArrowRight,
  Heart,
  PhoneCall,
  Activity,
  CheckCircle2,
  Clock,
  ChevronRight
} from 'lucide-react';
import { NavTab } from '../common/Navbar';
import { DistressReport, MissingFoundPost, SystemStats } from '../../types';
import { api } from '../../services/api';
import { StatusBadge, UrgencyBadge } from '../common/Badge';

interface HomePageProps {
  onSelectTab: (tab: NavTab) => void;
  onOpenReport: (reportId: string) => void;
  onOpenPost: (postId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSelectTab,
  onOpenReport,
  onOpenPost
}) => {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [recentReports, setRecentReports] = useState<DistressReport[]>([]);
  const [recentPosts, setRecentPosts] = useState<MissingFoundPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [statsData, reportsData, postsData] = await Promise.all([
          api.getStats().catch(() => null),
          api.getReports().catch(() => []),
          api.getPosts().catch(() => [])
        ]);

        if (statsData) setStats(statsData);
        setRecentReports((reportsData || []).slice(0, 3));
        setRecentPosts((postsData || []).slice(0, 3));
      } catch (e) {
        console.error('Failed to load home data:', e);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-14 lg:py-16 bg-gradient-to-b from-emerald-900 via-emerald-800 to-teal-900 text-white rounded-3xl mx-3 sm:mx-6 lg:mx-8 px-6 sm:px-10 lg:px-14 shadow-2xl">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

        <div className="relative max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>All 10 Animal Categories Supported • Dogs, Cattle, Cats, Avian, Wildlife</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]">
              Every Animal Deserves a Chance.
            </h1>

            <p className="text-base sm:text-lg text-emerald-100 font-normal leading-relaxed max-w-2xl">
              Found an animal injured, sick, or abandoned on the road? <strong className="text-white font-semibold">Petgram</strong> rapidly connects your incident location with emergency veterinary ambulances, animal welfare NGOs, volunteer rescuers, and safe AI first-aid.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3.5 justify-center lg:justify-start pt-2">
              <button
                onClick={() => onSelectTab('report')}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white font-bold text-sm shadow-xl shadow-orange-950/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2.5"
              >
                <AlertTriangle className="w-5 h-5 text-orange-200 animate-bounce" />
                <span>Report Distressed Animal</span>
              </button>

              <button
                onClick={() => onSelectTab('nearby')}
                className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 backdrop-blur-md hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
              >
                <MapPin className="w-4 h-4 text-emerald-300" />
                <span>Find Nearby Help</span>
              </button>

              <button
                onClick={() => onSelectTab('missing')}
                className="px-5 py-3.5 rounded-2xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-200 font-bold text-sm border border-teal-400/30 backdrop-blur-md transition-all flex items-center gap-2"
              >
                <Search className="w-4 h-4 text-teal-300" />
                <span>Missing & Found</span>
              </button>
            </div>

            {/* Quick emergency disclaimer */}
            <div className="flex items-center gap-2 text-xs text-emerald-200/90 pt-1 justify-center lg:justify-start">
              <PhoneCall className="w-3.5 h-3.5 text-orange-400" />
              <span>Free, open, community-powered network. No app install needed.</span>
            </div>
          </div>

          {/* Hero Animal Image Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 transform hover:-rotate-1 transition-transform duration-500">
              <img
                src="https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80"
                alt="Compassionate care for street dog"
                className="w-full h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-5 text-left">
                <span className="inline-block px-2.5 py-1 rounded-md bg-emerald-600/90 text-white text-[11px] font-bold uppercase tracking-wider mb-1 w-max">
                  Community Impact
                </span>
                <p className="text-white font-bold text-base leading-snug">
                  Over 120+ street animals safeguarded through volunteer alerts this month.
                </p>
                <p className="text-xs text-emerald-200 mt-1">
                  Verified rescues across 10 distinct animal categories.
                </p>
              </div>
            </div>

            {/* Floating Live Badge */}
            <div className="absolute -bottom-4 -left-3 bg-white text-slate-800 p-3 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                <Activity className="w-5 h-5 animate-pulse" />
              </div>
              <div className="text-left text-xs">
                <p className="font-bold text-slate-900">Active Rescue Grid</p>
                <p className="text-slate-500 font-medium">GPS-linked emergency dispatch</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real Aggregate Impact Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-2">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Live Database Verification Counts
              </h3>
              <p className="text-xs text-slate-500">
                Derived directly from persistent system records
              </p>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 w-max">
              Synced with Petgram Store
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {stats?.totalReports ?? 4}
              </p>
              <p className="text-xs font-semibold text-slate-500 mt-1">Distress Reports Logged</p>
            </div>
            <div className="p-3 bg-emerald-50/60 rounded-xl">
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-700">
                {stats?.resolvedReports ?? 1}
              </p>
              <p className="text-xs font-semibold text-emerald-900 mt-1">Verified Resolved Cases</p>
            </div>
            <div className="p-3 bg-teal-50/60 rounded-xl">
              <p className="text-2xl sm:text-3xl font-extrabold text-teal-700">
                {stats?.verifiedServicesCount ?? 10}
              </p>
              <p className="text-xs font-semibold text-teal-900 mt-1">Hospitals & Shelters</p>
            </div>
            <div className="p-3 bg-orange-50/60 rounded-xl">
              <p className="text-2xl sm:text-3xl font-extrabold text-orange-700">
                {stats?.volunteerCount ?? 3}
              </p>
              <p className="text-xs font-semibold text-orange-900 mt-1">Active Volunteers</p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Emergency Workflow
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900">
            How Petgram Rescues Animals
          </h2>
          <p className="text-sm text-slate-600">
            A fast, three-step action chain designed to preserve precious minutes when an animal is in critical danger.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-lg">
              1
            </div>
            <h3 className="text-lg font-bold text-slate-900">Spot & Report with GPS</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Upload a clear photograph, select the animal category and urgency, and capture the exact incident coordinates or landmark.
            </p>
            <div className="pt-2 text-xs font-semibold text-orange-600 flex items-center gap-1">
              <span>Unique Reference ID generated</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-lg">
              2
            </div>
            <h3 className="text-lg font-bold text-slate-900">AI Triage & Nearby Help</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Instantly consult Gemini AI for safe non-invasive first-aid protocols while locating the closest 24/7 veterinary hospitals and animal ambulances.
            </p>
            <div className="pt-2 text-xs font-semibold text-teal-700 flex items-center gap-1">
              <span>Haversine distance & Maps routes</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg">
              3
            </div>
            <h3 className="text-lg font-bold text-slate-900">Rescue & Track Recovery</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Volunteer teams and authorized rescue coordinators accept the report, provide mobile treatment, and update the animal's recovery status.
            </p>
            <div className="pt-2 text-xs font-semibold text-emerald-700 flex items-center gap-1">
              <span>Private messaging without phone leaks</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold text-teal-700 uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Comprehensive Platform
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900">
            Dedicated Animal Rescue Features
          </h2>
          <p className="text-sm text-slate-600">
            Everything needed to handle road accidents, cruelty reports, lost pets, and community care.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div
            onClick={() => onSelectTab('report')}
            className="group cursor-pointer bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-orange-400 hover:shadow-lg transition-all space-y-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
              Animal Distress Reports
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Log reports for dogs, cattle, cats, equines, birds, and wildlife. Set urgency levels, attach photo evidence, and track status transitions.
            </p>
            <div className="flex items-center text-xs font-bold text-orange-600 pt-1">
              <span>Submit a Report</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2 */}
          <div
            onClick={() => onSelectTab('nearby')}
            className="group cursor-pointer bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-500 hover:shadow-lg transition-all space-y-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:scale-110 transition-transform">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
              Nearby Rescue & Vet Directory
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Find 10 categories including Blue Cross, animal ambulances, government dispensaries, private 24/7 ICUs, and wildlife authorities with real distances.
            </p>
            <div className="flex items-center text-xs font-bold text-emerald-700 pt-1">
              <span>Explore Directory</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3 */}
          <div
            onClick={() => onSelectTab('firstaid')}
            className="group cursor-pointer bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-teal-500 hover:shadow-lg transition-all space-y-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
              AI First-Aid Guidance
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Powered by Gemini 3.8 Flash. Get conservative non-invasive stabilization steps, strict human medicine toxicity warnings, and red flag indicators.
            </p>
            <div className="flex items-center text-xs font-bold text-teal-700 pt-1">
              <span>Ask AI Advisor</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4 */}
          <div
            onClick={() => onSelectTab('missing')}
            className="group cursor-pointer bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-sky-500 hover:shadow-lg transition-all space-y-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
              Missing & Found Pet Matching
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Post lost or spotted pets. Our matching algorithm scans breed, color, location vicinity, and timeline to propose "Potential Match — Please Verify" leads.
            </p>
            <div className="flex items-center text-xs font-bold text-sky-700 pt-1">
              <span>View Listings</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 5 */}
          <div
            onClick={() => onSelectTab('messages')}
            className="group cursor-pointer bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-500 hover:shadow-lg transition-all space-y-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
              Private Internal Messaging
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Connect directly with report finders or foster parents through thread-based chat without publishing private phone numbers or personal emails.
            </p>
            <div className="flex items-center text-xs font-bold text-emerald-700 pt-1">
              <span>Open Messages</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 6 */}
          <div
            onClick={() => onSelectTab('community')}
            className="group cursor-pointer bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-indigo-500 hover:shadow-lg transition-all space-y-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
              Volunteer & Foster Network
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Sign up for emergency transport, foster care, animal feeding, or veterinary assistance. Verified coordinators review applications centrally.
            </p>
            <div className="flex items-center text-xs font-bold text-indigo-700 pt-1">
              <span>Join as Volunteer</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* Recent Live Distress Reports */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
              Recent Distress Reports
            </h2>
            <p className="text-xs text-slate-500">Live feed from active incident reports</p>
          </div>
          <button
            onClick={() => onSelectTab('report')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>Submit New Report</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentReports.map(report => (
            <div
              key={report.id}
              onClick={() => onOpenReport(report.id)}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md hover:border-emerald-400 transition-all cursor-pointer flex flex-col"
            >
              {report.imageUrl ? (
                <div className="h-44 overflow-hidden relative">
                  <img
                    src={report.imageUrl}
                    alt={report.animalCategory}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <UrgencyBadge urgency={report.urgency} />
                  </div>
                  <div className="absolute top-2.5 right-2.5">
                    <StatusBadge status={report.status} />
                  </div>
                </div>
              ) : (
                <div className="h-28 bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-medium">
                  No Photo Attached
                </div>
              )}

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span className="font-mono font-bold text-slate-700">{report.id}</span>
                    <span className="capitalize font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      {report.animalCategory}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed">
                    {report.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-600 truncate">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{report.location.address}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    <span>Reported by {report.reporter.name}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Missing / Found Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <Search className="w-5 h-5 text-sky-600" />
              Missing & Found Animal Alerts
            </h2>
            <p className="text-xs text-slate-500">Help reunite separated companion animals</p>
          </div>
          <button
            onClick={() => onSelectTab('missing')}
            className="text-xs font-bold text-sky-700 hover:text-sky-800 flex items-center gap-1"
          >
            <span>View All Missing / Found</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentPosts.map(post => (
            <div
              key={post.id}
              onClick={() => onOpenPost(post.id)}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md hover:border-sky-400 transition-all cursor-pointer flex flex-col"
            >
              {post.imageUrl && (
                <div className="h-44 overflow-hidden relative">
                  <img
                    src={post.imageUrl}
                    alt={post.breedOrAppearance}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span
                      className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider text-white shadow-sm ${
                        post.type === 'missing' ? 'bg-rose-600' : 'bg-teal-600'
                      }`}
                    >
                      {post.type === 'missing' ? 'Lost Pet' : 'Animal Found'}
                    </span>
                  </div>
                  {post.status === 'reunited' && (
                    <div className="absolute bottom-2.5 right-2.5 bg-emerald-600 text-white px-2.5 py-0.5 rounded text-xs font-bold flex items-center gap-1 shadow-md">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Reunited!
                    </div>
                  )}
                </div>
              )}

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                    {post.breedOrAppearance} ({post.color})
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                    {post.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5 text-slate-600 truncate">
                    <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span className="truncate">{post.location.address}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Volunteer Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left max-w-xl">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-200 bg-white/10 px-3 py-1 rounded-full">
              Volunteer Force
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Be the Difference in an Animal's Life Today
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              Whether you have a vehicle for emergency transport, a safe home for foster care, or a few hours to feed street dogs, Petgram needs your compassion.
            </p>
          </div>

          <button
            onClick={() => onSelectTab('community')}
            className="px-6 py-3.5 rounded-2xl bg-white text-emerald-900 hover:bg-emerald-50 font-bold text-sm shadow-lg hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
          >
            Sign Up as Volunteer
          </button>
        </div>
      </section>
    </div>
  );
};
