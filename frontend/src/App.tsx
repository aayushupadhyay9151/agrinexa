import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { Navbar } from './components/layout/Navbar.js';
import { Footer } from './components/layout/Footer.js';

import { LandingPage } from './pages/LandingPage.js';
import { DashboardPage } from './pages/DashboardPage.js';
import { NewAnalysisPage } from './pages/NewAnalysisPage.js';
import { AnalysisReportPage } from './pages/AnalysisReportPage.js';
import { WeatherExplorerPage } from './pages/WeatherExplorerPage.js';
import { HistoryPage } from './pages/HistoryPage.js';
import { ProfilePage } from './pages/ProfilePage.js';
import { LoginPage } from './pages/LoginPage.js';
import { RegisterPage } from './pages/RegisterPage.js';
import { HowItWorksPage } from './pages/HowItWorksPage.js';
import { AboutPage } from './pages/AboutPage.js';

function MainApp() {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [activeAnalysisId, setActiveAnalysisId] = useState<string | null>(null);

  // Switch to report view
  const handleViewAnalysis = (id: string) => {
    setActiveAnalysisId(id);
    setCurrentTab('report');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartAnalysis = () => {
    setCurrentTab('new-analysis');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      <main className="flex-1">
        {currentTab === 'home' && (
          <LandingPage
            onStartAnalysis={handleStartAnalysis}
            onNavigateTab={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardPage
            onStartNewAnalysis={handleStartAnalysis}
            onViewAnalysis={handleViewAnalysis}
          />
        )}

        {currentTab === 'new-analysis' && (
          <NewAnalysisPage
            onCompleteAnalysis={(id) => handleViewAnalysis(id)}
            onCancel={() => setCurrentTab(user ? 'dashboard' : 'home')}
          />
        )}

        {currentTab === 'report' && activeAnalysisId && (
          <AnalysisReportPage
            analysisId={activeAnalysisId}
            onBack={() => setCurrentTab(user ? 'dashboard' : 'history')}
          />
        )}

        {currentTab === 'weather' && (
          <WeatherExplorerPage
            onStartAnalysisWithLocation={(loc) => {
              setCurrentTab('new-analysis');
            }}
          />
        )}

        {currentTab === 'history' && (
          <HistoryPage
            onStartNewAnalysis={handleStartAnalysis}
            onViewAnalysis={handleViewAnalysis}
          />
        )}

        {currentTab === 'profile' && <ProfilePage />}

        {currentTab === 'login' && (
          <LoginPage
            onSuccess={() => setCurrentTab('dashboard')}
            onNavigateToRegister={() => setCurrentTab('register')}
          />
        )}

        {currentTab === 'register' && (
          <RegisterPage
            onSuccess={() => setCurrentTab('dashboard')}
            onNavigateToLogin={() => setCurrentTab('login')}
          />
        )}

        {currentTab === 'how-it-works' && (
          <HowItWorksPage onStartAnalysis={handleStartAnalysis} />
        )}

        {currentTab === 'about' && <AboutPage />}
      </main>

      <Footer setCurrentTab={setCurrentTab} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
