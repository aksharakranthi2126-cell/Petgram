import React from 'react';
import { ReportStatus, UrgencyLevel } from '../../types';

export const StatusBadge: React.FC<{ status: ReportStatus }> = ({ status }) => {
  let style = 'bg-slate-100 text-slate-700 border-slate-200';

  switch (status) {
    case 'Submitted':
      style = 'bg-sky-50 text-sky-800 border-sky-200';
      break;
    case 'Under Review':
      style = 'bg-amber-50 text-amber-800 border-amber-200';
      break;
    case 'Help Contacted':
      style = 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-2 ring-emerald-400/20';
      break;
    case 'Resolved':
      style = 'bg-teal-50 text-teal-800 border-teal-200';
      break;
    case 'Unable to Verify':
      style = 'bg-zinc-100 text-zinc-600 border-zinc-200';
      break;
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${style}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {status}
    </span>
  );
};

export const UrgencyBadge: React.FC<{ urgency: UrgencyLevel }> = ({ urgency }) => {
  let style = 'bg-slate-100 text-slate-700 border-slate-200';

  switch (urgency) {
    case 'critical':
      style = 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse font-bold';
      break;
    case 'high':
      style = 'bg-orange-50 text-orange-800 border-orange-200 font-semibold';
      break;
    case 'medium':
      style = 'bg-amber-50 text-amber-800 border-amber-200';
      break;
    case 'low':
      style = 'bg-slate-100 text-slate-700 border-slate-200';
      break;
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs uppercase tracking-wide border ${style}`}>
      {urgency} Urgency
    </span>
  );
};

export const VolunteerStatusBadge: React.FC<{ status: 'pending' | 'under_review' | 'approved' | 'rejected' }> = ({ status }) => {
  let style = 'bg-amber-50 text-amber-900 border-amber-300';
  let label = 'Pending Review';

  switch (status) {
    case 'pending':
      style = 'bg-amber-50 text-amber-900 border-amber-300 ring-2 ring-amber-400/20';
      label = 'Pending Review';
      break;
    case 'under_review':
      style = 'bg-blue-50 text-blue-900 border-blue-300 ring-2 ring-blue-400/20';
      label = 'Under Review';
      break;
    case 'approved':
      style = 'bg-emerald-50 text-emerald-900 border-emerald-300 ring-2 ring-emerald-400/20 font-bold';
      label = 'Approved Volunteer';
      break;
    case 'rejected':
      style = 'bg-rose-50 text-rose-900 border-rose-200';
      label = 'Declined';
      break;
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${style}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {label}
    </span>
  );
};
