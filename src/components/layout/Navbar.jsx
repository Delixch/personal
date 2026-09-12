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

  return (
    <header className="sticky top-0 z-40 w-full border-b border-line bg-surface">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

        {/* Brand — tıklayınca dashboard'a dön */}
        <div
          onClick={onGoHome}
          className="flex items-center gap-3 cursor-pointer group"
          title={lang === 'tr' ? 'Ana Menüye Git' : 'Zum Dashboard'}
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl icon-box font-black transition">
            <Building2 className="w-5 h-5" />
            {/* Canlı gösterge noktası */}
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-brand opacity-60"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-ink font-sans">
                ADO <span className="text-brand icon-brand">FIRMA</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-subtle px-2.5 py-0.5 text-xs font-semibold text-subhead border border-line">
                <span className="w-1.5 h-1.5 rounded-full bg-brand"></span>
                Zürich Enterprise
              </span>
            </div>
            <p className="text-[11px] text-ink-muted hidden sm:block">
              {lang === 'tr' ? 'Merkezi Firma & Personel Yönetimi' : 'Zentrales Betriebs- & Personalmanagement'}
            </p>
          </div>
        </div>

        {/* Sağ araçlar */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Patron / Personel Hızlı Geçiş */}
          {currentUser?.role !== 'admin' ? (
            <button
              onClick={() => {
                const adminUser = employees.find(e => e.role === 'admin') || employees[0];
                handleSelectUser(adminUser);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand text-white font-bold text-xs transition"
              title="Patron / Yönetici Ekranına Geç"
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="text-body-sm">{lang === 'tr' ? '👑 Patron Ekranına Dön' : '👑 Zum Chef-Modus'}</span>
            </button>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface card-inner border border-line text-ink font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-brand icon-brand" />
              <span className="text-body-sm">{lang === 'tr' ? 'Patron / Yönetici' : 'Chef-Modus aktiv'}</span>
            </div>
          )}

          {/* Dil Değiştirici */}
          <button
            onClick={() => onLangChange(lang === 'de' ? 'tr' : 'de')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-line bg-surface icon-brand sub-title transition card-inner"
            title="Sprache wechseln / Dil Değiştir"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="text-body-sm">{lang.toUpperCase()}</span>
          </button>

          {/* Bildirimler */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifDropdown(!showNotifDropdown);
                if (!showNotifDropdown) onNotificationsRead();
              }}
              className="relative p-2 rounded-xl border border-line bg-surface text-ink transition card-inner"
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
                            : 'bg-ground border-line text-ink '
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

          {/* Kullanıcı / Rol Değiştirici */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-line bg-surface transition text-left card-inner"
            >
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt={currentUser?.name}
                className="w-7 h-7 rounded-full object-cover ring-2 ring-line"
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
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-surface border border-line p-3 z-50 card-inner">
                <div className="px-3 py-2 border-b border-line-soft mb-2">
                  <p className="text-[11px] font-bold text-ink-muted uppercase tracking-wider">
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
                            ? 'bg-brand-light text-brand-hover font-bold border border-brand-border'
                            : ' text-ink'
                        }`}
                      >
                        <img
                          src={emp.avatar}
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

                <div className="border-t border-line-soft mt-2 pt-2">
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onOpenLoginModal();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-surface card-inner text-xs font-semibold text-ink transition border border-line"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-brand icon-brand" />
                    <span className="text-body-sm">{lang === 'tr' ? 'Şifre ile Giriş Ekranı' : 'Mit Passwort einloggen'}</span>
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
