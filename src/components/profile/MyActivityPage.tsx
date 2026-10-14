import React, { useState, useEffect } from 'react';
import {
  FolderHeart,
  AlertTriangle,
  Search,
  User,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  ExternalLink,
  ChevronRight,
  Heart,
  Users,
  Info,
  Calendar,
  Check
} from 'lucide-react';
import { DistressReport, MissingFoundPost, VolunteerApplication } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { StatusBadge, UrgencyBadge, VolunteerStatusBadge } from '../common/Badge';
import { NavTab } from '../common/Navbar';

interface MyActivityPageProps {
  onSelectTab: (tab: NavTab) => void;
  onOpenReport: (reportId: string) => void;
}

export const MyActivityPage: React.FC<MyActivityPageProps> = ({
  onSelectTab,
  onOpenReport
}) => {
  const { currentUser, switchRole } = useAuth();
  const { showToast } = useToast();

  const [myReports, setMyReports] = useState<DistressReport[]>([]);
  const [myPosts, setMyPosts] = useState<MissingFoundPost[]>([]);
  const [myVolunteerApp, setMyVolunteerApp] = useState<VolunteerApplication | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'reports' | 'posts' | 'volunteer'>('reports');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadActivity() {
      setLoading(true);
      try {
        const [reps, psts, vols] = await Promise.all([
          api.getReports({ reporterId: currentUser.id }),
          api.getPosts({ creatorId: currentUser.id }),
          api.getVolunteers(
            { userId: currentUser.id },
            { id: currentUser.id, role: currentUser.role }
          ).catch(() => [])
        ]);
        setMyReports(reps);
        setMyPosts(psts);
        if (vols && vols.length > 0) {
          setMyVolunteerApp(vols[0]);
        } else {
          setMyVolunteerApp(null);
        }
      } catch (e) {
        showToast('Could not load user activity history.', 'error');
      } finally {
        setLoading(false);
      }
    }
    loadActivity();
  }, [currentUser]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Overview Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
            alt={currentUser.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-400 shadow-sm"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900">{currentUser.name}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                {currentUser.role}
              </span>
            </div>
            <p className="text-xs text-slate-500">{currentUser.email}</p>
            <p className="text-xs text-slate-400 font-mono">Protected Contact: {currentUser.phoneMasked || '+91 98*** **412'}</p>
          </div>
        </div>

        {/* Quick Role Elevation Bar for Hackathon Demo */}
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs space-y-1.5 w-full md:w-auto">
          <p className="font-bold text-slate-600 uppercase text-[10px]">Switch Demo Persona:</p>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => {
                switchRole('user');
                showToast('Switched to Citizen Reporter Persona');
              }}
              className={`px-3 py-1 rounded-lg font-semibold text-xs border ${
                currentUser.role === 'user' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700 border-slate-200'
              }`}
            >
              Citizen Reporter
            </button>
            <button
              onClick={() => {
                switchRole('volunteer');
                showToast('Switched to Volunteer Persona');
              }}
              className={`px-3 py-1 rounded-lg font-semibold text-xs border ${
                currentUser.role === 'volunteer' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-200'
              }`}
            >
              Volunteer
            </button>
            <button
              onClick={() => {
                switchRole('admin');
                showToast('Switched to Rescue Desk Admin Persona');
              }}
              className={`px-3 py-1 rounded-lg font-semibold text-xs border ${
                currentUser.role === 'admin' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-slate-700 border-slate-200'
              }`}
            >
              Rescue Desk Admin
            </button>
          </div>
        </div>
      </div>

      {/* Activity Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab('reports')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'reports'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>My Distress Reports ({myReports.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('posts')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'posts'
              ? 'bg-sky-700 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          <span>My Missing & Found Posts ({myPosts.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('volunteer')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'volunteer'
              ? 'bg-indigo-700 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>My Volunteer Status {myVolunteerApp ? `(${myVolunteerApp.status.replace('_', ' ')})` : ''}</span>
        </button>
      </div>

      {/* Reports List */}
      {activeSubTab === 'reports' && (
        <div className="space-y-4">
          {myReports.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
              <FolderHeart className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">No Distress Reports Logged Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Whenever you report an injured or trapped animal, you can track ambulance dispatches and vet treatment progress right here.
              </p>
              <button
                onClick={() => onSelectTab('report')}
                className="px-5 py-2.5 bg-orange-600 text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer"
              >
                Report an Animal in Distress
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myReports.map(rep => (
                <div
                  key={rep.id}
                  className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-slate-900 text-xs">{rep.id}</span>
                      <StatusBadge status={rep.status} />
                    </div>

                    <div className="flex items-center gap-2">
                      <UrgencyBadge urgency={rep.urgency} />
                      <span className="text-xs font-bold text-slate-800 capitalize bg-slate-100 px-2 py-0.5 rounded">
                        {rep.animalCategory} ({rep.observedProblem.replace('_', ' ')})
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {rep.description}
                    </p>

                    <div className="text-xs text-slate-500 space-y-1 pt-1">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{rep.location.address}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        <Clock className="w-3.5 h-3.5 shrink-0" />
                        <span>Submitted {new Date(rep.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Timeline History */}
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs space-y-1.5">
                    <p className="font-bold text-slate-700 text-[10px] uppercase">Rescue Dispatch Log:</p>
                    {rep.statusHistory.map((sh, idx) => (
                      <div key={idx} className="text-[11px] text-slate-600 border-l-2 border-emerald-500 pl-2">
                        <span className="font-bold text-slate-800">{sh.status}: </span>
                        <span>{sh.note}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Posts List */}
      {activeSubTab === 'posts' && (
        <div className="space-y-4">
          {myPosts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
              <Search className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">No Missing / Found Posts Created</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Need to search for a lost pet or help a found animal find its family? Publish a post to get algorithmic matching.
              </p>
              <button
                onClick={() => onSelectTab('missing')}
                className="px-5 py-2.5 bg-sky-600 text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer"
              >
                Go to Missing & Found Registry
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myPosts.map(post => (
                <div
                  key={post.id}
                  className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-slate-800 text-xs">{post.id}</span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                          post.status === 'reunited' ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'
                        }`}
                      >
                        {post.status}
                      </span>
                    </div>

                    <h4 className="text-sm font-extrabold text-slate-900">
                      {post.breedOrAppearance} ({post.type.toUpperCase()})
                    </h4>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {post.description}
                    </p>

                    <div className="text-xs text-slate-500 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      <span className="truncate">{post.location.address}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Created {post.date}</span>
                    <button
                      onClick={() => onSelectTab('missing')}
                      className="text-xs font-bold text-sky-700 hover:text-sky-800 flex items-center gap-1 cursor-pointer"
                    >
                      <span>View in Community Hub</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Volunteer Application Status Tab */}
      {activeSubTab === 'volunteer' && (
        <div className="space-y-4">
          {!myVolunteerApp ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
              <Users className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">No Volunteer Application On File</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Join Petgram's volunteer force to help with emergency animal ambulance transport, foster care, or street feeding drives.
              </p>
              <button
                onClick={() => onSelectTab('community')}
                className="px-5 py-2.5 bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer"
              >
                Apply as a Volunteer
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-indigo-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Application Reference:</span>
                    <span className="font-mono font-extrabold text-xs text-indigo-900 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-200">
                      {myVolunteerApp.id}
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-1 flex items-center gap-2">
                    Status: <VolunteerStatusBadge status={myVolunteerApp.status} />
                  </h3>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Submitted on</span>
                  <span className="text-xs font-bold text-slate-700">
                    {new Date(myVolunteerApp.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Status details & Coordinator feedback */}
              {myVolunteerApp.reviewNote && (
                <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-indigo-950">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-indigo-600" />
                      Rescue Desk Feedback:
                    </span>
                    {myVolunteerApp.reviewedAt && (
                      <span className="text-[10px] text-indigo-700">
                        {new Date(myVolunteerApp.reviewedAt).toLocaleString()}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-indigo-900 leading-relaxed font-medium">
                    "{myVolunteerApp.reviewNote}"
                  </p>
                </div>
              )}

              {/* Application Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <strong className="text-slate-500 block mb-0.5">Service Sector:</strong>
                  <span className="font-semibold">{myVolunteerApp.serviceArea}</span>
                </div>
                <div>
                  <strong className="text-slate-500 block mb-0.5">Availability:</strong>
                  <span className="font-semibold">{myVolunteerApp.availability}</span>
                </div>
                <div className="sm:col-span-2">
                  <strong className="text-slate-500 block mb-1">Selected Roles:</strong>
                  <div className="flex flex-wrap gap-1">
                    {myVolunteerApp.preferredRoles.map(r => (
                      <span
                        key={r}
                        className="px-2 py-0.5 bg-white border border-slate-200 text-slate-800 rounded font-medium capitalize"
                      >
                        {r.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* In-App Notification Policy */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  <strong>Notification Notice:</strong> Status updates are tracked live in your Petgram account. Third-party outbound SMS or email gateways are not configured in this sandbox environment.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
