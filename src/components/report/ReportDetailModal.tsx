import React from 'react';
import {
  X,
  MapPin,
  Clock,
  ShieldCheck,
  Phone,
  Navigation,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { DistressReport } from '../../types';
import { StatusBadge, UrgencyBadge } from '../common/Badge';

interface ReportDetailModalProps {
  report: DistressReport | null;
  onClose: () => void;
  onStartMessage: (reportId: string, title: string, reporterId: string, reporterName: string) => void;
}

export const ReportDetailModal: React.FC<ReportDetailModalProps> = ({
  report,
  onClose,
  onStartMessage
}) => {
  if (!report) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="font-mono font-extrabold text-sm text-slate-900">{report.id}</span>
            <StatusBadge status={report.status} />
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Photo */}
        {report.imageUrl && (
          <div className="rounded-2xl overflow-hidden max-h-72 border border-slate-200">
            <img
              src={report.imageUrl}
              alt={report.animalCategory}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Meta badges */}
        <div className="flex flex-wrap items-center gap-2">
          <UrgencyBadge urgency={report.urgency} />
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
            {report.animalCategory}
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
            Problem: {report.observedProblem.replace('_', ' ')}
          </span>
        </div>

        {/* Description */}
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Distress Incident Report
          </h4>
          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
            {report.description}
          </p>
        </div>

        {/* Location & Landmark */}
        <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 space-y-2 text-xs">
          <div className="flex items-start gap-2 text-emerald-950">
            <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">{report.location.address}</p>
              {report.location.landmark && (
                <p className="text-emerald-800 text-[11px] mt-0.5">
                  Landmark: {report.location.landmark}
                </p>
              )}
            </div>
          </div>

          {report.location.latitude && report.location.longitude && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${report.location.latitude},${report.location.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-800 pt-1"
            >
              <span>View Coordinates on Google Maps</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        {/* Status Timeline */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Status & Dispatch History
          </h4>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
            {report.statusHistory.map((sh, idx) => (
              <div key={idx} className="border-l-2 border-emerald-600 pl-3 text-xs space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{sh.status}</span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(sh.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px]">{sh.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Reporter info */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>
            <span>Reported by: </span>
            <strong className="text-slate-800">{report.reporter.name}</strong>
          </div>
          <button
            onClick={() => {
              onClose();
              onStartMessage(
                report.id,
                `Incident ${report.id} (${report.animalCategory})`,
                report.reporter.id,
                report.reporter.name
              );
            }}
            className="px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 flex items-center gap-1.5 shadow-sm"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Contact Reporter Privately</span>
          </button>
        </div>
      </div>
    </div>
  );
};
