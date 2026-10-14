import {
  DistressReport,
  MissingFoundPost,
  RescueService,
  VolunteerApplication,
  AIFirstAidResponse
} from '../types';

export const INITIAL_SERVICES: RescueService[] = [
  {
    id: 'srv-1',
    name: 'Blue Cross Animal Care & Rescue Sanctuary',
    category: 'blue_cross',
    categoryLabel: 'Blue Cross Organization',
    address: '72 Cross Road, Near Central Animal Park, Metro Area',
    city: 'Hyderabad',
    phone: '+91 40 2354 4355',
    emergencyPhone: '+91 98490 12345',
    openingHours: '24 Hours Emergency Service',
    isOpen24Hours: true,
    servicesProvided: ['Animal Ambulance', 'Trauma Surgery', 'Sterilization', 'Shelter & Adoption', '24/7 Casualty'],
    latitude: 17.4375,
    longitude: 78.4482,
    verificationStatus: 'verified_partner',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Blue+Cross+Animal+Hospital',
    website: 'https://bluecross.org'
  },
  {
    id: 'srv-2',
    name: 'People For Animals (PFA) Rescue Helpline',
    category: 'welfare_ngo',
    categoryLabel: 'Animal Welfare NGO',
    address: 'Plot 14, Green Valley Enclave, Outer Ring Road',
    city: 'Hyderabad',
    phone: '+91 99899 33221',
    emergencyPhone: '+91 99899 33221',
    openingHours: '8:00 AM - 9:00 PM (Helpline 24/7)',
    isOpen24Hours: false,
    servicesProvided: ['Cruelty Investigation', 'Emergency Rescues', 'Mobile Clinic', 'Legal Assistance'],
    latitude: 17.4123,
    longitude: 78.4089,
    verificationStatus: 'verified_partner',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=People+For+Animals+Shelter'
  },
  {
    id: 'srv-3',
    name: 'Government Central Veterinary Hospital',
    category: 'govt_vet_hospital',
    categoryLabel: 'Govt. Veterinary Hospital',
    address: 'Opposite State Dairy Board, Seethaphalmandi',
    city: 'Hyderabad',
    phone: '+91 40 2761 2288',
    emergencyPhone: '+91 40 2761 2290',
    openingHours: 'Open 24 Hours (OPD: 8 AM - 2 PM)',
    isOpen24Hours: true,
    servicesProvided: ['Inpatient Ward', 'X-Ray & Ultrasound', 'Subsidized Medicine', 'Vaccination', 'Large Animal Treatment (Cattle/Equine)'],
    latitude: 17.4241,
    longitude: 78.5021,
    verificationStatus: 'verified_partner',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Government+Central+Veterinary+Hospital'
  },
  {
    id: 'srv-4',
    name: 'Karuna Wildlife Rescue & Rehabilitation Center',
    category: 'wildlife_rescue',
    categoryLabel: 'Wildlife Rescue Authority',
    address: 'Forest Department Transit Zone, Botanical Garden Area',
    city: 'Hyderabad',
    phone: '+91 40 2300 0180',
    emergencyPhone: '+91 94408 15200',
    openingHours: '24 Hours Rapid Response',
    isOpen24Hours: true,
    servicesProvided: ['Avian Rescue (Kites, Owls, Peafowl)', 'Reptile Catch & Release', 'Monkey & Deer First Aid', 'Forest Dept Liaison'],
    latitude: 17.4589,
    longitude: 78.3621,
    verificationStatus: 'verified_partner',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Wildlife+Rescue+Transit+Facility'
  },
  {
    id: 'srv-5',
    name: 'PawCare 24/7 Emergency Animal Ambulance',
    category: 'animal_ambulance',
    categoryLabel: 'Animal Ambulance & Pickup',
    address: 'Stationed at Road No. 36, Jubilee Hills',
    city: 'Hyderabad',
    phone: '+91 90000 88214',
    emergencyPhone: '+91 90000 88214',
    openingHours: '24/7 Mobile Dispatch',
    isOpen24Hours: true,
    servicesProvided: ['Oxygen-Equipped Ambulance', 'Stretcher for Heavy Cattle/Stray Dogs', 'On-Spot Triage', 'Emergency Transit'],
    latitude: 17.4332,
    longitude: 78.4071,
    verificationStatus: 'verified_partner',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Animal+Ambulance+Service'
  },
  {
    id: 'srv-6',
    name: 'District Government Veterinary Dispensary',
    category: 'govt_vet_dispensary',
    categoryLabel: 'Govt. Veterinary Dispensary',
    address: 'Near Old Municipal Complex, Amberpet Main Rd',
    city: 'Hyderabad',
    phone: '+91 40 2740 5511',
    openingHours: '8:30 AM - 1:30 PM (Mon-Sat)',
    isOpen24Hours: false,
    servicesProvided: ['Anti-Rabies Vaccines', 'De-worming', 'Minor Wound Dressing', 'Cattle & Goat Checkups'],
    latitude: 17.3912,
    longitude: 78.5144,
    verificationStatus: 'public_directory',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Veterinary+Dispensary'
  },
  {
    id: 'srv-7',
    name: 'Healing Paws Multi-Specialty Pet Hospital',
    category: 'private_vet_clinic',
    categoryLabel: 'Private Veterinary Hospital',
    address: 'Banjara Hills Road No. 12, MLA Colony',
    city: 'Hyderabad',
    phone: '+91 40 4012 9900',
    emergencyPhone: '+91 98855 44112',
    openingHours: 'Open 24/7 (Emergency & Critical Care ICU)',
    isOpen24Hours: true,
    servicesProvided: ['Blood Bank', 'Orthopedic Surgery', 'CT Scan & Diagnostics', 'Inpatient ICU', 'Specialist Feline & Canine Care'],
    latitude: 17.4182,
    longitude: 78.4356,
    verificationStatus: 'verified_partner',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Healing+Paws+Pet+Hospital'
  },
  {
    id: 'srv-8',
    name: 'VetLife Medical Store & Surgical Pharmacy',
    category: 'vet_pharmacy',
    categoryLabel: 'Veterinary Medical Store',
    address: 'Shop 4, Anand Complex, Lakdikapul Main Junction',
    city: 'Hyderabad',
    phone: '+91 40 2339 7780',
    openingHours: '7:30 AM - 11:00 PM Daily',
    isOpen24Hours: false,
    servicesProvided: ['Veterinary Antibiotics & Serums', 'Splints & Bandages', 'Tick & Flea Preventatives', 'Infusion Fluids & Catheters'],
    latitude: 17.4045,
    longitude: 78.4632,
    verificationStatus: 'public_directory',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Veterinary+Pharmacy'
  },
  {
    id: 'srv-9',
    name: 'Sanctuary of Hope Animal Shelter & Foster Base',
    category: 'animal_shelter',
    categoryLabel: 'Animal Shelter & Adoption',
    address: 'Survey No. 42, Tellapur Road, Near Eco Park',
    city: 'Hyderabad',
    phone: '+91 88970 12900',
    openingHours: '10:00 AM - 6:00 PM (Visitors)',
    isOpen24Hours: false,
    servicesProvided: ['Old & Disabled Animal Sanctuary', 'Foster Network', 'Adoption Counseling', 'Post-Op Recovery Wards'],
    latitude: 17.4691,
    longitude: 78.2980,
    verificationStatus: 'verified_partner',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Animal+Shelter+Adoption'
  },
  {
    id: 'srv-10',
    name: 'Street Angels Rapid Rescue Brigade',
    category: 'rescue_team',
    categoryLabel: 'Animal Rescue Team',
    address: 'Sector 8, Madhapur Tech Corridor',
    city: 'Hyderabad',
    phone: '+91 98480 99401',
    emergencyPhone: '+91 98480 99401',
    openingHours: '6:00 AM - 11:30 PM On-Call',
    isOpen24Hours: false,
    servicesProvided: ['Drain & Well Trap Rescues', 'Street Dog First Aid', 'Puppy Litter Relocation from Construction Sites', 'Feeder Network Support'],
    latitude: 17.4485,
    longitude: 78.3908,
    verificationStatus: 'verified_partner',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Animal+Rescue+Team'
  }
];

