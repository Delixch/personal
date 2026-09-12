import React, { useState, useEffect } from 'react';
import { initializeDatabase, StorageService } from './services/storage';
import { Navbar } from './components/layout/Navbar';
import { LoginModal } from './components/auth/LoginModal';
import { OverviewDashboard } from './components/dashboard/OverviewDashboard';
import { SupplierManagement } from './components/suppliers/SupplierManagement';
import { ShiftScheduler } from './components/employees/ShiftScheduler';
import { TimeTracker } from './components/employees/TimeTracker';
import { SickLeaveManager } from './components/employees/SickLeaveManager';
import { EmployeeHR } from './components/employees/EmployeeHR';
import { InvoiceScanner } from './components/invoices/InvoiceScanner';
import { AccountingDashboard } from './components/accounting/AccountingDashboard';
import { DatabaseManager } from './components/database/DatabaseManager';
import { HaccpChecklists } from './components/haccp/HaccpChecklists';
import { PayrollCalculator } from './components/payroll/PayrollCalculator';
import { CompanyBulletin } from './components/bulletin/CompanyBulletin';
import {
  ArrowLeft,
  Home,
  ChevronRight,
  Clock,
  Calendar,
  Users2,
  FileText,
  ReceiptText,
  Truck,
  ShieldCheck,
  Megaphone,
  Database,
  ShoppingBag
} from 'lucide-react';

