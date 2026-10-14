import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  ShieldCheck,
  User,
  Clock,
  AlertCircle,
  Loader2,
  Lock,
  ChevronLeft
} from 'lucide-react';
import { Conversation, Message } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface MessagesPageProps {
  initialConversationId?: string;
}

export const MessagesPage: React.FC<MessagesPageProps> = ({ initialConversationId }) => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(initialConversationId || null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  // Load conversations
  useEffect(() => {
    async function loadConversations() {
      setLoadingConvs(true);
      try {
        const convs = await api.getConversations();
        setConversations(convs);
        if (!activeConvId && convs.length > 0) {
          setActiveConvId(convs[0].id);
        }
      } catch (e) {
        showToast('Could not load conversations.', 'error');
      } finally {
        setLoadingConvs(false);
      }
    }
    loadConversations();
  }, []);

  // Load messages when activeConvId changes
  useEffect(() => {
    if (!activeConvId) return;
    async function loadMessages() {
      setLoadingMessages(true);
      try {
        const data = await api.getMessages(activeConvId!);
        setMessages(data);
      } catch (e) {
        showToast('Could not load message history.', 'error');
      } finally {
        setLoadingMessages(false);
      }
    }
    loadMessages();
  }, [activeConvId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConvId) return;

    setSending(true);
    try {
      const newMsg = await api.sendMessage(
        activeConvId,
        inputText.trim(),
        currentUser.id,
        currentUser.name
      );

      setMessages(prev => [...prev, newMsg]);
      setInputText('');

      // Update last message in conversation list
      setConversations(prev =>
        prev.map(c =>
          c.id === activeConvId
            ? { ...c, lastMessage: newMsg.text, updatedAt: new Date().toISOString() }
            : c
        )
      );
    } catch (err: any) {
      showToast(err.message || 'Failed to send message.', 'error');
    } finally {
      setSending(false);
    }
  };

  const activeConv = conversations.find(c => c.id === activeConvId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
          <Lock className="w-3.5 h-3.5" />
          <span>Private Internal Channel</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Petgram Secure Rescue Messages
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
          Coordinate animal handoffs, medical status checks, and pet reunifications without publishing your personal phone number or private email.
        </p>
      </div>

      {/* Safety Notice */}
      <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-900 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>
            <strong>Privacy Guard Active:</strong> Your contact credentials are never shared. Never transfer funds or advance fee deposits to unverified contacts.
          </span>
        </div>
        <span className="hidden sm:inline-block px-2.5 py-0.5 rounded bg-white text-emerald-800 text-[11px] font-bold border border-emerald-200 shrink-0">
          Encrypted Petgram Protocol
        </span>
      </div>

      {/* Main Chat Box Container */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
        {/* Left: Conversation List */}
        <div className={`md:col-span-5 lg:col-span-4 border-r border-slate-200 flex flex-col ${activeConvId ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-slate-200 bg-slate-50/50">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Rescue Conversations ({conversations.length})
            </h3>
          </div>

          <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
            {loadingConvs ? (
              <div className="p-8 text-center text-xs text-slate-400">Loading threads...</div>
            ) : conversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">No active conversations yet.</div>
            ) : (
              conversations.map(conv => {
                const isSelected = conv.id === activeConvId;
                const otherParticipant = conv.participants.find(p => p.id !== currentUser.id) || conv.participants[0];

                return (
                  <button
                    key={conv.id}
                    onClick={() => setActiveConvId(conv.id)}
                    className={`w-full p-4 text-left transition-colors flex items-start gap-3 cursor-pointer ${
                      isSelected ? 'bg-emerald-50/70 border-l-4 border-emerald-600' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                      {otherParticipant?.name?.slice(0, 2).toUpperCase() || 'P'}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {otherParticipant?.name}
                        </p>
                        <span className="text-[10px] text-slate-400">
                          {new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {conv.contextTitle && (
                        <p className="text-[11px] font-semibold text-emerald-700 truncate">
                          Re: {conv.contextTitle}
                        </p>
                      )}

                      <p className="text-xs text-slate-500 truncate">{conv.lastMessage}</p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Message Thread */}
        <div className={`md:col-span-7 lg:col-span-8 flex flex-col ${!activeConvId ? 'hidden md:flex' : 'flex'}`}>
          {activeConv ? (
            <>
              {/* Thread Header */}
              <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveConvId(null)}
                    className="md:hidden p-1 text-slate-600 hover:text-slate-900"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="w-9 h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                    {activeConv.participants.find(p => p.id !== currentUser.id)?.name?.slice(0, 2).toUpperCase() || 'PA'}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      {activeConv.participants.find(p => p.id !== currentUser.id)?.name || 'Rescue Coordinator'}
                    </h4>
                    {activeConv.contextTitle && (
                      <p className="text-[11px] text-emerald-700 font-medium truncate max-w-sm">
                        Context: {activeConv.contextTitle}
                      </p>
                    )}
                  </div>
                </div>

                <span className="text-[10px] font-mono font-bold text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {activeConv.id}
                </span>
              </div>

              {/* Messages Body */}
              <div className="flex-1 p-5 overflow-y-auto space-y-3 bg-[#FAF9F5]/40">
                {loadingMessages ? (
                  <div className="py-12 text-center text-xs text-slate-400">Loading messages...</div>
                ) : messages.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-400">
                    No messages yet. Send a message to coordinate rescue or verification.
                  </div>
                ) : (
                  messages.map(msg => {
                    const isMe = msg.senderId === currentUser.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                            isMe
                              ? 'bg-emerald-700 text-white rounded-br-xs'
                              : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                          }`}
                        >
                          <p className="font-semibold text-[10px] opacity-80 mb-1">
                            {isMe ? 'You' : msg.senderName}
                          </p>
                          <p>{msg.text}</p>
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 px-1">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Message Composer */}
              <form onSubmit={handleSendMessage} className="p-3.5 border-t border-slate-200 bg-white flex items-center gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  placeholder="Type a message (e.g., 'I have sheltered the puppy safely, please send ambulance')..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  disabled={sending || !inputText.trim()}
                  className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm disabled:opacity-50 transition-colors"
                >
                  {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  <span className="hidden sm:inline">Send</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-400 text-xs space-y-2">
              <div>
                <MessageSquare className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <p className="font-bold text-slate-600">Select a conversation</p>
                <p className="text-slate-400">Choose from the left to read or reply to messages.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