export const INITIAL_REPORTS: DistressReport[] = [
  {
    id: 'RPT-2026-8901',
    animalCategory: 'dog',
    observedProblem: 'road_accident',
    urgency: 'critical',
    description: 'Medium-sized indie stray dog hit by a two-wheeler. Bleeding from right hind leg, lying near the divider, conscious but unable to stand.',
    location: {
      address: 'Near Hitec City Flyover, Under Pillar 18, Cyberabad',
      latitude: 17.4474,
      longitude: 78.3762,
      landmark: 'Under Pillar 18 near petrol pump',
      city: 'Hyderabad'
    },
    incidentDateTime: '2026-10-14T07:15:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80',
    status: 'Help Contacted',
    statusHistory: [
      { status: 'Submitted', timestamp: '2026-10-14T07:16:00Z', note: 'Report lodged with photographic proof and GPS' },
      { status: 'Under Review', timestamp: '2026-10-14T07:20:00Z', note: 'Triaged by Petgram Emergency Desk. Urgency escalated to Critical.' },
      { status: 'Help Contacted', timestamp: '2026-10-14T07:25:00Z', note: 'Dispatched Street Angels Rapid Rescue Team (Vehicle #04) en route.' }
    ],
    reporter: {
      id: 'usr-1',
      name: 'Rohan Sharma',
      isAnonymous: false,
      contactMasked: '+91 98*** **412'
    },
    createdAt: '2026-10-14T07:16:00Z',
    updatedAt: '2026-10-14T07:25:00Z'
  },
  {
    id: 'RPT-2026-8902',
    animalCategory: 'cow',
    observedProblem: 'injured',
    urgency: 'high',
    description: 'Desi cow with a deep cut on left hoof from wire debris. Limping heavily and resting on roadside curb. Kindly dispatch a large animal ambulance.',
    location: {
      address: 'Gachibowli Stadium Road, Near Gate 3',
      latitude: 17.4435,
      longitude: 78.3582,
      landmark: 'Near fruit stalls opposite Gate 3',
      city: 'Hyderabad'
    },
    incidentDateTime: '2026-10-14T06:30:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=800&q=80',
    status: 'Under Review',
    statusHistory: [
      { status: 'Submitted', timestamp: '2026-10-14T06:35:00Z', note: 'Report logged by local commuter' },
      { status: 'Under Review', timestamp: '2026-10-14T06:45:00Z', note: 'Contacting Blue Cross Large Animal Recovery Unit' }
    ],
    reporter: {
      id: 'usr-2',
      name: 'Ananya Rao',
      isAnonymous: false,
      contactMasked: '+91 94*** **871'
    },
    createdAt: '2026-10-14T06:35:00Z',
    updatedAt: '2026-10-14T06:45:00Z'
  },
  {
    id: 'RPT-2026-8903',
    animalCategory: 'bird',
    observedProblem: 'trapped',
    urgency: 'medium',
    description: 'Black Kite entangled in glass manja string high up in an acacia tree branch. Flapping one wing, unable to free itself.',
    location: {
      address: 'KBR National Park Perimeter, Road No. 2, Banjara Hills',
      latitude: 17.4258,
      longitude: 78.4215,
      landmark: 'Tree near Park Gate 4',
      city: 'Hyderabad'
    },
    incidentDateTime: '2026-10-13T16:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=800&q=80',
    status: 'Resolved',
    statusHistory: [
      { status: 'Submitted', timestamp: '2026-10-13T16:05:00Z', note: 'Bird rescue reported with tree location' },
      { status: 'Under Review', timestamp: '2026-10-13T16:15:00Z', note: 'Karuna Wildlife Rescue alerted' },
      { status: 'Help Contacted', timestamp: '2026-10-13T16:30:00Z', note: 'Avian handler arrived with telescopic cutter' },
      { status: 'Resolved', timestamp: '2026-10-13T17:40:00Z', note: 'Kite freed safely, wing treated with antiseptic spray, released after observation.' }
    ],
    reporter: {
      id: 'usr-3',
      name: 'Praveen V.',
      isAnonymous: true
    },
    createdAt: '2026-10-13T16:05:00Z',
    updatedAt: '2026-10-13T17:40:00Z'
  },
  {
    id: 'RPT-2026-8904',
    animalCategory: 'cat',
    observedProblem: 'abandoned',
    urgency: 'medium',
    description: 'Litter of 4 newborn kittens found inside an open cardboard box near drainage outlet in the rain. Cold and crying.',
    location: {
      address: 'Sindhi Colony, Street 5, Secunderabad',
      latitude: 17.4422,
      longitude: 78.4988,
      landmark: 'Beside community park gate',
      city: 'Hyderabad'
    },
    incidentDateTime: '2026-10-13T19:20:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
    status: 'Help Contacted',
    statusHistory: [
      { status: 'Submitted', timestamp: '2026-10-13T19:22:00Z', note: 'Kittens rescue reported' },
      { status: 'Help Contacted', timestamp: '2026-10-13T19:45:00Z', note: 'Foster volunteer Priya S. responded, provided warming box and syringe milk formula' }
    ],
    reporter: {
      id: 'usr-4',
      name: 'Kavita M.',
      isAnonymous: false,
      contactMasked: '+91 97*** **339'
    },
    createdAt: '2026-10-13T19:22:00Z',
    updatedAt: '2026-10-13T19:45:00Z'
  }
];

