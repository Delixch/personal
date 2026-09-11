import React, { useState, useEffect } from 'react';
import { initializeDatabase, StorageService } from './services/storage';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
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

export function App() {
  // Initialize offline-first database
  useEffect(() => {
    initializeDatabase();
  }, []);

  const [currentUser, setCurrentUser] = useState(() => StorageService.getCurrentUser());
  const [activeTab, setActiveTab] = useState('dashboard');
  const [lang, setLang] = useState(() => StorageService.getLanguage());
  const [notifications, setNotifications] = useState(() => StorageService.getNotifications());
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Sync state with storage updates
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
    if (user.role === 'employee' && activeTab === 'employees') {
      setActiveTab('dashboard');
    }
  };

  // Render current tab component
  const renderTabContent = () => {
    // If the logged in user is regular employee and clicks dashboard or portal, we can provide EmployeePortal
    if (currentUser?.role === 'employee' && activeTab === 'dashboard') {
      return (
        <EmployeePortal
          lang={lang}
          currentUser={currentUser}
          onNavigate={(tab) => setActiveTab(tab)}
        />
      );
    }

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
        return (
          <SupplierManagement
            lang={lang}
            currentUser={currentUser}
          />
        );
      case 'shifts':
        return (
          <ShiftScheduler
            lang={lang}
            currentUser={currentUser}
          />
        );
      case 'timeTracker':
        return (
          <TimeTracker
            lang={lang}
            currentUser={currentUser}
          />
        );
      case 'sickLeave':
        return (
          <SickLeaveManager
            lang={lang}
            currentUser={currentUser}
          />
        );
      case 'employees':
        return (
          <EmployeeHR
            lang={lang}
            currentUser={currentUser}
          />
        );
      case 'invoices':
        return (
          <InvoiceScanner
            lang={lang}
            currentUser={currentUser}
          />
        );
      case 'accounting':
        return (
          <AccountingDashboard
            lang={lang}
            currentUser={currentUser}
          />
        );
      case 'database':
        return (
          <DatabaseManager
            lang={lang}
            currentUser={currentUser}
          />
        );
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
      />

      {/* Main Body */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
          lang={lang}
          currentUser={currentUser}
        />

        {/* Content View Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
          {renderTabContent()}
        </main>
      </div>

      {/* Login / Switch Modal */}
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
