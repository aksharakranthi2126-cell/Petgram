import {
  DistressReport,
  MissingFoundPost,
  RescueService,
  VolunteerApplication,
  Conversation,
  Message,
  AIFirstAidRequest,
  AIFirstAidResponse,
  SystemStats
} from '../types';

const API_BASE = '/api';

export const api = {
  // Health
  async getHealth() {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  },

  // Distress Reports
  async getReports(params?: { category?: string; status?: string; urgency?: string; reporterId?: string }): Promise<DistressReport[]> {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set('category', params.category);
    if (params?.status) searchParams.set('status', params.status);
    if (params?.urgency) searchParams.set('urgency', params.urgency);
    if (params?.reporterId) searchParams.set('reporterId', params.reporterId);

    const query = searchParams.toString();
    const res = await fetch(`${API_BASE}/reports${query ? `?${query}` : ''}`);
    if (!res.ok) throw new Error('Failed to fetch distress reports');
    return res.json();
  },

  async getReport(id: string): Promise<DistressReport> {
    const res = await fetch(`${API_BASE}/reports/${id}`);
    if (!res.ok) throw new Error('Report not found');
    return res.json();
  },

  async createReport(reportData: Partial<DistressReport>): Promise<DistressReport> {
    const res = await fetch(`${API_BASE}/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reportData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to submit report');
    }
    return res.json();
  },

  async updateReportStatus(id: string, status: string, note?: string, updatedBy?: string): Promise<DistressReport> {
    const res = await fetch(`${API_BASE}/reports/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, note, updatedBy })
    });
    if (!res.ok) throw new Error('Failed to update report status');
    return res.json();
  },

  // Missing & Found Posts
  async getPosts(params?: { type?: string; category?: string; status?: string; search?: string; creatorId?: string }): Promise<MissingFoundPost[]> {
    const searchParams = new URLSearchParams();
    if (params?.type) searchParams.set('type', params.type);
    if (params?.category) searchParams.set('category', params.category);
    if (params?.status) searchParams.set('status', params.status);
    if (params?.search) searchParams.set('search', params.search);
    if (params?.creatorId) searchParams.set('creatorId', params.creatorId);

    const query = searchParams.toString();
    const res = await fetch(`${API_BASE}/posts${query ? `?${query}` : ''}`);
    if (!res.ok) throw new Error('Failed to fetch posts');
    return res.json();
  },

  async createPost(postData: Partial<MissingFoundPost>): Promise<MissingFoundPost> {
    const res = await fetch(`${API_BASE}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to publish post');
    }
    return res.json();
  },

  async updatePostStatus(id: string, status: string): Promise<MissingFoundPost> {
    const res = await fetch(`${API_BASE}/posts/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Failed to update post status');
    return res.json();
  },

  async getPostMatches(postId: string): Promise<Array<{ post: MissingFoundPost; matchScore: number; matchReasons: string[] }>> {
    const res = await fetch(`${API_BASE}/posts/${postId}/matches`);
    if (!res.ok) throw new Error('Failed to fetch post matches');
    return res.json();
  },

  // Services Directory
  async getServices(params?: { lat?: number; lng?: number; category?: string; radiusKm?: number }): Promise<RescueService[]> {
    const searchParams = new URLSearchParams();
    if (params?.lat !== undefined) searchParams.set('lat', params.lat.toString());
    if (params?.lng !== undefined) searchParams.set('lng', params.lng.toString());
    if (params?.category) searchParams.set('category', params.category);
    if (params?.radiusKm) searchParams.set('radiusKm', params.radiusKm.toString());

    const query = searchParams.toString();
    const res = await fetch(`${API_BASE}/services${query ? `?${query}` : ''}`);
    if (!res.ok) throw new Error('Failed to fetch services');
    return res.json();
  },

  // Gemini AI First-Aid Guidance
  async getGuidance(request: AIFirstAidRequest): Promise<AIFirstAidResponse> {
    const res = await fetch(`${API_BASE}/guidance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to generate guidance');
    }
    return res.json();
  },

  // Volunteers with Authentication & Role Headers
  async getVolunteers(
    params?: { userId?: string },
    auth?: { id?: string; role?: string }
  ): Promise<VolunteerApplication[]> {
    const searchParams = new URLSearchParams();
    if (params?.userId) searchParams.set('userId', params.userId);

    const headers: Record<string, string> = {};
    if (auth?.id) headers['x-user-id'] = auth.id;
    if (auth?.role) headers['x-user-role'] = auth.role;

    const query = searchParams.toString();
    const res = await fetch(`${API_BASE}/volunteers${query ? `?${query}` : ''}`, { headers });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to fetch volunteers');
    }
    return res.json();
  },

  async getVolunteer(id: string, auth?: { id?: string; role?: string }): Promise<VolunteerApplication> {
    const headers: Record<string, string> = {};
    if (auth?.id) headers['x-user-id'] = auth.id;
    if (auth?.role) headers['x-user-role'] = auth.role;

    const res = await fetch(`${API_BASE}/volunteers/${id}`, { headers });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to fetch volunteer application');
    }
    return res.json();
  },

  async applyVolunteer(
    data: Partial<VolunteerApplication>,
    auth?: { id?: string; role?: string }
  ): Promise<VolunteerApplication> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (auth?.id) headers['x-user-id'] = auth.id;
    if (auth?.role) headers['x-user-role'] = auth.role;

    const res = await fetch(`${API_BASE}/volunteers`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to submit application');
    }
    return res.json();
  },

  async updateVolunteerStatus(
    id: string,
    status: string,
    reviewNote?: string,
    reviewerName?: string,
    auth?: { id?: string; role?: string; name?: string }
  ): Promise<VolunteerApplication> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (auth?.id) headers['x-user-id'] = auth.id;
    if (auth?.role) headers['x-user-role'] = auth.role;
    if (auth?.name) headers['x-user-name'] = auth.name;

    const res = await fetch(`${API_BASE}/volunteers/${id}/status`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ status, reviewNote, reviewerName: reviewerName || auth?.name })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update volunteer status');
    }
    return res.json();
  },

  // Conversations & Private Messages
  async getConversations(userId?: string): Promise<Conversation[]> {
    const query = userId ? `?userId=${encodeURIComponent(userId)}` : '';
    const res = await fetch(`${API_BASE}/conversations${query}`);
    if (!res.ok) throw new Error('Failed to fetch conversations');
    return res.json();
  },

  async createConversation(data: {
    participants: Array<{ id: string; name: string; role?: string }>;
    contextType?: 'report' | 'post' | 'general';
    contextId?: string;
    contextTitle?: string;
    initialMessage?: string;
    senderName?: string;
  }): Promise<Conversation> {
    const res = await fetch(`${API_BASE}/conversations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to start conversation');
    return res.json();
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    const res = await fetch(`${API_BASE}/conversations/${conversationId}/messages`);
    if (!res.ok) throw new Error('Failed to fetch messages');
    return res.json();
  },

  async sendMessage(conversationId: string, text: string, senderId: string, senderName: string): Promise<Message> {
    const res = await fetch(`${API_BASE}/conversations/${conversationId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, senderId, senderName })
    });
    if (!res.ok) throw new Error('Failed to send message');
    return res.json();
  },

  // Real aggregate stats
  async getStats(): Promise<SystemStats> {
    const res = await fetch(`${API_BASE}/stats`);
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  }
};