export const INITIAL_POSTS: MissingFoundPost[] = [
  {
    id: 'POST-2026-101',
    type: 'missing',
    animalCategory: 'dog',
    breedOrAppearance: 'Golden Retriever Mix',
    color: 'Cream / Golden Brown',
    size: 'large',
    identifyingFeatures: 'Wearing a worn red nylon collar, black spot under lower lip, very friendly with kids',
    description: 'Our family dog "Bruno" bolted from our residential gate after thunderstorm fireworks. Extremely gentle, microchipped. Please reach out if spotted!',
    location: {
      address: 'Kondapur, Raghavendra Colony, Lane 4',
      city: 'Hyderabad',
      latitude: 17.4645,
      longitude: 78.3580
    },
    date: '2026-10-12',
    imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    creatorId: 'usr-10',
    creatorName: 'Sunita Nair',
    createdAt: '2026-10-12T14:30:00Z'
  },
  {
    id: 'POST-2026-102',
    type: 'found',
    animalCategory: 'dog',
    breedOrAppearance: 'Golden Retriever / Indie cross',
    color: 'Light Golden / Sand',
    size: 'large',
    identifyingFeatures: 'Red collar without nametag, small dark pigmentation mark on chin, docile and tired',
    description: 'Found a bewildered golden retriever cross sitting sheltered under the ATM veranda on Kondapur Main Road. Safe with local watchman. Seeking rightful owner.',
    location: {
      address: 'Kondapur Main Road, Near HDFC Bank ATM',
      city: 'Hyderabad',
      latitude: 17.4682,
      longitude: 78.3599
    },
    date: '2026-10-13',
    imageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    creatorId: 'usr-11',
    creatorName: 'Arjun Verma',
    createdAt: '2026-10-13T09:15:00Z'
  },
  {
    id: 'POST-2026-103',
    type: 'missing',
    animalCategory: 'cat',
    breedOrAppearance: 'Calico Domestic Shorthair',
    color: 'White with Ginger and Black patches',
    size: 'small',
    identifyingFeatures: 'Green eyes, nick on left ear tip, answers to "Mimi"',
    description: 'Indoor cat escaped from balcony window on 2nd floor. Very timid, likely hiding in basements, shrubs, or car engine bays.',
    location: {
      address: 'Somajiguda, Raj Bhavan Road, Apartment Block C',
      city: 'Hyderabad',
      latitude: 17.4255,
      longitude: 78.4578
    },
    date: '2026-10-11',
    imageUrl: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    creatorId: 'usr-12',
    creatorName: 'Dr. Sameera Khan',
    createdAt: '2026-10-11T18:40:00Z'
  },
  {
    id: 'POST-2026-104',
    type: 'found',
    animalCategory: 'cat',
    breedOrAppearance: 'Domestic Shorthair Tricolor',
    color: 'White, Ginger, Brown patches',
    size: 'small',
    identifyingFeatures: 'Striking emerald green eyes, slight cut on left ear',
    description: 'Found shivering behind our building generator shed. Safely in a warm crate with wet food. Owner please verify with photos.',
    location: {
      address: 'Somajiguda, Near Errum Manzil Metro Station',
      city: 'Hyderabad',
      latitude: 17.4221,
      longitude: 78.4552
    },
    date: '2026-10-12',
    imageUrl: 'https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?auto=format&fit=crop&w=800&q=80',
    status: 'reunited',
    creatorId: 'usr-14',
    creatorName: 'Vikas Reddy',
    createdAt: '2026-10-12T11:00:00Z'
  }
];

