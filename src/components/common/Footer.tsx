import React from 'react';
import { HeartHandshake, ShieldAlert, Phone, Heart, ExternalLink, AlertOctagon } from 'lucide-react';
import { NavTab } from './Navbar';

interface FooterProps {
  onSelectTab: (tab: NavTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-20 border-t border-slate-800">
      {/* Critical Animal Safety Banner */}
      <div className="bg-amber-950/80 border-b border-amber-800/40 px-4 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-amber-200 text-xs">
          <div className="flex items-center gap-3">
            <AlertOctagon className="w-5 h-5 text-amber-400 shrink-0" />
            <p className="leading-relaxed">
              <strong className="text-amber-300 font-bold uppercase tracking-wider">Crucial Veterinary Warning: </strong>
              Never administer human painkillers (Paracetamol, Crocin, Ibuprofen, Aspirin) to animals—they trigger fatal liver necrosis and kidney failure. Always seek licensed veterinary advice.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-amber-400 font-semibold">Toll-Free Rescue: 1962</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Col 1: Brand */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <HeartHandshake className="w-6 h-6 text-emerald-100" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-white">
                  PET<span className="text-emerald-400">GRAM</span>
                </span>
                <p className="text-[11px] text-slate-400 font-medium">Every Paw Deserves Care</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Petgram bridges the gap between distressed street & domestic animals and nearby veterinary hospitals, rescue NGOs, animal ambulances, and compassionate volunteers.
            </p>
            <div className="pt-2 text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>All 10+ Animal Categories Supported</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Platform Features
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => onSelectTab('report')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                  Report Distressed Animal
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('nearby')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Nearby Rescue Directory & GPS
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('firstaid')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  AI First-Aid Guidance (Gemini)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('missing')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Missing & Found Animals Network
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('community')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Volunteer & Foster Applications
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('messages')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Secure Internal Messaging
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('admin')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Rescue Desk Admin Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Emergency Helplines */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-rose-400" />
              Emergency Dispatch Contacts
            </h4>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <p className="font-bold text-white">National Animal Emergency Helpline</p>
                <p className="text-rose-400 font-mono text-sm font-semibold">Dial 1962 (Toll Free)</p>
                <p className="text-[11px] text-slate-400 mt-1">Government Mobile Veterinary Units</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <p className="font-bold text-white">Blue Cross Rapid Trauma Center</p>
                <p className="text-emerald-400 font-mono text-xs">+91 40 2354 4355 / +91 90000 88214</p>
                <p className="text-[11px] text-slate-400 mt-1">24/7 Casualty & Ambulance</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <p className="font-bold text-white">State Forest Wildlife Transit</p>
                <p className="text-teal-400 font-mono text-xs">+91 40 2300 0180 (Birds & Reptiles)</p>
              </div>
            </div>
          </div>

          {/* Col 4: Safety & Privacy */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-teal-400" />
              Ethical Welfare & Privacy
            </h4>
            <div className="space-y-3 text-xs text-slate-400 leading-relaxed">
              <p>
                <strong className="text-slate-300">Privacy First:</strong> Personal phone numbers and emails are never exposed publicly. Responders communicate through Petgram's secure internal messaging.
              </p>
              <p>
                <strong className="text-slate-300">Wildlife Safety:</strong> Never attempt to handle wild animals, venomous snakes, or large carnivores without forest wildlife officials present.
              </p>
              <p>
                <strong className="text-slate-300">Transparent Data:</strong> Real persistent database records. Unverified or demo records are clearly labeled as such.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Petgram. Built with care for every paw, wing, and hoof.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Powered by Gemini 3.8 Flash & Full-Stack Engine</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-rose-400">
              Made with <Heart className="w-3.5 h-3.5 fill-current" /> for Animal Rescue
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
