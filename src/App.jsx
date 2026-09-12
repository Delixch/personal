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
      const storedUser = StorageService.getCurrentUser();
      if (storedUser) {
        // Sync sonrası güncel employee listesinden aynı kişiyi bul (PIN veya ID ile)
        setCurrentUser(prev => {
          const employees = StorageService.getEmployees();
          const refreshed = employees.find(e =>
            (prev && (e.pin === prev.pin || e.id === prev.id)) ||
            (storedUser && (e.pin === storedUser.pin || e.id === storedUser.id))
          );
          return refreshed || prev || storedUser;
        });
      }
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

  const handleLogout = () => {
    StorageService.logout();
    setCurrentUser(null);
    setIsLoginModalOpen(true);
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

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-ground text-ink flex flex-col font-sans">
        <Navbar
          currentUser={null}
          onUserChange={handleUserChange}
          onLogout={handleLogout}
          lang={lang}
          onLangChange={handleLangChange}
          notifications={[]}
          onNotificationsRead={() => {}}
          onOpenLoginModal={() => setIsLoginModalOpen(true)}
          onGoHome={() => navigateToTab('dashboard')}
        />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full p-8 rounded-3xl bg-surface border border-line text-center card-inner space-y-4 shadow-2xl">
            <div className="w-16 h-16 mx-auto rounded-2xl btn-brand flex items-center justify-center text-white font-black text-2xl shadow-lg">
              ADO
            </div>
            <h1 className="text-2xl font-black text-ink">
              {lang === 'tr' ? 'Oturum Kapatıldı' : 'Abgemeldet'}
            </h1>
            <p className="text-xs text-subhead max-w-sm mx-auto">
              {lang === 'tr'
                ? 'Sisteme erişmek için lütfen 4 haneli PIN kodunuz veya e-postanız ile giriş yapınız.'
                : 'Bitte melden Sie sich mit Ihrem 4-stelligen PIN-Code oder E-Mail an.'}
            </p>
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="w-full py-3 rounded-2xl btn-brand text-white font-bold text-sm transition shadow-md"
            >
              {lang === 'tr' ? '🔑 Giriş Yap / PIN Tuşla' : '🔑 Jetzt Anmelden / PIN'}
            </button>
          </div>
        </main>
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLoginSuccess={(user) => {
            handleUserChange(user);
            setIsLoginModalOpen(false);
          }}
          lang={lang}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ground text-ink flex flex-col font-sans">

      <Navbar
        currentUser={currentUser}
        onUserChange={handleUserChange}
        onLogout={handleLogout}
        lang={lang}
        onLangChange={handleLangChange}
        notifications={notifications}
        onNotificationsRead={handleNotificationsRead}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onGoHome={() => navigateToTab('dashboard')}
      />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">

        {isModuleOpen && (
          <div className="space-y-4 mb-6">
            
            <div className="flex items-center justify-between pb-3">
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

            <div className="bg-surface p-2 md:p-2.5 rounded-2xl border border-line">
              <div className="flex items-start sm:items-center gap-2">
                
                <button
                  onClick={() => handleCategorySelect('all')}
                  title={lang === 'tr' ? 'Tüm Bölümleri Göster' : 'Alle Bereiche anzeigen'}
                  className={`p-2 rounded-lg text-xs font-bold transition flex items-center justify-center shrink-0 ${
                    activeCategoryFilter === 'all'
                      ? 'btn-brand font-black'
                      : 'card-inner text-ink border border-line'
                  }`}
                >
                  <Home className="w-4 h-4" />
                </button>

                <div className="flex flex-col sm:flex-row flex-wrap gap-2 w-full">
                  <button
                    onClick={() => handleCategorySelect(activeCategoryFilter === 'hr' ? 'all' : 'hr')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 w-full sm:w-auto ${
                      activeCategoryFilter === 'hr'
                        ? 'btn-brand font-black'
                        : 'card-inner text-ink border border-line'
                    }`}
                  >
                    <Users2 className="w-3.5 h-3.5" />
                    <span className="text-left">{lang === 'tr' ? 'Personal & Vardiya (5)' : 'Personal & Schichten (5)'}</span>
                  </button>

                  <button
                    onClick={() => handleCategorySelect(activeCategoryFilter === 'finance' ? 'all' : 'finance')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 w-full sm:w-auto ${
                      activeCategoryFilter === 'finance'
                        ? 'btn-brand font-black'
                        : 'card-inner text-ink border border-line'
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span className="text-left">{lang === 'tr' ? 'Alışveriş, Fatura & Kasa (3)' : 'Einkauf & Finanzen (3)'}</span>
                  </button>

                  <button
                    onClick={() => handleCategorySelect(activeCategoryFilter === 'operations' ? 'all' : 'operations')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 w-full sm:w-auto ${
                      activeCategoryFilter === 'operations'
                        ? 'btn-brand font-black'
                        : 'card-inner text-ink border border-line'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span className="text-left">{lang === 'tr' ? 'Operasyon, Hijyen & Genel (3)' : 'Betrieb & Hygiene (3)'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {isModuleOpen ? (
          <div className="bg-surface rounded-3xl border border-line p-6 sm:p-8 space-y-6">
            {renderTabContent()}
          </div>
        ) : (
          renderTabContent()
        )}
      </main>

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
