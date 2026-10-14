export type AnimalCategory =
  | 'dog'
  | 'cat'
  | 'cow'
  | 'buffalo'
  | 'goat'
  | 'sheep'
  | 'horse'
  | 'bird'
  | 'rabbit'
  | 'wildlife'
  | 'other';

export type DistressProblem =
  | 'injured'
  | 'bleeding'
  | 'sick'
  | 'trapped'
  | 'abandoned'
  | 'road_accident'
  | 'unable_to_move'
  | 'suspected_poisoning'
  | 'unsafe_situation'
  | 'other';

export type UrgencyLevel = 'critical' | 'high' | 'medium' | 'low';

export type ReportStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Help Contacted'
  | 'Resolved'
  | 'Unable to Verify';

export interface LocationData {
  address: string;
  latitude?: number;
  longitude?: number;
  landmark?: string;
  city?: string;
}

export interface StatusHistoryEntry {
  status: ReportStatus;
  timestamp: string;
  note?: string;
  updatedBy?: string;
}

export interface DistressReport {
  id: string; // e.g. RPT-2026-7842
  animalCategory: AnimalCategory;
  observedProblem: DistressProblem;
  urgency: UrgencyLevel;
  description: string;
  location: LocationData;
  incidentDateTime: string;
  imageUrl?: string;
  status: ReportStatus;
  statusHistory: StatusHistoryEntry[];
  reporter: {
    id: string;
    name: string;
    isAnonymous: boolean;
    contactMasked?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export type PostType = 'missing' | 'found';

export interface MissingFoundPost {
  id: string; // e.g. POST-2026-102
  type: PostType;
  animalCategory: AnimalCategory;
  breedOrAppearance: string;
  color: string;
  size: 'small' | 'medium' | 'large';
  identifyingFeatures: string;
  description: string;
  location: LocationData;
  date: string;
  imageUrl?: string;
  status: 'active' | 'reunited' | 'closed';
  creatorId: string;
  creatorName: string;
  createdAt: string;
  potentialMatches?: Array<{
    postId: string;
    matchScore: number;
    matchReasons: string[];
  }>;
}

export type ServiceCategory =
  | 'blue_cross'
  | 'welfare_ngo'
  | 'rescue_team'
  | 'animal_ambulance'
  | 'govt_vet_hospital'
  | 'govt_vet_dispensary'
  | 'private_vet_clinic'
  | 'vet_pharmacy'
  | 'animal_shelter'
  | 'wildlife_rescue';

export interface RescueService {
  id: string;
  name: string;
  category: ServiceCategory;
  categoryLabel: string;
  address: string;
  city: string;
  phone: string;
  emergencyPhone?: string;
  openingHours: string;
  isOpen24Hours?: boolean;
  servicesProvided: string[];
  latitude: number;
  longitude: number;
  distanceKm?: number;
  verificationStatus: 'verified_partner' | 'public_directory' | 'demo_listing';
  googleMapsUrl: string;
  website?: string;
}

export interface AIFirstAidRequest {
  animalType: string;
  observedCondition: string;
  symptoms: string;
  location?: string;
  imageBase64?: string;
}

export interface AIFirstAidResponse {
  source: 'gemini-live' | 'demo-fallback';
  summary: string;
  immediatePrecautions: string[];
  safeActions: string[];
  actionsToAvoid: string[];
  emergencyRedFlags: string[];
  recommendedServices: string[];
  disclaimer: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'volunteer';
  avatarUrl?: string;
  phoneMasked?: string;
}

export interface ConversationParticipant {
  id: string;
  name: string;
  role?: string;
}

export interface Conversation {
  id: string;
  participants: ConversationParticipant[];
  contextType: 'report' | 'post' | 'general';
  contextId?: string;
  contextTitle?: string;
  lastMessage: string;
  updatedAt: string;
  unreadCount?: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt: string;
}

export type VolunteerStatus = 'pending' | 'under_review' | 'approved' | 'rejected';

export interface VolunteerStatusHistory {
  status: VolunteerStatus;
  timestamp: string;
  note?: string;
  updatedBy?: string;
}

export interface VolunteerApplication {
  id: string;
  userId?: string;
  name: string;
  email?: string;
  phone?: string;
  emailMasked: string;
  phoneMasked: string;
  preferredRoles: string[];
  serviceArea: string;
  availability: string;
  experience?: string;
  status: VolunteerStatus;
  reviewNote?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  statusHistory?: VolunteerStatusHistory[];
  createdAt: string;
  updatedAt?: string;
}

export interface SystemStats {
  totalReports: number;
  activeReports: number;
  resolvedReports: number;
  missingPosts: number;
  reunitedPets: number;
  volunteerCount: number;
  verifiedServicesCount: number;
  isDemoData: boolean;
}
