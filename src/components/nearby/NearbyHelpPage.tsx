import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Phone,
  Clock,
  ExternalLink,
  Navigation,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Building2,
  Truck,
  HeartHandshake,
  ShieldAlert,
  Loader2,
  ChevronDown
} from 'lucide-react';
import { RescueService, ServiceCategory } from '../../types';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const CATEGORY_TABS: { id: string; label: string; icon: React.ReactNode }[] = [
  { id: 'all', label: 'All Services (10)', icon: <Building2 className="w-3.5 h-3.5" /> },
  { id: 'blue_cross', label: 'Blue Cross', icon: <HeartHandshake className="w-3.5 h-3.5" /> },
  { id: 'animal_ambulance', label: 'Animal Ambulance', icon: <Truck className="w-3.5 h-3.5" /> },
  { id: 'govt_vet_hospital', label: 'Govt Vet Hospital', icon: <Building2 className="w-3.5 h-3.5" /> },
  { id: 'private_vet_clinic', label: 'Private Vet Clinic', icon: <Building2 className="w-3.5 h-3.5" /> },
  { id: 'welfare_ngo', label: 'Welfare NGOs', icon: <HeartHandshake className="w-3.5 h-3.5" /> },
  { id: 'rescue_team', label: 'Rescue Teams', icon: <Truck className="w-3.5 h-3.5" /> },
  { id: 'wildlife_rescue', label: 'Wildlife Rescue', icon: <ShieldAlert className="w-3.5 h-3.5" /> },
  { id: 'animal_shelter', label: 'Shelters & Adoptions', icon: <Building2 className="w-3.5 h-3.5" /> },
  { id: 'govt_vet_dispensary', label: 'Govt Dispensary', icon: <Building2 className="w-3.5 h-3.5" /> },
  { id: 'vet_pharmacy', label: 'Vet Pharmacy', icon: <Building2 className="w-3.5 h-3.5" /> }
];

