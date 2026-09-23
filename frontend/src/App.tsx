import React, { useState } from 'react';
import { ToastProvider } from './context/ToastContext';
import { BusinessProvider, useBusiness } from './context/BusinessContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { BusinessSetupPage } from './pages/BusinessSetupPage';
import { DashboardPage } from './pages/DashboardPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { InventoryPage } from './pages/InventoryPage';
import { CustomersPage } from './pages/CustomersPage';
import { InsightsPage } from './pages/InsightsPage';
import { SimulatorPage } from './pages/SimulatorPage';
import { AssistantPage } from './pages/AssistantPage';
import { AlertsPage } from './pages/AlertsPage';
import { DecisionsPage } from './pages/DecisionsPage';
import { ReportsPage } from './pages/ReportsPage';
import { DataUploadPage } from './pages/DataUploadPage';
import { SettingsPage } from './pages/SettingsPage';

function AppContent() {
  const { activeTab } = useBusiness();
  const [currentView, setCurrentView] = useState<'landing' | 'login' | 'setup' | 'app'>('login');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // If outside main app
  if (currentView === 'landing') {
    return (
      <LandingPage
        onEnterApp={() => setCurrentView('login')}
      />
    );
  }

  if (currentView === 'login') {
    return (
      <LoginPage
        onSuccess={() => setCurrentView('app')}
        onGoBack={() => setCurrentView('landing')}
      />
    );
  }

  if (currentView === 'setup') {
    return (
      <BusinessSetupPage
        onComplete={() => setCurrentView('app')}
      />
    );
  }

  // Inside Main App with Sidebar and Shell Layout
  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72 overflow-hidden">
        {/* Top Header */}
        <Header
          onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
          onOpenLogin={() => setCurrentView('login')}
        />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto bg-slate-950">
          {activeTab === 'dashboard' && <DashboardPage />}
          {activeTab === 'analytics' && <AnalyticsPage />}
          {activeTab === 'inventory' && <InventoryPage />}
          {activeTab === 'insights' && <InsightsPage />}
          {activeTab === 'simulator' && <SimulatorPage />}
          {activeTab === 'assistant' && <AssistantPage />}
          {activeTab === 'customers' && <CustomersPage />}
          {activeTab === 'alerts' && <AlertsPage />}
          {activeTab === 'decisions' && <DecisionsPage />}
          {activeTab === 'reports' && <ReportsPage />}
          {activeTab === 'data' && <DataUploadPage />}
          {activeTab === 'settings' && <SettingsPage />}
        </main>

        {/* Bottom Status Footer */}
        <Footer />
      </div>
    </div>
  );
}

export function App() {
  return (
    <ToastProvider>
      <BusinessProvider>
        <AppContent />
      </BusinessProvider>
    </ToastProvider>
  );
}

export default App;
