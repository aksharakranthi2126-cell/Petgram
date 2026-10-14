import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  PlusCircle,
  MapPin,
  Calendar,
  CheckCircle2,
  Sparkles,
  MessageSquare,
  AlertCircle,
  X,
  Share2,
  ChevronRight,
  Loader2,
  Heart
} from 'lucide-react';
import { MissingFoundPost, AnimalCategory, PostType } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ImageUpload } from '../common/ImageUpload';
import { NavTab } from '../common/Navbar';

interface MissingFoundPageProps {
  onStartMessageWithPoster: (postId: string, postTitle: string, creatorId: string, creatorName: string) => void;
  onSelectTab: (tab: NavTab) => void;
}

export const MissingFoundPage: React.FC<MissingFoundPageProps> = ({
  onStartMessageWithPoster,
  onSelectTab
}) => {
  const { currentUser, isAdmin } = useAuth();
  const { showToast } = useToast();

  const [posts, setPosts] = useState<MissingFoundPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'missing' | 'found'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Create Post Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [postType, setPostType] = useState<PostType>('missing');
  const [animalCategory, setAnimalCategory] = useState<AnimalCategory>('dog');
  const [breedOrAppearance, setBreedOrAppearance] = useState('');
  const [color, setColor] = useState('');
  const [size, setSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [identifyingFeatures, setIdentifyingFeatures] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Hyderabad');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [imageUrl, setImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Match Modal State
  const [matchingPost, setMatchingPost] = useState<MissingFoundPost | null>(null);
  const [potentialMatches, setPotentialMatches] = useState<Array<{ post: MissingFoundPost; matchScore: number; matchReasons: string[] }>>([]);
  const [loadingMatches, setLoadingMatches] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await api.getPosts({
        type: activeTab !== 'all' ? activeTab : undefined,
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
        search: searchQuery.trim() || undefined
      });
      setPosts(data);
    } catch (err: any) {
      showToast('Could not load posts list.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [activeTab, categoryFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPosts();
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!breedOrAppearance.trim() || !description.trim() || !address.trim()) {
      showToast('Please fill in appearance, description, and location.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const newPost = await api.createPost({
        type: postType,
        animalCategory,
        breedOrAppearance: breedOrAppearance.trim(),
        color: color.trim() || 'Mixed / Unknown',
        size,
        identifyingFeatures: identifyingFeatures.trim() || 'None specified',
        description: description.trim(),
        location: {
          address: address.trim(),
          city
        },
        date,
        imageUrl: imageUrl || undefined,
        creatorId: currentUser.id,
        creatorName: currentUser.name
      });

      setPosts(prev => [newPost, ...prev]);
      setShowCreateModal(false);
      showToast(`${postType === 'missing' ? 'Missing pet' : 'Found animal'} post published!`, 'success');

      // Reset form
      setBreedOrAppearance('');
      setColor('');
      setDescription('');
      setAddress('');
      setImageUrl('');
    } catch (err: any) {
      showToast(err.message || 'Failed to publish post.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Match Check
  const handleCheckMatches = async (post: MissingFoundPost) => {
    setMatchingPost(post);
    setLoadingMatches(true);
    try {
      const matches = await api.getPostMatches(post.id);
      setPotentialMatches(matches);
    } catch (err) {
      showToast('Could not compute matches right now.', 'error');
    } finally {
      setLoadingMatches(false);
    }
  };

  const handleMarkReunited = async (postId: string) => {
    try {
      await api.updatePostStatus(postId, 'reunited');
      setPosts(prev =>
        prev.map(p => (p.id === postId ? { ...p, status: 'reunited' } : p))
      );
      showToast('Status updated: Marked as Reunited! 🎉', 'success');
    } catch (e) {
      showToast('Failed to update post status.', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold">
            <Search className="w-3.5 h-3.5" />
            <span>Community Reunification Registry</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Missing & Found Animals
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
            Report a lost family pet or an animal you found sheltered. Our algorithmic match scanner compares traits to find potential matches safely.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Publish Missing / Found Post</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Missing / Found Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Alerts
            </button>
            <button
              onClick={() => setActiveTab('missing')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'missing'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-rose-700'
              }`}
            >
              Missing Pets Only
            </button>
            <button
              onClick={() => setActiveTab('found')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'found'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-teal-700'
              }`}
            >
              Found Animals Only
            </button>
          </div>

          {/* Species Category Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold">Species:</span>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
            >
              <option value="all">All Species</option>
              <option value="dog">Dogs</option>
              <option value="cat">Cats</option>
              <option value="cow">Cattle / Cows</option>
              <option value="bird">Birds</option>
              <option value="rabbit">Rabbits</option>
              <option value="other">Other Animals</option>
            </select>
          </div>
        </div>

        {/* Search query input */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search keywords (e.g., 'Golden Retriever', 'Red collar', 'Kondapur', 'Calico cat')..."
            className="w-full pl-10 pr-24 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800"
          >
            Search
          </button>
        </form>
      </div>

      {/* Posts Grid */}
      {loading ? (
        <div className="text-center py-16 space-y-3">
          <Loader2 className="w-8 h-8 text-sky-600 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-600">
            Scanning missing & found listings...
          </p>
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <Search className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">No Listings Match</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try resetting your search query or publish a new alert if you recently lost or found an animal.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => {
            const isOwner = currentUser.id === post.creatorId || isAdmin;
            return (
              <div
                key={post.id}
                className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Image & Type Badge */}
                  <div className="h-52 bg-slate-100 relative overflow-hidden">
                    {post.imageUrl ? (
                      <img
                        src={post.imageUrl}
                        alt={post.breedOrAppearance}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-medium">
                        No Photo Available
                      </div>
                    )}

                    <div className="absolute top-3 left-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider text-white shadow-md ${
                          post.type === 'missing' ? 'bg-rose-600' : 'bg-teal-700'
                        }`}
                      >
                        {post.type === 'missing' ? 'Lost Animal' : 'Found Animal'}
                      </span>
                    </div>

                    {post.status === 'reunited' && (
                      <div className="absolute inset-0 bg-emerald-950/70 backdrop-blur-xs flex items-center justify-center">
                        <span className="px-4 py-2 bg-emerald-600 text-white rounded-2xl text-sm font-extrabold flex items-center gap-2 shadow-xl border border-emerald-400">
                          <CheckCircle2 className="w-5 h-5" /> REUNITED!
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                      <span>{post.id}</span>
                      <span className="text-slate-600 font-semibold capitalize bg-slate-100 px-2 py-0.5 rounded">
                        {post.animalCategory}
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                      {post.breedOrAppearance}
                    </h3>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <div>
                        <span className="font-bold text-slate-500">Color: </span>
                        <span>{post.color}</span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-500">Size: </span>
                        <span className="capitalize">{post.size}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="font-bold text-slate-500">Distinct Mark: </span>
                        <span className="truncate">{post.identifyingFeatures}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {post.description}
                    </p>

                    <div className="pt-1 text-xs text-slate-500 space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-700 truncate">
                        <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                        <span className="truncate">{post.location.address}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                        <Calendar className="w-3.5 h-3.5 shrink-0" />
                        <span>Date: {post.date}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-5 pt-0 space-y-2">
                  <div className="flex items-center gap-2">
                    {/* Check potential matches button */}
                    <button
                      onClick={() => handleCheckMatches(post)}
                      className="flex-1 py-2 px-3 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold border border-sky-200 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                      <span>Check Matches</span>
                    </button>

                    {/* Contact button */}
                    {post.creatorId !== currentUser.id && (
                      <button
                        onClick={() =>
                          onStartMessageWithPoster(
                            post.id,
                            `${post.breedOrAppearance} (${post.type.toUpperCase()})`,
                            post.creatorId,
                            post.creatorName
                          )
                        }
                        className="py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                        title="Send private internal message to reporter"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Message</span>
                      </button>
                    )}
                  </div>

                  {/* Mark as reunited if owner or admin */}
                  {isOwner && post.status !== 'reunited' && (
                    <button
                      onClick={() => handleMarkReunited(post.id)}
                      className="w-full py-1.5 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-800 text-[11px] font-bold hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Mark Animal Reunited / Resolved</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Potential Matches Modal */}
      {matchingPost && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-sky-600" />
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Potential Matches — Please Verify
                  </h3>
                  <p className="text-xs text-slate-500">
                    Target: {matchingPost.breedOrAppearance} ({matchingPost.type})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setMatchingPost(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {loadingMatches ? (
              <div className="py-12 text-center space-y-3">
                <Loader2 className="w-8 h-8 text-sky-600 animate-spin mx-auto" />
                <p className="text-xs font-semibold text-slate-600">
                  Scanning candidate records for appearance, size, and distance overlap...
                </p>
              </div>
            ) : potentialMatches.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-sm font-bold text-slate-800">No Strong Matches Identified Yet</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  No opposite ({matchingPost.type === 'missing' ? 'found' : 'missing'}) posts closely matched the physical characteristics or vicinity yet. New reports are logged continuously.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Disclaimer:</strong> Matching scores are algorithmic similarity indicators based on public descriptions. Never assume two animals are identical without examining identifying microchips, tags, or physical scars.
                  </span>
                </div>

                {potentialMatches.map(({ post, matchScore, matchReasons }) => (
                  <div
                    key={post.id}
                    className="p-4 rounded-2xl border-2 border-sky-100 bg-sky-50/30 hover:border-sky-300 transition-all flex flex-col sm:flex-row gap-4 items-start"
                  >
                    {post.imageUrl && (
                      <img
                        src={post.imageUrl}
                        alt="Match candidate"
                        className="w-24 h-24 object-cover rounded-xl shrink-0 border border-slate-200"
                      />
                    )}
                    <div className="flex-1 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-sm text-slate-900">
                          {post.breedOrAppearance} ({post.color})
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-sky-100 text-sky-800 border border-sky-300">
                          {matchScore}% Similarity
                        </span>
                      </div>

                      <p className="text-slate-600 line-clamp-2">{post.description}</p>

                      <div className="space-y-1 pt-1">
                        <p className="font-bold text-slate-700 text-[11px]">Match Factors:</p>
                        <div className="flex flex-wrap gap-1">
                          {matchReasons.map((reason, i) => (
                            <span
                              key={i}
                              className="text-[10px] bg-white border border-sky-200 text-sky-900 px-2 py-0.5 rounded-md font-medium"
                            >
                              ✓ {reason}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-[11px] text-slate-500">
                        <span>Reported at: {post.location.address}</span>
                        <button
                          onClick={() => {
                            setMatchingPost(null);
                            onStartMessageWithPoster(
                              post.id,
                              `Potential Match: ${post.breedOrAppearance}`,
                              post.creatorId,
                              post.creatorName
                            );
                          }}
                          className="px-3 py-1 bg-emerald-700 text-white rounded-lg font-bold hover:bg-emerald-800"
                        >
                          Send Message to Finder
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-sky-600" />
                <h3 className="text-lg font-extrabold text-slate-900">
                  Publish a Missing or Found Alert
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              {/* Type Switcher */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Are you reporting a Missing Pet or a Found Animal?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPostType('missing')}
                    className={`py-3 rounded-xl text-xs font-bold border transition-all ${
                      postType === 'missing'
                        ? 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-400/20'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    🐾 Missing (My Pet is Lost)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPostType('found')}
                    className={`py-3 rounded-xl text-xs font-bold border transition-all ${
                      postType === 'found'
                        ? 'bg-teal-50 border-teal-500 text-teal-900 ring-2 ring-teal-400/20'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    🔍 Found (I Found / Sheltered an Animal)
                  </button>
                </div>
              </div>

              {/* Animal Category */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Animal Type <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={animalCategory}
                    onChange={e => setAnimalCategory(e.target.value as AnimalCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="dog">Dog</option>
                    <option value="cat">Cat</option>
                    <option value="cow">Cow / Cattle</option>
                    <option value="bird">Bird</option>
                    <option value="rabbit">Rabbit</option>
                    <option value="other">Other Animal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Size
                  </label>
                  <select
                    value={size}
                    onChange={e => setSize(e.target.value as 'small' | 'medium' | 'large')}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="small">Small (Puppy / Kitten / Toy)</option>
                    <option value="medium">Medium (Indie / Beagle / Desi)</option>
                    <option value="large">Large (Labrador / Cow / Shepherd)</option>
                  </select>
                </div>
              </div>

              {/* Breed & Color */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Breed / Appearance <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={breedOrAppearance}
                    onChange={e => setBreedOrAppearance(e.target.value)}
                    placeholder="e.g. Golden Retriever, Calico Cat, Indie Mix"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Primary Colors
                  </label>
                  <input
                    type="text"
                    value={color}
                    onChange={e => setColor(e.target.value)}
                    placeholder="e.g. Cream & White, Black with tan paws"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              {/* Identifying Features */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Identifying Features (Collars, tags, ear notch, scars)
                </label>
                <input
                  type="text"
                  value={identifyingFeatures}
                  onChange={e => setIdentifyingFeatures(e.target.value)}
                  placeholder="e.g. Worn blue nylon collar, notched left ear, answers to 'Rocky'"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Image Upload */}
              <ImageUpload
                value={imageUrl}
                onChange={setImageUrl}
                label="Photograph of the Animal"
              />

              {/* Location & Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {postType === 'missing' ? 'Last Seen Location' : 'Found Location'} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="e.g. Kondapur Main Road near SBI"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Incident Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Description & Circumstances <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Provide context (e.g. bolted after fireworks, found shivering in basement, docile, microchipped)..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Publishing...</span>
                    </>
                  ) : (
                    <span>Publish Alert</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