export const NearbyHelpPage: React.FC = () => {
  const { showToast } = useToast();

  const [services, setServices] = useState<RescueService[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [userLat, setUserLat] = useState<number | undefined>(17.4474);
  const [userLng, setUserLng] = useState<number | undefined>(78.3762);
  const [locationName, setLocationName] = useState('Hitec City / Cyberabad Area');
  const [radiusKm, setRadiusKm] = useState<number>(30);
  const [detectingLocation, setDetectingLocation] = useState(false);

  // Fetch Services
  const fetchServices = async (lat?: number, lng?: number, cat?: string, rad?: number) => {
    setLoading(true);
    try {
      const data = await api.getServices({
        lat,
        lng,
        category: cat !== 'all' ? cat : undefined,
        radiusKm: rad
      });
      setServices(data);
    } catch (err: any) {
      showToast('Could not fetch services list.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices(userLat, userLng, selectedCategory, radiusKm);
  }, [selectedCategory, radiusKm]);

  // Handle GPS detect
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation not supported by your browser.', 'error');
      return;
    }
    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserLat(lat);
        setUserLng(lng);
        setLocationName(`Current GPS (${lat.toFixed(3)}, ${lng.toFixed(3)})`);
        setDetectingLocation(false);
        showToast('Distance calculated from your exact location!', 'success');
        fetchServices(lat, lng, selectedCategory, radiusKm);
      },
      err => {
        setDetectingLocation(false);
        showToast('Location permission not granted. You can still browse all listings by address.', 'warning');
      },
      { timeout: 8000 }
    );
  };

  // Filter by search query
  const filteredServices = services.filter(srv => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      srv.name.toLowerCase().includes(q) ||
      srv.address.toLowerCase().includes(q) ||
      srv.categoryLabel.toLowerCase().includes(q) ||
      srv.servicesProvided.some(s => s.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
          <MapPin className="w-3.5 h-3.5" />
          <span>Real Incident-Location Directory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Find Nearby Rescue, Ambulance & Veterinary Care
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          Search for verified animal welfare organizations, Blue Cross centers, government veterinary hospitals, animal ambulances, and 24/7 trauma clinics sorted by distance from the distress location.
        </p>
      </div>

      {/* Location Bar & Radius Selector */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Navigation className="w-5 h-5 text-emerald-700" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Searching Around Incident Reference:
              </p>
              <div className="flex items-center gap-2">
                <p className="text-sm font-extrabold text-slate-900">{locationName}</p>
                {userLat && userLng && (
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-mono border border-emerald-200">
                    {userLat.toFixed(4)}, {userLng.toFixed(4)}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleDetectGPS}
              disabled={detectingLocation}
              className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              {detectingLocation ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Locating...</span>
                </>
              ) : (
                <>
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Use My Live Location</span>
                </>
              )}
            </button>

            {/* Radius select */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700">
              <span>Radius:</span>
              <select
                value={radiusKm}
                onChange={e => setRadiusKm(Number(e.target.value))}
                className="bg-transparent font-bold text-emerald-800 focus:outline-none cursor-pointer"
              >
                <option value={10}>10 km</option>
                <option value={25}>25 km</option>
                <option value={50}>50 km</option>
                <option value={100}>All (100km)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Search query input */}
        <div className="relative pt-2">
          <Search className="w-4 h-4 absolute left-3.5 top-5.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by facility name, address, or service (e.g., 'Ambulance', 'Blue Cross', 'Cattle', 'X-Ray')..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Google Maps Live Fallback Link Banner */}
        <div className="bg-sky-50 border border-sky-200/80 rounded-xl p-3 text-xs text-sky-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-sky-600 shrink-0" />
            <span>
              Need to search live Google Maps for other specialized veterinary care near your location?
            </span>
          </div>
          <a
            href={`https://www.google.com/maps/search/veterinary+hospital+near+${userLat || 17.44},${userLng || 78.37}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-sky-700 hover:text-sky-800 hover:underline inline-flex items-center gap-1 shrink-0"
          >
            <span>Open Google Maps Search</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORY_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedCategory(tab.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
              selectedCategory === tab.id
                ? 'bg-emerald-800 text-white shadow-sm font-bold'
                : 'bg-white text-slate-700 hover:bg-emerald-50 border border-slate-200'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Directory Results List */}
      {loading ? (
        <div className="text-center py-16 space-y-3">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-600">
            Calculating distances and loading emergency directory...
          </p>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">No Services Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            No listings matched your active filter or search query. Try expanding your search radius or clearing filters.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              setRadiusKm(100);
            }}
            className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-semibold"
          >
            Reset Filters & View All
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredServices.map(service => (
            <div
              key={service.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Header: Title and Category */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {service.categoryLabel}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 mt-1 leading-snug">
                      {service.name}
                    </h3>
                  </div>

                  {service.distanceKm !== undefined && (
                    <div className="text-right shrink-0 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200">
                      <span className="text-sm font-mono font-extrabold text-emerald-800">
                        {service.distanceKm} km
                      </span>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase">away</p>
                    </div>
                  )}
                </div>

                {/* Verification & 24 Hours status */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {service.isOpen24Hours ? (
                    <span className="px-2 py-0.5 bg-rose-50 text-rose-700 rounded-md font-bold text-[11px] border border-rose-200 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>
                      24/7 Emergency Care
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px] font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {service.openingHours}
                    </span>
                  )}

                  {service.verificationStatus === 'verified_partner' ? (
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded-md font-bold text-[11px] border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified Partner
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[11px]">
                      Public Directory Listing
                    </span>
                  )}
                </div>

                {/* Address */}
                <div className="text-xs text-slate-600 flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>{service.address}, {service.city}</span>
                </div>

                {/* Services Provided Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {service.servicesProvided.map(tag => (
                    <span
                      key={tag}
                      className="text-[11px] px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <p className="text-[11px] text-slate-400 font-medium">Helpline / Dispatch:</p>
                  <a
                    href={`tel:${service.emergencyPhone || service.phone}`}
                    className="text-xs font-mono font-bold text-slate-900 hover:text-emerald-700 flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{service.emergencyPhone || service.phone}</span>
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={service.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-colors"
                  >
                    <span>Get Directions</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  {service.website && (
                    <a
                      href={service.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors"
                    >
                      Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
