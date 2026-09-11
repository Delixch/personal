import React from 'react';
import {
  LayoutDashboard,
  Truck,
  CalendarDays,
  Clock,
  HeartPulse,
  Users2,
  ScanLine,
  ReceiptText,
  Database,
  User,
  ShieldCheck
} from 'lucide-react';
import { TRANSLATIONS } from '../../utils/translations';

export const Sidebar = ({ activeTab, onTabChange, lang, currentUser }) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.de;
  const isAdmin = currentUser?.role === 'admin';

  const menuItems = [
    {
      id: 'dashboard',
      label: t.navDashboard,
      icon: LayoutDashboard,
      badge: null,
      adminOnly: false
    },
    {
      id: 'suppliers',
      label: t.navSuppliers,
      icon: Truck,
      badge: 'Metzgerei & Co.',
      adminOnly: false
    },
    {
      id: 'shifts',
      label: t.navShifts,
      icon: CalendarDays,
      badge: '2 Vardiya',
      adminOnly: false
    },
    {
      id: 'timeTracker',
      label: t.navTimeTracker,
      icon: Clock,
      badge: 'Stempeluhr',
      adminOnly: false
    },
    {
      id: 'sickLeave',
      label: t.navSickLeave,
      icon: HeartPulse,
      badge: 'Krank / Urlaub',
      adminOnly: false
    },
    {
      id: 'employees',
      label: t.navEmployees,
      icon: Users2,
      badge: 'HR & Verträge',
      adminOnly: true
    },
    {
      id: 'invoices',
      label: t.navInvoices,
      icon: ScanLine,
      badge: 'Foto Scan',
      adminOnly: false
    },
    {
      id: 'accounting',
      label: t.navAccounting,
      icon: ReceiptText,
      badge: 'Monatsbuchhaltung',
      adminOnly: true
    },
    {
      id: 'database',
      label: t.navDatabase,
      icon: Database,
      badge: 'Local DB',
      adminOnly: false
    }
  ];

  return (
    <aside className="w-64 lg:w-72 border-r border-slate-200 bg-white flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      
      {/* Current User Role Banner */}
      <div className="p-4 mx-3 mt-4 rounded-2xl bg-slate-50 border border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-emerald-200">
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xs font-bold text-slate-900 truncate">{currentUser?.name}</h3>
            <p className="text-[11px] text-emerald-700 font-medium truncate">{currentUser?.jobTitle}</p>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between text-[11px]">
          <span className="text-slate-500">
            {lang === 'tr' ? 'Erişim Seviyesi:' : 'Zugriffsrolle:'}
          </span>
          {isAdmin ? (
            <span className="badge badge-emerald py-0 px-2 text-[10px]">
              <ShieldCheck className="w-3 h-3" />
              CHEF / ADMIN
            </span>
          ) : (
            <span className="badge badge-blue py-0 px-2 text-[10px]">
              <User className="w-3 h-3" />
              MITARBEITER
            </span>
          )}
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {lang === 'tr' ? 'ANA MENÜ' : 'HAUPTMENÜ'}
        </div>

        {menuItems.map((item) => {
          const isLocked = item.adminOnly && !isAdmin;
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => !isLocked && onTabChange(item.id)}
              disabled={isLocked}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition group text-left ${
                isActive
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200 font-bold shadow-sm'
                  : isLocked
                  ? 'opacity-40 cursor-not-allowed text-slate-400 hover:bg-transparent'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 transition ${
                    isActive ? 'text-emerald-700' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md border shrink-0 ${
                    isActive
                      ? 'bg-emerald-100 border-emerald-200 text-emerald-800'
                      : 'bg-slate-100 border-slate-200 text-slate-500'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer info */}
      <div className="p-4 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
          <span>{lang === 'tr' ? 'Yerel Veritabanı Aktif' : 'Offline DB Verbunden'}</span>
        </div>
        <span className="text-[10px] text-slate-400">v1.0.0</span>
      </div>
    </aside>
  );
};
