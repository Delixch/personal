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
  Truck,
  Cloud,
  LogOut,
  LogIn
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { isSupabaseConfigured } from '../../services/supabase';

export const Navbar = ({
  currentUser,
  onUserChange,
  onLogout,
  lang,
  onLangChange,
  notifications,
  onNotificationsRead,
  onOpenLoginModal,
  onGoHome
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
        return <AlertTriangle className="w-4 h-4 text-brand icon-brand" />;
      case 'order':
        return <Truck className="w-4 h-4 text-subhead" />;
      case 'invoice':
        return <FileText className="w-4 h-4 text-subhead" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-subhead" />;
    }
  };

  const isSuperUser = currentUser?.role === 'admin' || currentUser?.isImpersonated;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-line bg-navbar">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

        <div
          onClick={onGoHome}
          className="flex items-center gap-3 cursor-pointer group select-none"
          title={lang === 'tr' ? 'Ana Menüye Git' : 'Zum Dashboard'}
        >
          {/* İkon Kutusu - Yüzen & Parlayan */}
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl icon-box font-black transition-all duration-300 group-hover:scale-110 group-hover:border-brand/60 group-hover:shadow-[0_0_20px_rgba(255,90,31,0.5)] animate-icon-float">
            <Building2 className="w-5 h-5 text-brand group-hover:rotate-6 transition-transform duration-300" />
            
            {/* Canlı Turuncu/Altın Nabız Atan Nokta */}
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 z-10">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff5522] opacity-90"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-gradient-to-r from-orange-500 to-amber-400 ring-2 ring-black/70 shadow-[0_0_10px_#ff5522]"></span>
            </span>
          </div>

          {/* Logo Yazı Alanı */}
          <div className="relative">
            <div className="flex items-center gap-2 relative group/logo">
              {/* Arkadaki Süzülen & Yanıp Sönen Neon Işık Hüzmesi */}
              <div className="absolute -inset-3 bg-gradient-to-r from-brand/60 via-amber-500/30 to-brand/40 rounded-2xl animate-logo-glow pointer-events-none"></div>
              
              <span className="relative font-extrabold text-lg sm:text-xl tracking-tight text-ink font-sans flex items-center gap-1.5 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                <span className="text-white font-black tracking-wider">ADO</span>
                <span className="animate-text-shimmer font-black tracking-widest text-transparent">MANAGEMENT</span>
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-ink-muted hidden sm:flex items-center gap-1.5 relative z-10 mt-0.5 font-medium tracking-wide">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand animate-pulse"></span>
              <span>{lang === 'tr' ? 'Merkezi Firma & Personel Yönetimi' : 'Zentrales Betriebs- & Personalmanagement'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">

          {isSupabaseConfigured && (
            <div 
              className="hidden lg:flex items-center gap-1.5 px-3 h-[32px] rounded-md navbar-btn text-xs font-bold text-emerald-400 select-none"
              title="Zentrale Supabase Cloud-Datenbank ist online und aktiv synchronisiert"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <Cloud className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cloud Live</span>
            </div>
          )}

          {currentUser?.role === 'admin' ? (
            <div className="hidden sm:flex items-center gap-1.5 px-3 h-[32px] rounded-md navbar-btn text-ink font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-brand icon-brand" />
              <span className="text-body-sm">{lang === 'tr' ? 'Patron / Yönetici' : 'Chef-Modus aktiv'}</span>
            </div>
          ) : currentUser?.isImpersonated ? (
            <button
              onClick={() => {
                const adminUser = employees.find(e => e.role === 'admin') || employees[0];
                const cleanAdmin = { ...adminUser };
                delete cleanAdmin.isImpersonated;
                handleSelectUser(cleanAdmin);
              }}
              className="flex items-center gap-1.5 px-3 h-[32px] rounded-md bg-brand text-white font-bold text-xs transition"
              title="Patron / Yönetici Ekranına Geç"
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="text-body-sm">{lang === 'tr' ? '👑 Admin\'e Dön' : '👑 Zurück zu Admin'}</span>
            </button>
          ) : null}

          <button
            onClick={() => onLangChange(lang === 'de' ? 'tr' : 'de')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md navbar-btn icon-brand sub-title transition"
            title="Sprache wechseln / Dil Değiştir"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="text-body-sm">{lang.toUpperCase()}</span>
          </button>

          <div className="relative">
            <button
              onClick={() => {
                setShowNotifDropdown(!showNotifDropdown);
                if (!showNotifDropdown) onNotificationsRead();
              }}
              className="relative p-2 rounded-md navbar-btn text-ink transition"
              title="Benachrichtigungen"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifDropdown && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-surface border border-line p-4 z-50 card-inner">
                <div className="flex items-center justify-between border-b border-line-soft pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-brand icon-brand" />
                    <h4 className="card-title">
                      {lang === 'tr' ? 'Sistem Bildirimleri' : 'Systemmeldungen'}
                    </h4>
                  </div>
                  <span className="text-xs text-subhead">
                    {notifications.length} {lang === 'tr' ? 'kayıt' : 'Einträge'}
                  </span>
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                  {notifications.length === 0 ? (
                    <p className="text-center py-6 text-xs text-ink-muted">
                      {lang === 'tr' ? 'Henüz bildirim yok.' : 'Keine neuen Benachrichtigungen.'}
                    </p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 rounded-xl border transition ${
                          n.type === 'warning'
                            ? 'bg-brand-light border-brand-border text-brand-deep'
                            : 'card-inner border-line text-ink '
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <div className="mt-0.5">{getNotifIcon(n.type)}</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold leading-snug">{n.title}</p>
                            <p className="text-[11px] text-subhead mt-0.5 break-words">{n.message}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2.5 px-3.5 py-2 rounded-md transition text-left hover:bg-surface"
              >
                <img
                  src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt={currentUser?.name}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-line"
                />
                <div className="hidden md:block">
                  <div className="sub-title flex items-center gap-1.5">
                    <span className="text-body-sm">{currentUser?.name}</span>
                    {currentUser?.role === 'admin' ? (
                      <span className="badge badge-brand py-0 px-1.5 text-[10px]">CHEF</span>
                    ) : (
                      <span className="badge badge-neutral py-0 px-1.5 text-[10px]">STAFF</span>
                    )}
                  </div>
                  <div className="text-[10px] text-subhead truncate max-w-[130px]">
                    {currentUser?.jobTitle}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-ink-muted" />
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-surface border border-line p-3 z-50 card-inner shadow-2xl">
                  {isSuperUser && (
                    <>
                      <div className="px-3 py-2 border-b border-line-soft mb-2">
                        <p className="text-[11px] font-bold text-ink-muted uppercase tracking-wider">
                          {lang === 'tr' ? 'Hızlı Rol Değiştirici' : 'Schnellansicht Wechseln'}
                        </p>
                      </div>
                      <div className="space-y-1 max-h-64 overflow-y-auto mb-2">
                        {employees.map((emp) => {
                          const isSelected = emp.id === currentUser?.id;
                          return (
                            <button
                              key={emp.id}
                              onClick={() => {
                                const impUser = { ...emp, isImpersonated: true };
                                handleSelectUser(impUser);
                              }}
                              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-left text-xs transition ${
                                isSelected
                                  ? 'bg-brand-light text-brand-hover font-bold border border-brand-border'
                                  : ' text-ink'
                              }`}
                            >
                              <img
                                src={emp.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                                alt={emp.name}
                                className="w-6 h-6 rounded-full object-cover"
                              />
                              <div className="flex-1 truncate">
                                <p className="truncate font-semibold text-ink">{emp.name}</p>
                                <p className="text-[10px] text-subhead truncate">{emp.jobTitle}</p>
                              </div>
                              {emp.role === 'admin' && (
                                <ShieldCheck className="w-3.5 h-3.5 text-brand icon-brand" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                      <div className="border-t border-line-soft mt-2 pt-2"></div>
                    </>
                  )}
                  <div className="space-y-1.5">
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        onOpenLoginModal();
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-xl card-inner text-xs font-semibold text-ink transition border border-line"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-brand icon-brand" />
                      <span className="text-body-sm">{lang === 'tr' ? 'PIN / Şifre Ekranı' : 'Mit PIN/Passwort einloggen'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        onLogout();
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-red-950/40 text-red-400 hover:bg-red-900/50 text-xs font-bold transition border border-red-800/50"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span className="text-body-sm">{lang === 'tr' ? '🚪 Oturumu Kapat / Çıkış Yap' : '🚪 Abmelden / Ausloggen'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenLoginModal}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl btn-brand text-white font-bold text-xs transition shadow-xs"
              title="Anmelden / Giriş Yap"
            >
              <LogIn className="w-4 h-4" />
              <span className="text-body-sm">{lang === 'tr' ? 'Giriş Yap / PIN' : 'Anmelden / PIN'}</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
};
