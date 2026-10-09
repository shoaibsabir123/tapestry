import React, { useEffect } from 'react';
import { TapestryProvider, useTapestry } from './context/TapestryContext';
import { AppShell } from './components/layout/AppShell';
import { LandingPage } from './views/LandingPage';
import { DashboardView } from './views/DashboardView';
import { MomentsView } from './views/MomentsView';
import { MemoryDetailView } from './views/MemoryDetailView';
import { MemoryEditorView } from './views/MemoryEditorView';
import { ConstellationView } from './views/ConstellationView';
import { ReflectionsView } from './views/ReflectionsView';
import { TimelineView } from './views/TimelineView';
import { GalleryView } from './views/GalleryView';
import { ChaptersView } from './views/ChaptersView';
import { ChapterDetailView } from './views/ChapterDetailView';
import { FavoritesView } from './views/FavoritesView';
import { InsightsView } from './views/InsightsView';
import { ExportView } from './views/ExportView';
import { ProfileView } from './views/ProfileView';
import { SettingsView } from './views/SettingsView';
import { OnboardingView } from './views/OnboardingView';
import { SharedView } from './views/SharedView';
import { AuthView } from './views/AuthView';
import { ListingsView } from './views/ListingsView';
import { RecordChronicleView } from './views/RecordChronicleView';
import { CorporateGovernanceView } from './views/CorporateGovernanceView';

function AppContent() {
  const { currentRoute, selectedMemoryId, selectedChapterId, navigate } = useTapestry();

  // Initialize route from current window path if exists
  useEffect(() => {
    const path = window.location.pathname;
    if (path && path !== '/') {
      navigate(path);
    }
  }, []);

  // Determine current active view based on path
  const renderView = () => {
    if (currentRoute === '/') {
      return <LandingPage />;
    }

    if (currentRoute === '/login') {
      return <AuthView initialMode="login" />;
    }

    if (currentRoute === '/signup') {
      return <AuthView initialMode="signup" />;
    }

    if (currentRoute === '/onboarding') {
      return <OnboardingView />;
    }

    if (currentRoute.startsWith('/shared/')) {
      const sharedId = currentRoute.replace('/shared/', '');
      return <SharedView sharedId={sharedId} />;
    }

    if (currentRoute === '/dashboard') {
      return <DashboardView />;
    }

    if (currentRoute === '/moments') {
      return <MomentsView />;
    }

    if (currentRoute === '/listings' || currentRoute === '/featured') {
      return <ListingsView />;
    }

    if (
      currentRoute === '/record-chronicle' ||
      currentRoute === '/chronicle' ||
      currentRoute === '/chronicle/new' ||
      currentRoute === '/record' ||
      currentRoute.startsWith('/record-chronicle?')
    ) {
      return <RecordChronicleView />;
    }

    if (
      currentRoute === '/governance' ||
      currentRoute === '/corporate' ||
      currentRoute === '/compliance' ||
      currentRoute === '/audit'
    ) {
      return <CorporateGovernanceView />;
    }

    if (currentRoute === '/moments/new') {
      return <MemoryEditorView />;
    }

    if (currentRoute.startsWith('/moments/') && currentRoute.endsWith('/edit')) {
      const id = currentRoute.replace('/moments/', '').replace('/edit', '');
      return <MemoryEditorView editMemoryId={id} />;
    }

    if (currentRoute.startsWith('/moments/')) {
      const id = currentRoute.replace('/moments/', '');
      return <MemoryDetailView memoryId={selectedMemoryId || id} />;
    }

    if (currentRoute === '/constellation') {
      return <ConstellationView />;
    }

    if (currentRoute === '/reflections' || currentRoute === '/reflections/new') {
      return <ReflectionsView />;
    }

    if (currentRoute === '/timeline') {
      return <TimelineView />;
    }

    if (currentRoute === '/gallery') {
      return <GalleryView />;
    }

    if (currentRoute === '/chapters') {
      return <ChaptersView />;
    }

    if (currentRoute.startsWith('/chapters/')) {
      const id = currentRoute.replace('/chapters/', '');
      return <ChapterDetailView chapterId={selectedChapterId || id} />;
    }

    if (currentRoute === '/favorites') {
      return <FavoritesView />;
    }

    if (currentRoute === '/insights') {
      return <InsightsView />;
    }

    if (currentRoute === '/export') {
      return <ExportView />;
    }

    if (currentRoute === '/profile') {
      return <ProfileView />;
    }

    if (currentRoute === '/settings') {
      return <SettingsView />;
    }

    // Default fallback to dashboard
    return <DashboardView />;
  };

  return <AppShell>{renderView()}</AppShell>;
}

export default function App() {
  return (
    <TapestryProvider>
      <AppContent />
    </TapestryProvider>
  );
}
