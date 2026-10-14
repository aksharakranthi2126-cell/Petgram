import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { Navbar, NavTab } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HomePage } from './components/home/HomePage';
import { ReportAnimalPage } from './components/report/ReportAnimalPage';
import { NearbyHelpPage } from './components/nearby/NearbyHelpPage';
import { AIFirstAidPage } from './components/firstaid/AIFirstAidPage';
import { MissingFoundPage } from './components/missing/MissingFoundPage';
import { MessagesPage } from './components/messages/MessagesPage';
import { CommunityVolunteerPage } from './components/volunteer/CommunityVolunteerPage';
import { MyActivityPage } from './components/profile/MyActivityPage';
import { AdminDashboardPage } from './components/admin/AdminDashboardPage';
import { ReportDetailModal } from './components/report/ReportDetailModal';
import { DistressReport } from './types';
import { api } from './services/api';

function MainApp() {
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [selectedReport, setSelectedReport] = useState<DistressReport | null>(null);
  const [initialConvId, setInitialConvId] = useState<string | undefined>(undefined);
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const handleOpenReport = async (reportId: string) => {
    try {
      const rep = await api.getReport(reportId);
      setSelectedReport(rep);
    } catch {
      showToast('Could not load report details.', 'error');
    }
  };

  const handleOpenPost = (_postId: string) => {
    setCurrentTab('missing');
  };

  const handleStartMessage = async (
    contextId: string,
    contextTitle: string,
    creatorId: string,
    creatorName: string
  ) => {
    try {
      const conv = await api.createConversation({
        participants: [
          { id: currentUser.id, name: currentUser.name },
          { id: creatorId, name: creatorName }
        ],
        contextType: 'post',
        contextId,
        contextTitle,
        initialMessage: `Hi ${creatorName}, I am contacting you through Petgram regarding "${contextTitle}".`,
        senderName: currentUser.name
      });

      setInitialConvId(conv.id);
      setCurrentTab('messages');
      showToast(`Conversation opened with ${creatorName}`, 'success');
    } catch (e) {
      showToast('Could not initiate conversation.', 'error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-slate-800">
      <Navbar currentTab={currentTab} onSelectTab={setCurrentTab} />

      <main className="flex-1">
        {currentTab === 'home' && (
          <HomePage
            onSelectTab={setCurrentTab}
            onOpenReport={handleOpenReport}
            onOpenPost={handleOpenPost}
          />
        )}

        {currentTab === 'report' && (
          <ReportAnimalPage
            onSelectTab={setCurrentTab}
            onViewReport={handleOpenReport}
          />
        )}

        {currentTab === 'nearby' && <NearbyHelpPage />}

        {currentTab === 'firstaid' && <AIFirstAidPage />}

        {currentTab === 'missing' && (
          <MissingFoundPage
            onSelectTab={setCurrentTab}
            onStartMessageWithPoster={handleStartMessage}
          />
        )}

        {currentTab === 'community' && <CommunityVolunteerPage />}

        {currentTab === 'messages' && (
          <MessagesPage initialConversationId={initialConvId} />
        )}

        {currentTab === 'activity' && (
          <MyActivityPage
            onSelectTab={setCurrentTab}
            onOpenReport={handleOpenReport}
          />
        )}

        {currentTab === 'admin' && <AdminDashboardPage />}
      </main>

      <Footer onSelectTab={setCurrentTab} />

      {/* Report Details Modal */}
      {selectedReport && (
        <ReportDetailModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onStartMessage={handleStartMessage}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <MainApp />
      </ToastProvider>
    </AuthProvider>
  );
}
