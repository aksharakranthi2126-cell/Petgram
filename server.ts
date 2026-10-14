import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import {
  DistressReport,
  MissingFoundPost,
  RescueService,
  VolunteerApplication,
  Conversation,
  Message,
  AIFirstAidResponse
} from './src/types/index';
import {
  INITIAL_SERVICES,
  INITIAL_REPORTS,
  INITIAL_POSTS,
  INITIAL_VOLUNTEERS,
  DEMO_FIRST_AID_GUIDANCE
} from './src/data/seedData';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT || '3000', 10);
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'petgram-db.json');

// Ensure persistent data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface DatabaseSchema {
  reports: DistressReport[];
  posts: MissingFoundPost[];
  services: RescueService[];
  volunteers: VolunteerApplication[];
  conversations: Conversation[];
  messages: Message[];
}

// Initialize database with seed data if file does not exist
function loadDatabase(): DatabaseSchema {
  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      return {
        reports: parsed.reports || INITIAL_REPORTS,
        posts: parsed.posts || INITIAL_POSTS,
        services: parsed.services || INITIAL_SERVICES,
        volunteers: parsed.volunteers || INITIAL_VOLUNTEERS,
        conversations: parsed.conversations || [
          {
            id: 'conv-1',
            participants: [
              { id: 'usr-demo', name: 'You (Reporter)' },
              { id: 'usr-11', name: 'Arjun Verma (Foster Care)' }
            ],
            contextType: 'post',
            contextId: 'POST-2026-102',
            contextTitle: 'Golden Retriever Cross Found on Kondapur Road',
            lastMessage: 'Hi! I saw your post about the found dog. Does he respond to Bruno?',
            updatedAt: new Date(Date.now() - 3600000).toISOString(),
            unreadCount: 1
          }
        ],
        messages: parsed.messages || [
          {
            id: 'msg-1',
            conversationId: 'conv-1',
            senderId: 'usr-11',
            senderName: 'Arjun Verma',
            text: 'Hello! Thanks for reaching out. Yes, the dog is safely sheltered with the security watchman at our apartment. What distinctive marks does Bruno have?',
            createdAt: new Date(Date.now() - 3600000).toISOString()
          },
          {
            id: 'msg-2',
            conversationId: 'conv-1',
            senderId: 'usr-demo',
            senderName: 'You (Reporter)',
            text: 'He has a worn red nylon collar and a small dark pigmentation spot right under his lower lip!',
            createdAt: new Date(Date.now() - 1800000).toISOString()
          }
        ]
      };
    } catch (e) {
      console.error('Error reading db file, re-seeding:', e);
    }
  }

  const initialDb: DatabaseSchema = {
    reports: INITIAL_REPORTS,
    posts: INITIAL_POSTS,
    services: INITIAL_SERVICES,
    volunteers: INITIAL_VOLUNTEERS,
    conversations: [
      {
        id: 'conv-1',
        participants: [
          { id: 'usr-demo', name: 'You (Reporter)' },
          { id: 'usr-11', name: 'Arjun Verma (Foster Care)' }
        ],
        contextType: 'post',
        contextId: 'POST-2026-102',
        contextTitle: 'Golden Retriever Cross Found on Kondapur Road',
        lastMessage: 'He has a worn red nylon collar and a small dark pigmentation spot under lower lip!',
        updatedAt: new Date(Date.now() - 1800000).toISOString(),
        unreadCount: 0
      }
    ],
    messages: [
      {
        id: 'msg-1',
        conversationId: 'conv-1',
        senderId: 'usr-11',
        senderName: 'Arjun Verma',
        text: 'Hello! Thanks for reaching out. Yes, the dog is safely sheltered with the security watchman at our apartment. What distinctive marks does Bruno have?',
        createdAt: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 'msg-2',
        conversationId: 'conv-1',
        senderId: 'usr-demo',
        senderName: 'You (Reporter)',
        text: 'He has a worn red nylon collar and a small dark pigmentation spot right under his lower lip!',
        createdAt: new Date(Date.now() - 1800000).toISOString()
      }
    ]
  };

  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write initial db:', err);
  }
  return initialDb;
}