export function App() {
  useEffect(() => {
    initializeDatabase();
  }, []);

  const [currentUser, setCurrentUser] = useState(() => StorageService.getCurrentUser());
  const [activeTab, setActiveTab] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return hash || 'dashboard';
  });
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');
  const [lang, setLang] = useState(() => StorageService.getLanguage());
  const [notifications, setNotifications] = useState(() => StorageService.getNotifications());
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace('#', '');
      setActiveTab(hash || 'dashboard');
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigateToTab = (tabName) => {
    setActiveTab(tabName);
    const targetHash = tabName === 'dashboard' ? '' : `#${tabName}`;
    if (window.location.hash !== targetHash) {
      window.history.pushState({ tab: tabName }, '', targetHash || window.location.pathname + window.location.search);
    }
  };

  useEffect(() => {
    const handleDbUpdate = () => {
      setCurrentUser(StorageService.getCurrentUser());
      setNotifications(StorageService.getNotifications());
      setLang(StorageService.getLanguage());
    };

    window.addEventListener('ado_db_update', handleDbUpdate);
    return () => window.removeEventListener('ado_db_update', handleDbUpdate);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeTab]);

  const handleLangChange = (newLang) => {
    StorageService.setLanguage(newLang);
    setLang(newLang);
  };

  const handleNotificationsRead = () => {
    StorageService.markNotificationsRead();
    setNotifications(StorageService.getNotifications());
  };

  const handleUserChange = (user) => {
    setCurrentUser(user);
    navigateToTab('dashboard');
  };

  const getActiveTabTitle = () => {
    switch (activeTab) {
      case 'suppliers':
        return lang === 'tr' ? 'Tedarikçiler & Sipariş' : 'Lieferanten & Einkauf';
      case 'shifts':
        return lang === 'tr' ? 'Vardiya Planı (2 Vardiya)' : 'Schichtplan (2 Schichten)';
      case 'timeTracker':
        return lang === 'tr' ? 'Giriş-Çıkış (Stempeluhr)' : 'Stempeluhr & Zeiterfassung';
      case 'sickLeave':
        return lang === 'tr' ? 'Hastalık Bildirimi & İzin' : 'Krankmeldungen & Urlaub';
      case 'invoices':
        return lang === 'tr' ? 'Fatura Tarama & Fotoğraf' : 'Rechnungs-Scan & Belege';
      case 'accounting':
        return lang === 'tr' ? 'Aylık Muhasebe & Finans' : 'Monatsbuchhaltung & Finanzen';
      case 'employees':
        return lang === 'tr' ? 'Personel & HR Dosyaları' : 'Mitarbeiter & Personalakten';
      case 'payroll':
        return lang === 'tr' ? 'Maaş & Saat Hesaplayıcı' : 'Lohn- & Stundenabrechnung';
      case 'haccp':
        return lang === 'tr' ? 'HACCP & Hijyen Kontrolleri' : 'HACCP & Hygiene-Check';
      case 'bulletin':
        return lang === 'tr' ? 'Duyuru Panosu & Notlar' : 'Schwarzes Brett & Mitteilungen';
      case 'database':
        return lang === 'tr' ? 'Yerel Veritabanı & Yedek' : 'Lokale Datenbank & Backup';
      default:
        return '';
    }
  };

  const handleCategorySelect = (catId) => {
    setActiveCategoryFilter(catId);
    navigateToTab('dashboard');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <OverviewDashboard
            lang={lang}
            currentUser={currentUser}
            onNavigate={(tab) => navigateToTab(tab)}
            activeCategoryFilter={activeCategoryFilter}
            setActiveCategoryFilter={setActiveCategoryFilter}
          />
        );
      case 'suppliers':
        return <SupplierManagement lang={lang} currentUser={currentUser} />;
      case 'shifts':
        return <ShiftScheduler lang={lang} currentUser={currentUser} />;
      case 'timeTracker':
        return <TimeTracker lang={lang} currentUser={currentUser} />;
      case 'sickLeave':
        return <SickLeaveManager lang={lang} currentUser={currentUser} />;
      case 'employees':
        return <EmployeeHR lang={lang} currentUser={currentUser} />;
      case 'payroll':
        return <PayrollCalculator lang={lang} currentUser={currentUser} />;
      case 'haccp':
        return <HaccpChecklists lang={lang} currentUser={currentUser} />;
      case 'bulletin':
        return <CompanyBulletin lang={lang} currentUser={currentUser} />;
      case 'invoices':
        return <InvoiceScanner lang={lang} currentUser={currentUser} />;
      case 'accounting':
        return <AccountingDashboard lang={lang} currentUser={currentUser} />;
      case 'database':
        return <DatabaseManager lang={lang} currentUser={currentUser} />;
      default:
        return (
          <OverviewDashboard
            lang={lang}
            currentUser={currentUser}
            onNavigate={(tab) => navigateToTab(tab)}
            activeCategoryFilter={activeCategoryFilter}
            setActiveCategoryFilter={setActiveCategoryFilter}
          />
        );
    }
  };

  const isModuleOpen = activeTab !== 'dashboard';

  return (
    <div className="min-h-screen bg-ground text-ink flex flex-col font-sans">

      {/* Top Navigation */}
      <Navbar
        currentUser={currentUser}
        onUserChange={handleUserChange}
        lang={lang}
        onLangChange={handleLangChange}
        notifications={notifications}
        onNotificationsRead={handleNotificationsRead}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onGoHome={() => navigateToTab('dashboard')}
      />

      {/* Main Body */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">

        {/* Breadcrumb & Global Quick Switcher Bar — modül açıkken gösterilir */}
        {isModuleOpen && (
          <div className="space-y-4 mb-6">
            {/* Top Breadcrumb Header */}
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <button
                onClick={() => navigateToTab('dashboard')}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-surface border border-line icon-brand text-ink font-bold text-xs transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-body-sm">{lang === 'tr' ? 'Ana Menüye Dön' : 'Zurück zum Dashboard'}</span>
              </button>

              <div className="flex items-center gap-2 text-xs font-semibold text-ink-soft">
                <span
                  onClick={() => navigateToTab('dashboard')}
                  className="cursor-pointer icon-brand flex items-center gap-1"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span className="text-body-sm">Dashboard</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-ink-muted" />
                <span className="text-ink font-extrabold">{getActiveTabTitle()}</span>
              </div>
            </div>

            {/* Global 3 Category Quick Switcher Bar (Overview Dashboard ile 100% Senkron) */}
            <div className="p-2.5 rounded-2xl bg-surface border border-line flex items-center justify-between gap-2 overflow-x-auto">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-black text-ink-muted uppercase tracking-wider px-2 shrink-0">
                  {lang === 'tr' ? 'Ana Bölümler:' : 'Hauptbereiche:'}
                </span>

                {/* Home Icon (Tüm Bölümleri Göster) */}
                <button
                  onClick={() => handleCategorySelect('all')}
                  title={lang === 'tr' ? 'Tüm Bölümleri Göster' : 'Alle Bereiche anzeigen'}
                  className={`p-2 rounded-lg text-xs font-bold transition flex items-center justify-center shrink-0 ${
                    activeCategoryFilter === 'all'
                      ? 'btn-brand font-black'
                      : 'bg-ground border border-line text-ink'
                  }`}
                >
                  <Home className="w-4 h-4" />
                </button>

                {/* 1. Personal & Schichten (5 Modül) */}
                <button
                  onClick={() => handleCategorySelect(activeCategoryFilter === 'hr' ? 'all' : 'hr')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                    activeCategoryFilter === 'hr'
                      ? 'btn-brand font-black'
                      : 'bg-ground border border-line text-ink'
                  }`}
                >
                  <Users2 className="w-3.5 h-3.5" />
                  <span>{lang === 'tr' ? 'Personal & Vardiya (5)' : 'Personal & Schichten (5)'}</span>
                </button>

                {/* 2. Einkauf & Finanzen (3 Modül) */}
                <button
                  onClick={() => handleCategorySelect(activeCategoryFilter === 'finance' ? 'all' : 'finance')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                    activeCategoryFilter === 'finance'
                      ? 'btn-brand font-black'
                      : 'bg-ground border border-line text-ink'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{lang === 'tr' ? 'Alışveriş, Fatura & Kasa (3)' : 'Einkauf & Finanzen (3)'}</span>
                </button>

                {/* 3. Betrieb & Hygiene (3 Modül) */}
                <button
                  onClick={() => handleCategorySelect(activeCategoryFilter === 'operations' ? 'all' : 'operations')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                    activeCategoryFilter === 'operations'
                      ? 'btn-brand font-black'
                      : 'bg-ground border border-line text-ink'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{lang === 'tr' ? 'Operasyon, Hijyen & Genel (3)' : 'Betrieb & Hygiene (3)'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Aktif Ekran */}
        {isModuleOpen ? (
          <div className="bg-surface rounded-3xl border border-line p-6 sm:p-8 space-y-6">
            {renderTabContent()}
          </div>
        ) : (
          renderTabContent()
        )}
      </main>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          navigateToTab('dashboard');
        }}
        lang={lang}
      />

    </div>
  );
}

export default App;
