import React, { useState } from 'react';
import {
  Building2,
  Bell,
  Globe,
  UserCheck,
  ChevronDown,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Truck
} from 'lucide-react';
import { StorageService } from '../../services/storage';

export const Navbar = ({
  currentUser,
  onUserChange,
  lang,
  onLangChange,
  notifications,
  onNotificationsRead,
  onOpenLoginModal
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const employees = StorageService.getEmployees();

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSelectUser = (user) => {
    StorageService.setCurrentUser(user);
    onUserChange(user);
    setShowUserDropdown(false);
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      case 'order':
        return <Truck className="w-4 h-4 text-emerald-600" />;
      case 'invoice':
        return <FileText className="w-4 h-4 text-blue-600" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-cyan-600" />;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand & Status */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-600 text-white font-black shadow-sm">
            <Building2 className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-slate-900 font-sans">
                ADO <span className="text-emerald-600">FIRMA</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                Zürich Enterprise
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              {lang === 'tr' ? 'Merkezi Firma & Personel Yönetimi' : 'Zentrales Betriebs- & Personalmanagement'}
            </p>
          </div>
        </div>

        {/* Right Tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Language Switcher */}
          <button
            onClick={() => onLangChange(lang === 'de' ? 'tr' : 'de')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 shadow-sm transition"
            title="Sprache wechseln / Dil Değiştir"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            <span>{lang.toUpperCase()}</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifDropdown(!showNotifDropdown);
                if (!showNotifDropdown) onNotificationsRead();
              }}
              className="relative p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm transition"
              title="Benachrichtigungen"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifDropdown && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200 p-4 shadow-xl z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-emerald-600" />
                    <h4 className="font-bold text-sm text-slate-900">
                      {lang === 'tr' ? 'Sistem Bildirimleri' : 'Systemmeldungen'}
                    </h4>
                  </div>
                  <span className="text-xs text-slate-500">
                    {notifications.length} {lang === 'tr' ? 'kayıt' : 'Einträge'}
                  </span>
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                  {notifications.length === 0 ? (
                    <p className="text-center py-6 text-xs text-slate-400">
                      {lang === 'tr' ? 'Henüz bildirim yok.' : 'Keine neuen Benachrichtigungen.'}
                    </p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 rounded-xl border transition ${
                          n.type === 'warning'
                            ? 'bg-rose-50 border-rose-200 text-rose-900'
                            : 'bg-slate-50 border-slate-100 text-slate-800 hover:bg-slate-100/70'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <div className="mt-0.5">{getNotifIcon(n.type)}</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold leading-snug">{n.title}</p>
                            <p className="text-[11px] text-slate-600 mt-0.5 break-words">{n.message}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick Persona / Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 shadow-sm transition text-left"
            >
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt={currentUser?.name}
                className="w-7 h-7 rounded-full object-cover ring-2 ring-slate-200"
              />
              <div className="hidden md:block">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span>{currentUser?.name}</span>
                  {currentUser?.role === 'admin' ? (
                    <span className="badge badge-emerald py-0 px-1.5 text-[10px]">CHEF</span>
                  ) : (
                    <span className="badge badge-blue py-0 px-1.5 text-[10px]">STAFF</span>
                  )}
                </div>
                <div className="text-[10px] text-slate-500 truncate max-w-[130px]">
                  {currentUser?.jobTitle}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-slate-200 p-3 shadow-2xl z-50">
                <div className="px-3 py-2 border-b border-slate-100 mb-2">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    {lang === 'tr' ? 'Hızlı Rol Değiştirici (Demo)' : 'Schnellansicht Wechseln (Demo)'}
                  </p>
                </div>

                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {employees.map((emp) => {
                    const isSelected = emp.id === currentUser?.id;
                    return (
                      <button
                        key={emp.id}
                        onClick={() => handleSelectUser(emp)}
                        className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left text-xs transition ${
                          isSelected
                            ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <img
                          src={emp.avatar}
                          alt={emp.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <div className="flex-1 truncate">
                          <p className="truncate font-semibold text-slate-900">{emp.name}</p>
                          <p className="text-[10px] text-slate-500 truncate">{emp.jobTitle}</p>
                        </div>
                        {emp.role === 'admin' && (
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="border-t border-slate-100 mt-2 pt-2">
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onOpenLoginModal();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{lang === 'tr' ? 'Şifre ile Giriş Ekranı' : 'Mit Passwort einloggen'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