let db = loadDatabase();

function saveDatabase() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save db:', err);
  }
}

// Calculate Haversine distance in km
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '15mb' }));

  // --- API Endpoints ---

  // Health and Capabilities
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'Petgram API',
      version: '1.0.0',
      uptime: process.uptime(),
      geminiConfigured: !!process.env.GEMINI_API_KEY,
      storage: 'Persistent File Database',
      totalReports: db.reports.length,
      totalPosts: db.posts.length
    });
  });

  // Distress Reports
  app.get('/api/reports', (req: Request, res: Response) => {
    let result = [...db.reports];
    const { category, status, urgency, reporterId } = req.query;

    if (category && typeof category === 'string' && category !== 'all') {
      result = result.filter(r => r.animalCategory === category);
    }
    if (status && typeof status === 'string' && status !== 'all') {
      result = result.filter(r => r.status.toLowerCase() === status.toLowerCase());
    }
    if (urgency && typeof urgency === 'string' && urgency !== 'all') {
      result = result.filter(r => r.urgency === urgency);
    }
    if (reporterId && typeof reporterId === 'string') {
      result = result.filter(r => r.reporter.id === reporterId);
    }

    // Sort newest first
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json(result);
  });

  app.post('/api/reports', (req: Request, res: Response) => {
    const { animalCategory, observedProblem, urgency, description, location, incidentDateTime, imageUrl, reporter } = req.body;

    if (!animalCategory || !observedProblem || !description || !location?.address) {
      return res.status(400).json({ error: 'Missing required report fields (animalCategory, observedProblem, description, location.address)' });
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newReport: DistressReport = {
      id: `RPT-2026-${randomSuffix}`,
      animalCategory,
      observedProblem,
      urgency: urgency || 'high',
      description,
      location: {
        address: location.address,
        latitude: location.latitude,
        longitude: location.longitude,
        landmark: location.landmark || '',
        city: location.city || 'Local'
      },
      incidentDateTime: incidentDateTime || new Date().toISOString(),
      imageUrl: imageUrl || undefined,
      status: 'Submitted',
      statusHistory: [
        {
          status: 'Submitted',
          timestamp: new Date().toISOString(),
          note: 'Distress report lodged by compassionate citizen'
        }
      ],
      reporter: {
        id: reporter?.id || 'usr-guest',
        name: reporter?.name || 'Anonymous Good Samaritan',
        isAnonymous: reporter?.isAnonymous ?? false,
        contactMasked: reporter?.contactMasked || undefined
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.reports.unshift(newReport);
    saveDatabase();

    res.status(201).json(newReport);
  });

  app.get('/api/reports/:id', (req: Request, res: Response) => {
    const report = db.reports.find(r => r.id === req.params.id);
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    res.json(report);
  });

  app.patch('/api/reports/:id/status', (req: Request, res: Response) => {
    const { status, note, updatedBy } = req.body;
    const reportIndex = db.reports.findIndex(r => r.id === req.params.id);

    if (reportIndex === -1) {
      return res.status(404).json({ error: 'Report not found' });
    }

    const validStatuses = ['Submitted', 'Under Review', 'Help Contacted', 'Resolved', 'Unable to Verify'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const report = db.reports[reportIndex];
    report.status = status;
    report.updatedAt = new Date().toISOString();
    report.statusHistory.push({
      status,
      timestamp: new Date().toISOString(),
      note: note || `Status updated to ${status}`,
      updatedBy: updatedBy || 'Rescue Coordinator'
    });

    db.reports[reportIndex] = report;
    saveDatabase();
    res.json(report);
  });

  // Missing and Found Posts
  app.get('/api/posts', (req: Request, res: Response) => {
    let result = [...db.posts];
    const { type, category, status, search, creatorId } = req.query;

    if (type && typeof type === 'string' && type !== 'all') {
      result = result.filter(p => p.type === type);
    }
    if (category && typeof category === 'string' && category !== 'all') {
      result = result.filter(p => p.animalCategory === category);
    }
    if (status && typeof status === 'string' && status !== 'all') {
      result = result.filter(p => p.status === status);
    }
    if (creatorId && typeof creatorId === 'string') {
      result = result.filter(p => p.creatorId === creatorId);
    }
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      result = result.filter(
        p =>
          p.breedOrAppearance.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.location.address.toLowerCase().includes(q) ||
          p.identifyingFeatures.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json(result);
  });

  app.post('/api/posts', (req: Request, res: Response) => {
    const {
      type,
      animalCategory,
      breedOrAppearance,
      color,
      size,
      identifyingFeatures,
      description,
      location,
      date,
      imageUrl,
      creatorId,
      creatorName
    } = req.body;

    if (!type || !animalCategory || !breedOrAppearance || !description || !location?.address) {
      return res.status(400).json({ error: 'Missing required post fields' });
    }

    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const newPost: MissingFoundPost = {
      id: `POST-2026-${randomSuffix}`,
      type,
      animalCategory,
      breedOrAppearance,
      color: color || 'Mixed',
      size: size || 'medium',
      identifyingFeatures: identifyingFeatures || 'None specified',
      description,
      location: {
        address: location.address,
        latitude: location.latitude,
        longitude: location.longitude,
        city: location.city || 'Local'
      },
      date: date || new Date().toISOString().split('T')[0],
      imageUrl: imageUrl || undefined,
      status: 'active',
      creatorId: creatorId || 'usr-demo',
      creatorName: creatorName || 'Petgram Member',
      createdAt: new Date().toISOString()
    };

    db.posts.unshift(newPost);
    saveDatabase();
    res.status(201).json(newPost);
  });

  app.patch('/api/posts/:id/status', (req: Request, res: Response) => {
    const { status } = req.body;
    const postIndex = db.posts.findIndex(p => p.id === req.params.id);
    if (postIndex === -1) {
      return res.status(404).json({ error: 'Post not found' });
    }

    db.posts[postIndex].status = status;
    saveDatabase();
    res.json(db.posts[postIndex]);
  });

  // Potential Match Engine between Missing and Found posts
  app.get('/api/posts/:id/matches', (req: Request, res: Response) => {
    const targetPost = db.posts.find(p => p.id === req.params.id);
    if (!targetPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const oppositeType = targetPost.type === 'missing' ? 'found' : 'missing';
    const candidates = db.posts.filter(p => p.type === oppositeType && p.status === 'active');

    const matches = candidates
      .map(candidate => {
        let score = 0;
        const reasons: string[] = [];

        // Animal Category match (High weight)
        if (candidate.animalCategory === targetPost.animalCategory) {
          score += 40;
          reasons.push(`Same animal category (${candidate.animalCategory})`);
        } else {
          return null; // Different species cannot match
        }

        // Appearance / Breed keyword overlap
        const targetWords = `${targetPost.breedOrAppearance} ${targetPost.color}`.toLowerCase().split(/\s+/);
        const candWords = `${candidate.breedOrAppearance} ${candidate.color}`.toLowerCase().split(/\s+/);
        const overlap = targetWords.filter(w => w.length > 2 && candWords.includes(w));
        if (overlap.length > 0) {
          score += 25;
          reasons.push(`Similar physical traits: ${overlap.join(', ')}`);
        }

        // Size match
        if (candidate.size === targetPost.size) {
          score += 15;
          reasons.push(`Matching size (${candidate.size})`);
        }

        // Location proximity if coordinates available
        if (
          targetPost.location.latitude &&
          targetPost.location.longitude &&
          candidate.location.latitude &&
          candidate.location.longitude
        ) {
          const dist = calculateDistanceKm(
            targetPost.location.latitude,
            targetPost.location.longitude,
            candidate.location.latitude,
            candidate.location.longitude
          );
          if (dist <= 5) {
            score += 20;
            reasons.push(`Close vicinity: approx ${dist} km away`);
          } else if (dist <= 15) {
            score += 10;
            reasons.push(`Within metropolitan area: ${dist} km away`);
          }
        } else if (
          targetPost.location.city &&
          candidate.location.city &&
          targetPost.location.city.toLowerCase() === candidate.location.city.toLowerCase()
        ) {
          score += 10;
          reasons.push(`Reported in the same city (${candidate.location.city})`);
        }

        return {
          post: candidate,
          matchScore: Math.min(100, score),
          matchReasons: reasons
        };
      })
      .filter((m): m is NonNullable<typeof m> => m !== null && m.matchScore >= 40)
      .sort((a, b) => b.matchScore - a.matchScore);

    res.json(matches);
  });

  // Nearby Rescue Services Directory
  app.get('/api/services', (req: Request, res: Response) => {
    const { lat, lng, category, radiusKm } = req.query;
    let list = [...db.services];

    if (category && typeof category === 'string' && category !== 'all') {
      list = list.filter(s => s.category === category);
    }

    if (lat && lng) {
      const userLat = parseFloat(lat as string);
      const userLng = parseFloat(lng as string);

      if (!isNaN(userLat) && !isNaN(userLng)) {
        list = list.map(service => {
          const dist = calculateDistanceKm(userLat, userLng, service.latitude, service.longitude);
          return {
            ...service,
            distanceKm: dist
          };
        });

        const maxRadius = radiusKm ? parseFloat(radiusKm as string) : 50;
        if (!isNaN(maxRadius) && maxRadius > 0) {
          list = list.filter(s => (s.distanceKm ?? 0) <= maxRadius);
        }

        list.sort((a, b) => (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999));
      }
    }

    res.json(list);
  });

  // Gemini AI First-Aid Guidance Endpoint
  app.post('/api/guidance', async (req: Request, res: Response) => {
    const { animalType, observedCondition, symptoms, location } = req.body;

    if (!animalType || !observedCondition) {
      return res.status(400).json({ error: 'Please specify animal type and observed condition.' });
    }

    // Check if live Gemini API key is available
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI();
        const prompt = `You are a certified veterinary triage & animal emergency first-aid specialist for Petgram, a humane animal welfare platform.
Provide safe, structured, conservative emergency first-aid advice for a distressed animal.

STRICT VETERINARY SAFETY INSTRUCTIONS:
1. NEVER prescribe any oral medications, antibiotics, or human pharmaceuticals. Explicitly emphasize that human painkillers (such as paracetamol/crocin, ibuprofen, aspirin) are fatal to cats and dogs.
2. Emphasize human safety first: injured or panicked animals will bite or claw defensively.
3. Recommend non-invasive stabilization steps only (e.g. gentle pressure on bleeding wounds with clean cloth, warming, low-stress positioning, makeshift stretchers).
4. Highlight critical red-flag symptoms that demand immediate professional intervention.
5. Provide specific rescue service types to seek out immediately (e.g. 24/7 Animal Hospital, Avian Rescue, Large Animal Vet).

Distress Case Details:
- Animal Category: ${animalType}
- Observed Condition / Problem: ${observedCondition}
- Observed Symptoms / Details: ${symptoms || 'None specified'}
- Approximate Location: ${location || 'Local area'}

Return ONLY a valid JSON object matching this schema:
{
  "summary": "1-2 sentence overview of situation severity and immediate priority",
  "immediatePrecautions": ["precautions for handler safety and animal calm"],
  "safeActions": ["step-by-step non-invasive first-aid actions"],
  "actionsToAvoid": ["critical things NEVER to do, including toxic human medications"],
  "emergencyRedFlags": ["symptoms signaling life-threatening shock or trauma"],
  "recommendedServices": ["types of facilities to contact immediately"],
  "disclaimer": "Informational veterinary first-aid guidance only. Not a veterinary diagnosis or prescription. Always consult a licensed veterinarian immediately."
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json'
          }
        });

        const text = response.text || '';
        let parsed: AIFirstAidResponse;
        try {
          parsed = JSON.parse(text);
          parsed.source = 'gemini-live';
        } catch {
          // If JSON parsing fails, build a structured response
          parsed = {
            source: 'gemini-live',
            summary: `Immediate triage assessment for ${animalType} exhibiting ${observedCondition}.`,
            immediatePrecautions: [
              'Protect yourself: An animal in intense pain may bite or kick reflexively.',
              'Approach slowly at eye level; avoid loud noises or sudden gestures.'
            ],
            safeActions: [
              'Keep the animal in a warm, quiet, well-ventilated space.',
              'If bleeding, apply steady pressure using clean towels or sterile gauze.',
              'Prepare a rigid board or blanket to serve as a stretcher for transport.'
            ],
            actionsToAvoid: [
              'NEVER give human painkillers (Paracetamol, Ibuprofen, Aspirin). They cause fatal organ failure.',
              'Do not force-feed liquids if the animal is recumbent, choking, or convulsing.'
            ],
            emergencyRedFlags: [
              'Pale white or grayish gums, blue tongue, or severe respiratory distress.',
              'Loss of consciousness or seizures.'
            ],
            recommendedServices: [
              '24/7 Veterinary Hospital',
              'Animal Ambulance & Rescue Helpline'
            ],
            disclaimer: 'Informational veterinary first-aid guidance generated by Gemini 3.8 Flash. Always consult a licensed veterinarian immediately.'
          };
        }

        return res.json(parsed);
      } catch (geminiError: any) {
        console.warn('Gemini live call error, activating safe fallback:', geminiError?.message);
      }
    }

    // Conservative Safe Fallback when API key is unconfigured or call fails
    let fallbackKey = 'bleeding_dog';
    const animalLower = (animalType || '').toLowerCase();
    const condLower = (observedCondition || '').toLowerCase();

    if (animalLower.includes('bird')) {
      fallbackKey = 'trapped_bird';
    } else if (animalLower.includes('cow') || animalLower.includes('buffalo') || animalLower.includes('goat')) {
      fallbackKey = 'heatstroke_cattle';
    }

    const fallbackResponse = DEMO_FIRST_AID_GUIDANCE[fallbackKey] || DEMO_FIRST_AID_GUIDANCE['bleeding_dog'];
    return res.json({
      ...fallbackResponse,
      summary: `[DEMO GUIDANCE] Safe non-invasive emergency triage for ${animalType} (${observedCondition}).`,
      source: 'demo-fallback'
    });
  });

  // Volunteer Applications with Server-Side Authorization & Audit Trail
  app.get('/api/volunteers', (req: Request, res: Response) => {
    const requestingRole = req.headers['x-user-role'] as string | undefined;
    const requestingUserId = req.headers['x-user-id'] as string | undefined;
    const targetUserId = req.query.userId as string | undefined;

    // Case 1: Specific user is requesting their own applications
    if (targetUserId) {
      if (requestingRole === 'admin' || requestingUserId === targetUserId) {
        const userApps = db.volunteers.filter(v => v.userId === targetUserId);
        return res.json(userApps);
      } else {
        return res.status(403).json({
          error: 'Forbidden: You do not have permission to view volunteer applications belonging to another user.'
        });
      }
    }

    // Case 2: Admin requests all applications for the review queue
    if (requestingRole === 'admin') {
      return res.json(db.volunteers);
    }

    // Case 3: Public / Ordinary user directory view
    // Only return approved volunteers and mask sensitive details (no private review notes or unapproved applications)
    const approvedPublic = db.volunteers
      .filter(v => v.status === 'approved')
      .map(v => ({
        id: v.id,
        name: v.name,
        emailMasked: v.emailMasked,
        phoneMasked: v.phoneMasked,
        preferredRoles: v.preferredRoles,
        serviceArea: v.serviceArea,
        availability: v.availability,
        experience: v.experience,
        status: v.status,
        createdAt: v.createdAt
      }));

    res.json(approvedPublic);
  });

  app.get('/api/volunteers/:id', (req: Request, res: Response) => {
    const requestingRole = req.headers['x-user-role'] as string | undefined;
    const requestingUserId = req.headers['x-user-id'] as string | undefined;

    const vol = db.volunteers.find(v => v.id === req.params.id);
    if (!vol) {
      return res.status(404).json({ error: 'Volunteer application not found' });
    }

    // Authorized if admin or the owner
    if (requestingRole === 'admin' || (requestingUserId && vol.userId === requestingUserId)) {
      return res.json(vol);
    }

    // If approved, return sanitized public info
    if (vol.status === 'approved') {
      return res.json({
        id: vol.id,
        name: vol.name,
        emailMasked: vol.emailMasked,
        phoneMasked: vol.phoneMasked,
        preferredRoles: vol.preferredRoles,
        serviceArea: vol.serviceArea,
        availability: vol.availability,
        experience: vol.experience,
        status: vol.status,
        createdAt: vol.createdAt
      });
    }

    return res.status(403).json({
      error: 'Forbidden: Private application under review. Only authorized administrators and the applicant may access this record.'
    });
  });

  app.post('/api/volunteers', (req: Request, res: Response) => {
    const { name, email, phone, preferredRoles, serviceArea, availability, experience } = req.body;
    const requestingUserId = (req.body.userId || req.headers['x-user-id'] || 'usr-demo') as string;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ error: 'Please enter a valid full name (minimum 2 characters).' });
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    if (!Array.isArray(preferredRoles) || preferredRoles.length === 0) {
      return res.status(400).json({ error: 'Please select at least one preferred volunteer role.' });
    }

    if (!serviceArea || typeof serviceArea !== 'string' || serviceArea.trim().length < 2) {
      return res.status(400).json({ error: 'Please specify your general service area or locality.' });
    }

    // Mask sensitive contact details for public views
    const emailParts = email.split('@');
    const maskedEmail = emailParts[0].slice(0, 2) + '***@' + (emailParts[1] || 'domain.com');
    const phoneStr = (phone || '').toString();
    const maskedPhone = phoneStr.length >= 7 ? phoneStr.slice(0, 4) + '*** **' + phoneStr.slice(-3) : '+91 98*** **000';

    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const now = new Date().toISOString();
    const newVolunteer: VolunteerApplication = {
      id: `VOL-2026-${randomSuffix}`,
      userId: requestingUserId,
      name: name.trim(),
      email: email.trim(),
      phone: phoneStr.trim() || undefined,
      emailMasked: maskedEmail,
      phoneMasked: maskedPhone,
      preferredRoles,
      serviceArea: serviceArea.trim(),
      availability: (availability || 'Flexible').trim(),
      experience: (experience || 'Passionate animal advocate ready to assist on-ground.').trim(),
      status: 'pending',
      statusHistory: [
        {
          status: 'pending',
          timestamp: now,
          note: 'Volunteer application submitted. Awaiting Rescue Desk coordinator verification.'
        }
      ],
      createdAt: now,
      updatedAt: now
    };

    db.volunteers.unshift(newVolunteer);
    saveDatabase();
    res.status(201).json(newVolunteer);
  });

  app.patch('/api/volunteers/:id/status', (req: Request, res: Response) => {
    const requestingRole = req.headers['x-user-role'] as string | undefined;
    const reviewerName = (req.body.reviewerName || req.headers['x-user-name'] || 'Rescue Desk Admin') as string;

    // Strict server-side authorization check
    if (requestingRole !== 'admin') {
      return res.status(403).json({
        error: 'Forbidden: Administrator privileges required to review or update volunteer applications. Ordinary users cannot modify application statuses.'
      });
    }

    const { status, reviewNote } = req.body;
    const validStatuses = ['pending', 'under_review', 'approved', 'rejected'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        error: `Invalid status. Allowed values: ${validStatuses.join(', ')}`
      });
    }

    const volIndex = db.volunteers.findIndex(v => v.id === req.params.id);
    if (volIndex === -1) {
      return res.status(404).json({ error: 'Volunteer application not found' });
    }

    const vol = db.volunteers[volIndex];
    const now = new Date().toISOString();

    vol.status = status;
    vol.reviewNote = reviewNote !== undefined ? reviewNote.trim() : vol.reviewNote;
    vol.reviewedBy = reviewerName;
    vol.reviewedAt = now;
    vol.updatedAt = now;

    if (!vol.statusHistory) {
      vol.statusHistory = [];
    }

    vol.statusHistory.push({
      status,
      timestamp: now,
      note: reviewNote?.trim() || `Status updated to ${status.replace('_', ' ')} by ${reviewerName}`,
      updatedBy: reviewerName
    });

    db.volunteers[volIndex] = vol;
    saveDatabase();
    res.json(vol);
  });

  // Internal Private Messaging Endpoints
  app.get('/api/conversations', (req: Request, res: Response) => {
    const { userId } = req.query;
    if (userId && typeof userId === 'string') {
      const userConvs = db.conversations.filter(c => c.participants.some(p => p.id === userId));
      return res.json(userConvs);
    }
    res.json(db.conversations);
  });

  app.post('/api/conversations', (req: Request, res: Response) => {
    const { participants, contextType, contextId, contextTitle, initialMessage, senderName } = req.body;

    if (!participants || participants.length < 2) {
      return res.status(400).json({ error: 'At least two participants required' });
    }

    // Check if conversation already exists for same context
    const existing = db.conversations.find(
      c => c.contextType === contextType && c.contextId === contextId
    );

    if (existing) {
      return res.json(existing);
    }

    const convId = `conv-${Date.now()}`;
    const newConv: Conversation = {
      id: convId,
      participants,
      contextType: contextType || 'general',
      contextId: contextId || undefined,
      contextTitle: contextTitle || 'Direct Message',
      lastMessage: initialMessage || 'Conversation started',
      updatedAt: new Date().toISOString(),
      unreadCount: 0
    };

    db.conversations.unshift(newConv);

    if (initialMessage) {
      db.messages.push({
        id: `msg-${Date.now()}`,
        conversationId: convId,
        senderId: participants[0]?.id || 'usr-demo',
        senderName: senderName || participants[0]?.name || 'Sender',
        text: initialMessage,
        createdAt: new Date().toISOString()
      });
    }

    saveDatabase();
    res.status(201).json(newConv);
  });

  app.get('/api/conversations/:id/messages', (req: Request, res: Response) => {
    const convMessages = db.messages.filter(m => m.conversationId === req.params.id);
    res.json(convMessages);
  });

  app.post('/api/conversations/:id/messages', (req: Request, res: Response) => {
    const { senderId, senderName, text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Message text cannot be empty' });
    }

    const convIndex = db.conversations.findIndex(c => c.id === req.params.id);
    if (convIndex === -1) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      conversationId: req.params.id,
      senderId: senderId || 'usr-demo',
      senderName: senderName || 'Good Samaritan',
      text: text.trim(),
      createdAt: new Date().toISOString()
    };

    db.messages.push(newMsg);

    // Update conversation lastMessage & timestamp
    db.conversations[convIndex].lastMessage = text.trim();
    db.conversations[convIndex].updatedAt = new Date().toISOString();

    saveDatabase();
    res.status(201).json(newMsg);
  });

  // Aggregate Real Stats (from persistent records)
  app.get('/api/stats', (_req: Request, res: Response) => {
    const totalReports = db.reports.length;
    const activeReports = db.reports.filter(r => r.status === 'Submitted' || r.status === 'Under Review' || r.status === 'Help Contacted').length;
    const resolvedReports = db.reports.filter(r => r.status === 'Resolved').length;
    const missingPosts = db.posts.filter(p => p.type === 'missing' && p.status === 'active').length;
    const reunitedPets = db.posts.filter(p => p.status === 'reunited').length;
    const volunteerCount = db.volunteers.length;
    const verifiedServicesCount = db.services.length;

    res.json({
      totalReports,
      activeReports,
      resolvedReports,
      missingPosts,
      reunitedPets,
      volunteerCount,
      verifiedServicesCount,
      isDemoData: false
    });
  });

  // Serve static files or Vite middleware
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[PETGRAM] Full-stack Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('[PETGRAM] Server failed to start:', err);
  process.exit(1);
});