export const INITIAL_VOLUNTEERS: VolunteerApplication[] = [
  {
    id: 'VOL-2026-001',
    name: 'Priya Sundaram',
    emailMasked: 'pr***@gmail.com',
    phoneMasked: '+91 98*** **562',
    preferredRoles: ['foster_care', 'feeding_supply', 'first_aid'],
    serviceArea: 'Secunderabad & Begumpet',
    availability: 'Evenings & Weekends (15 hrs/wk)',
    experience: 'Fostered 20+ orphaned kittens and indie puppies over 3 years.',
    status: 'approved',
    createdAt: '2026-10-01T10:00:00Z'
  },
  {
    id: 'VOL-2026-002',
    name: 'Vikram Joshi',
    emailMasked: 'vi***@yahoo.com',
    phoneMasked: '+91 91*** **901',
    preferredRoles: ['transport_pickup', 'rapid_rescue'],
    serviceArea: 'Madhapur, Kondapur, Hitec City',
    availability: 'Full 24/7 on-call for road emergencies',
    experience: 'Own a hatchback fitted with safety crate and heavy-duty gloves.',
    status: 'approved',
    createdAt: '2026-10-05T14:30:00Z'
  },
  {
    id: 'VOL-2026-003',
    name: 'Deepa Narayanan',
    emailMasked: 'de***@outlook.com',
    phoneMasked: '+91 94*** **223',
    preferredRoles: ['veterinary_assist', 'awareness_campaigns'],
    serviceArea: 'Banjara Hills & Jubilee Hills',
    availability: 'Saturdays & Sundays',
    experience: 'Final year Veterinary Science undergraduate student.',
    status: 'approved',
    createdAt: '2026-10-08T09:20:00Z'
  }
];

