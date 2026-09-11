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
import { EmployeePortal } from './components/portal/EmployeePortal';
import { HaccpChecklists } from './components/haccp/HaccpChecklists';
import { PayrollCalculator } from './components/payroll/PayrollCalculator';
import { CompanyBulletin } from './components/bulletin/CompanyBulletin';
import { ArrowLeft, Home, ChevronRight } from 'lucide-react';

export function App() {
  useEffect(() => {
    initializeDatabase();
  }, []);

  const [currentUser, setCurrentUser] = useState(() => StorageService.getCurrentUser());
  const [activeTab, setActiveTab] = useState('dashboard');
  const [lang, setLang] = useState(() => StorageService.getLanguage());
  const [notifications, setNotifications] = useState(() => StorageService.getNotifications());
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    const handleDbUpdate = () => {
      setCurrentUser(StorageService.getCurrentUser());
      setNotifications(StorageService.getNotifications());
      setLang(StorageService.getLanguage());
    };

    window.addEventListener('ado_db_update', handleDbUpdate);
    return () => window.removeEventListener('ado_db_update', handleDbUpdate);
  }, []);

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
    setActiveTab('dashboard'); // Always go back to clean dashboard on persona switch
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <OverviewDashboard
            lang={lang}
            currentUser={currentUser}
            onNavigate={(tab) => setActiveTab(tab)}
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
            onNavigate={(tab) => setActiveTab(tab)}
          />
        );
    }
  };

  const isModuleOpen = activeTab !== 'dashboard';

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      
      {/* Top Navigation */}
      <Navbar
        currentUser={currentUser}
        onUserChange={handleUserChange}
        lang={lang}
        onLangChange={handleLangChange}
        notifications={notifications}
        onNotificationsRead={handleNotificationsRead}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onGoHome={() => setActiveTab('dashboard')}
      />

      {/* Main Body - Focused and spacious without distracting side menus */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
        
        {/* Navigation Bar when inside a specific module */}
        {isModuleOpen && (
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-slate-200 hover:bg-slate-100/80 text-slate-800 font-bold text-xs shadow-xs hover:shadow transition group"
            >
              <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:-translate-x-0.5 transition" />
              <span>{lang === 'tr' ? '← Ana Menüye Dön' : '← Zurück zum Dashboard'}</span>
            </button>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span
                onClick={() => setActiveTab('dashboard')}
                className="cursor-pointer hover:text-slate-800 flex items-center gap-1"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-900 font-extrabold">{getActiveTabTitle()}</span>
            </div>
          </div>
        )}

        {/* Current Active Screen */}
        {renderTabContent()}
      </main>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setActiveTab('dashboard');
        }}
        lang={lang}
      />

    </div>
  );
}

export default App;