export const DEMO_FIRST_AID_GUIDANCE: Record<string, AIFirstAidResponse> = {
  bleeding_dog: {
    source: 'demo-fallback',
    summary: 'Protocol for acute canine hemorrhage and road trauma triage.',
    immediatePrecautions: [
      'Personal Safety First: An injured animal in pain may bite instinctively. Do not place your face close to the animal.',
      'Muzzle gently if the dog is conscious and not vomiting or having respiratory distress (a clean cloth tie or leash can serve as a makeshift muzzle).',
      'Keep bystanders back to prevent panic and elevated heart rate.'
    ],
    safeActions: [
      'Apply direct, steady pressure to the bleeding wound using a clean cloth, sterile gauze, or towel for at least 5 unbroken minutes.',
      'If bleeding through the cloth, do NOT remove the original layer (it disrupts clotting); place additional clean towels over it.',
      'Keep the animal warm with a blanket or dry jacket to stave off hypothermic shock.',
      'Transport safely: Slide a flat, rigid board, firm cardboard box, or taut blanket underneath to serve as a makeshift stretcher.'
    ],
    actionsToAvoid: [
      'NEVER administer human painkillers (Paracetamol, Crocin, Ibuprofen, Aspirin). They cause fatal hepatic and renal toxicity in dogs and cats.',
      'Do NOT apply a tight arterial tourniquet unless trained—improper tourniquets cause irreversible tissue necrosis.',
      'Do NOT feed food or force-feed water to an animal in trauma or shock.'
    ],
    emergencyRedFlags: [
      'Pale white or blue gums (severe blood loss / circulatory collapse).',
      'Rapid shallow panting or agonal breathing.',
      'Unconsciousness or inability to move pupils.',
      'Blood spurting in pulses from an artery.'
    ],
    recommendedServices: [
      'Blue Cross Animal Hospital (24/7 Casualty)',
      'Emergency Animal Ambulance Dispatch',
      'Govt. Central Veterinary Hospital'
    ],
    disclaimer: 'DEMO GUIDANCE — NOT GENERATED BY LIVE GEMINI. This protocol is safe general triage guidance and does NOT replace immediate evaluation by a licensed veterinarian.'
  },
  trapped_bird: {
    source: 'demo-fallback',
    summary: 'Safe triage and handling for birds entangled in manja string or fence wires.',
    immediatePrecautions: [
      'Be extremely cautious around raptors (kites, hawks, owls) as their talons and beaks can cause puncture wounds. Always wear thick gardening gloves.',
      'Cover the bird’s head with a light, breathable towel or dark cloth; darkness naturally calms avian stress and prevents thrashing.'
    ],
    safeActions: [
      'Support the bird’s body gently, keeping both wings folded securely against its ribcage.',
      'Use blunt-tipped scissors or suture snips to carefully cut the free ends of the string; do NOT pull strings that are deeply wound around tendon joints.',
      'Place the bird inside a well-ventilated cardboard box with air holes, lined with soft paper towels, kept in a warm, quiet, dark room.',
      'Contact a specialized wildlife or avian rescue center immediately.'
    ],
    actionsToAvoid: [
      'Do NOT yank or pull manja string tightly embedded in wing skin or feathers—this can sever capillaries or tendons.',
      'Do NOT force-feed water into a bird’s beak with a dropper or syringe (high risk of fluid entering the trachea/lungs causing fatal aspiration).',
      'Do NOT release an entangled bird immediately even if it flies a few feet—it may suffer internal ligament tears or secondary shock.'
    ],
    emergencyRedFlags: [
      'Wing visibly drooping or bone protruding.',
      'Bird panting with beak wide open and eyes half closed.',
      'Bleeding from quill shafts or leg joints.'
    ],
    recommendedServices: [
      'Forest Department Wildlife Transit Center',
      'Karuna Wildlife Avian Clinic',
      'Avian Specialist Veterinary Hospital'
    ],
    disclaimer: 'DEMO GUIDANCE — NOT GENERATED BY LIVE GEMINI. Always contact authorized wildlife and avian rehabilitators for protected bird species.'
  },
  heatstroke_cattle: {
    source: 'demo-fallback',
    summary: 'Emergency cooling protocol for cattle and buffaloes suffering heat stress or dehydration.',
    immediatePrecautions: [
      'Do not stand directly behind cattle or in pinch zones; stressed large animals can kick or shift suddenly.',
      'Move the animal to shaded, well-ventilated cover if it is still mobile.'
    ],
    safeActions: [
      'Pour cool (NOT icy) water gently over the legs, neck, and flank to promote evaporative cooling.',
      'Fan the animal continuously to stimulate air circulation.',
      'Offer clean drinking water with veterinary electrolyte or jaggery/salt hydration mix only if the animal is conscious and swallowing voluntarily.',
      'Call the nearest Government Veterinary Dispensary or Livestock Inspector for immediate IV fluid therapy.'
    ],
    actionsToAvoid: [
      'Do NOT dump freezing ice water onto a severely overheating cow; rapid thermal shock can cause cardiac arrhythmia.',
      'Do NOT force or drench liquids down the throat if the animal is recumbent or semi-conscious.',
      'Do NOT hit, pull tails, or force a fallen animal to stand.'
    ],
    emergencyRedFlags: [
      'Heavy open-mouth breathing with tongue protruding and excessive frothing.',
      'Animal lying flat on side (lateral recumbency) unable to support neck.',
      'Dry muzzle and glassy, sunken eyes.'
    ],
    recommendedServices: [
      'District Government Veterinary Dispensary',
      'Livestock Mobile Emergency Unit',
      'Blue Cross Cattle Rescue Division'
    ],
    disclaimer: 'DEMO GUIDANCE — NOT GENERATED BY LIVE GEMINI. Severe cattle heatstroke requires prompt parenteral fluid therapy by a veterinary practitioner.'
  }
};
