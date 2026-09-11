import React from 'react';
import {
  Truck,
  CalendarDays,
  Clock,
  ScanLine,
  ReceiptText,
  Users2,
  HeartPulse,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Database,
  Building2,
  Sparkles,
  Palmtree
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const OverviewDashboard = ({ lang, currentUser, onNavigate }) => {
  const suppliers = StorageService.getSuppliers();
  const employees = StorageService.getEmployees();
  const shifts = StorageService.getShifts();
  const invoices = StorageService.getInvoices();
  const timeLogs = StorageService.getTimeLogs();
  const sickReports = StorageService.getSickReports();

  const todayStr = new Date().toISOString().split('T')[0];
  const todayShifts = shifts.filter(s => s.date === todayStr);
  const activeTimeLogs = timeLogs.filter(t => t.date === todayStr && !t.clockOut);
  const unpaidInvoices = invoices.filter(i => i.status === 'pending');
  const totalUnpaid = unpaidInvoices.reduce((sum, i) => sum + i.totalAmount, 0);

  const isAdmin = currentUser?.role === 'admin';

  // Admin Hub Modules with distinct color identities
  const adminModules = [
    {
      id: 'suppliers',
      title: lang === 'tr' ? 'Tedarikçiler & Sipariş' : 'Lieferanten & Einkauf',
      subtitle: lang === 'tr' ? 'Metzgerei, Prodega, Sebze & WhatsApp Siparişi' : 'Zentraler Einkauf & automatisierte Lieferantenbestellungen',
      icon: Truck,
      color: 'blue',
      badge: `${suppliers.length} Partner`,
      cardBg: 'bg-blue-50/40 hover:bg-blue-50/80 border-blue-200/80 hover:border-blue-400',
      iconBg: 'bg-blue-100 text-blue-700 border-blue-200',
      badgeBg: 'bg-blue-100 text-blue-800 border-blue-200',
      textColor: 'text-blue-900',
      stat: `${suppliers.length} Tedarikçi Kayıtlı`
    },
    {
      id: 'shifts',
      title: lang === 'tr' ? 'Vardiya Planı (2 Vardiya)' : 'Schichtplan (2 Schichten)',
      subtitle: lang === 'tr' ? 'Früh- & Spätschicht, Departmanlar & Yedek Eleman' : 'Einsatzplanung mit 2 Schichten & Krankheitsersatz',
      icon: CalendarDays,
      color: 'emerald',
      badge: `${todayShifts.length} Schichten heute`,
      cardBg: 'bg-emerald-50/40 hover:bg-emerald-50/80 border-emerald-200/80 hover:border-emerald-400',
      iconBg: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      textColor: 'text-emerald-900',
      stat: lang === 'tr' ? '5 Departman Aktif' : '5 Abteilungen'
    },
    {
      id: 'timeTracker',
      title: lang === 'tr' ? 'Giriş-Çıkış (Stempeluhr)' : 'Stempeluhr & Zeiterfassung',
      subtitle: lang === 'tr' ? 'Canlı saat, mesai takibi ve mola kontrolü' : 'Präzise Arbeitszeiterfassung & Überstundenkontrolle',
      icon: Clock,
      color: 'cyan',
      badge: `${activeTimeLogs.length} Im Dienst`,
      cardBg: 'bg-cyan-50/40 hover:bg-cyan-50/80 border-cyan-200/80 hover:border-cyan-400',
      iconBg: 'bg-cyan-100 text-cyan-700 border-cyan-200',
      badgeBg: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      textColor: 'text-cyan-900',
      stat: lang === 'tr' ? 'Canlı Takip Aktif' : 'Live-Stempeluhr'
    },
    {
      id: 'sickLeave',
      title: lang === 'tr' ? 'Hastalık Bildirimi & İzin' : 'Krankmeldungen & Absenzen',
      subtitle: lang === 'tr' ? 'Gerekçe seçenekleri, doktor raporu & izin günleri' : 'Attest-Upload, Urlaubsanträge & Absenzenverwaltung',
      icon: HeartPulse,
      color: 'rose',
      badge: sickReports.length > 0 ? `${sickReports.length} Gemeldet` : 'Alles OK',
      cardBg: 'bg-rose-50/40 hover:bg-rose-50/80 border-rose-200/80 hover:border-rose-400',
      iconBg: 'bg-rose-100 text-rose-700 border-rose-200',
      badgeBg: 'bg-rose-100 text-rose-800 border-rose-200',
      textColor: 'text-rose-900',
      stat: lang === 'tr' ? 'Rapor & İzin Takibi' : 'Urlaubskonten'
    },
    {
      id: 'invoices',
      title: lang === 'tr' ? 'Fatura Tarama & Fotoğraf' : 'Rechnungs-Scan & OCR',
      subtitle: lang === 'tr' ? 'Kamera veya fotoğrafla otomatik KDV ve tutar ayıklama' : 'Automatische Belegerfassung mit MwSt-Erkennung',
      icon: ScanLine,
      color: 'purple',
      badge: `${unpaidInvoices.length} Offen`,
      cardBg: 'bg-purple-50/40 hover:bg-purple-50/80 border-purple-200/80 hover:border-purple-400',
      iconBg: 'bg-purple-100 text-purple-700 border-purple-200',
      badgeBg: 'bg-purple-100 text-purple-800 border-purple-200',
      textColor: 'text-purple-900',
      stat: formatCurrency(totalUnpaid)
    },
    {
      id: 'accounting',
      title: lang === 'tr' ? 'Aylık Muhasebe & Rapor' : 'Monatsbuchhaltung & Finanzen',
      subtitle: lang === 'tr' ? 'Kategori giderleri, KDV iadesi & Treuhand Excel çıktısı' : 'Kostenanalyse, MwSt-Rückforderung & Treuhand-Export',
      icon: ReceiptText,
      color: 'indigo',
      badge: 'Excel / CSV',
      cardBg: 'bg-indigo-50/40 hover:bg-indigo-50/80 border-indigo-200/80 hover:border-indigo-400',
      iconBg: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      textColor: 'text-indigo-900',
      stat: lang === 'tr' ? 'Aylık Bilanço' : 'Monatsjournal'
    },
    {
      id: 'employees',
      title: lang === 'tr' ? 'Personel & HR Dosyaları' : 'Mitarbeiter & Personalakten',
      subtitle: lang === 'tr' ? 'Sözleşmeler, AHV, saatlik ücretler & PIN kodları' : 'Verträge, Versicherungen, Stundenlöhne & PINs',
      icon: Users2,
      color: 'amber',
      badge: `${employees.length} Mitarbeiter`,
      cardBg: 'bg-amber-50/40 hover:bg-amber-50/80 border-amber-200/80 hover:border-amber-400',
      iconBg: 'bg-amber-100 text-amber-700 border-amber-200',
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
      textColor: 'text-amber-900',
      stat: lang === 'tr' ? 'İK & Girişler' : 'Onboarding'
    },
    {
      id: 'database',
      title: lang === 'tr' ? 'Yerel Veritabanı & Yedek' : 'Lokale Datenbank & Backup',
      subtitle: lang === 'tr' ? 'Tek tıkla JSON yedek indir / geri yükle' : 'Offline-First Datensicherung & JSON Export',
      icon: Database,
      color: 'slate',
      badge: 'Local DB',
      cardBg: 'bg-slate-100/60 hover:bg-slate-100 border-slate-200 hover:border-slate-400',
      iconBg: 'bg-slate-200 text-slate-700 border-slate-300',
      badgeBg: 'bg-slate-200 text-slate-800 border-slate-300',
      textColor: 'text-slate-900',
      stat: lang === 'tr' ? 'Çevrimdışı Aktif' : 'Offline bereit'
    }
  ];

  // Employee-only Hub Modules (Clean & simplified for workers)
  const employeeModules = [
    {
      id: 'timeTracker',
      title: lang === 'tr' ? 'İşe Giriş / Çıkış (Stempeluhr)' : 'Meine Stempeluhr (Zeiterfassung)',
      subtitle: lang === 'tr' ? 'Tek tıkla işe başla, mola ver veya işi bitir' : 'Arbeitsbeginn, Pause erfassen & Feierabend',
      icon: Clock,
      badge: activeTimeLogs.find(l => l.employeeId === currentUser?.id) ? '● IM DIENST' : 'Bereit',
      cardBg: 'bg-cyan-50/60 hover:bg-cyan-100/70 border-cyan-200 hover:border-cyan-400',
      iconBg: 'bg-cyan-100 text-cyan-700 border-cyan-200',
      badgeBg: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      textColor: 'text-cyan-900'
    },
    {
      id: 'shifts',
      title: lang === 'tr' ? 'Vardiyalarım (2 Vardiya)' : 'Meine Schichten (Dienstplan)',
      subtitle: lang === 'tr' ? 'Bu haftaki çalışma gün ve saatleriniz' : 'Ihre Einsatzzeiten für die aktuelle Woche',
      icon: CalendarDays,
      badge: '2 Schichten',
      cardBg: 'bg-emerald-50/60 hover:bg-emerald-100/70 border-emerald-200 hover:border-emerald-400',
      iconBg: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      textColor: 'text-emerald-900'
    },
    {
      id: 'sickLeave',
      title: lang === 'tr' ? 'Hastalık Bildir (Krankmeldung)' : 'Krankmeldung abgeben',
      subtitle: lang === 'tr' ? 'Gerekçe seçimi ve doktor raporu yükleme' : 'Absenzgrund mitteilen & Arztzeugnis hochladen',
      icon: HeartPulse,
      badge: 'Schnellmeldung',
      cardBg: 'bg-rose-50/60 hover:bg-rose-100/70 border-rose-200 hover:border-rose-400',
      iconBg: 'bg-rose-100 text-rose-700 border-rose-200',
      badgeBg: 'bg-rose-100 text-rose-800 border-rose-200',
      textColor: 'text-rose-900'
    },
    {
      id: 'sickLeave',
      title: lang === 'tr' ? 'İzin / Tatil İste (Urlaub)' : 'Urlaubsantrag stellen',
      subtitle: lang === 'tr' ? 'Kalan izin günlerinizi görün ve talep oluşturun' : 'Resturlaub einsehen & freie Tage beantragen',
      icon: Palmtree,
      badge: 'Urlaubskonto',
      cardBg: 'bg-amber-50/60 hover:bg-amber-100/70 border-amber-200 hover:border-amber-400',
      iconBg: 'bg-amber-100 text-amber-700 border-amber-200',
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
      textColor: 'text-amber-900'
    }
  ];

  const currentModules = isAdmin ? adminModules : employeeModules;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Top Welcome Hub Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {isAdmin
                ? (lang === 'tr' ? 'YÖNETİCİ ANA KONTROL MERKEZİ' : 'CHEF / BETRIEBSLEITUNG PORTAL')
                : (lang === 'tr' ? 'PERSONEL HIZLI İŞLEM PANELİ' : 'MITARBEITER SCHNELLZUGRIFF')}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            {lang === 'tr'
              ? `Hoş Geldiniz, ${currentUser?.name.split(' ')[0]}`
              : `Willkommen, ${currentUser?.name.split(' ')[0]}`}
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1 max-w-xl">
            {isAdmin
              ? (lang === 'tr'
                  ? 'İşlem yapmak istediğiniz renkli kartı seçin. Bölüme girdiğinizde diğer menüler gizlenerek ferah bir çalışma alanı açılır.'
                  : 'Wählen Sie einen Bereich. Im geöffneten Modul wird das Menü automatisch ausgeblendet, damit Sie übersichtlich und ungestört arbeiten können.')
              : (lang === 'tr'
                  ? 'Şu an personel gözüyle bakıyorsunuz. İşe giriş-çıkış yapabilir, vardiyalarınızı görebilir veya hastalık bildirebilirsiniz.'
                  : 'Hier können Sie sich einstempeln, Ihre Schichten einsehen oder Absenzen melden.')}
          </p>
        </div>

        {/* Quick Identity & Return to Boss Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {!isAdmin && (
            <button
              onClick={() => {
                const adminUser = employees.find(e => e.role === 'admin') || employees[0];
                StorageService.setCurrentUser(adminUser);
                window.location.reload();
              }}
              className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs shadow-md flex items-center gap-2 transition"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{lang === 'tr' ? '👑 Patron Ekranına Geç' : '👑 Zum Chef-Modus'}</span>
            </button>
          )}

          <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-200 shrink-0">
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-emerald-200"
            />
            <div>
              <p className="text-xs font-bold text-slate-900">{currentUser?.name}</p>
              <p className="text-[11px] text-emerald-700 font-semibold">{currentUser?.jobTitle}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Distinctly-Colored Modules */}
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-sm font-extrabold text-slate-700 uppercase tracking-wider">
            {lang === 'tr' ? 'Çalışma Bölümleri' : 'Betriebsbereiche'}
          </h2>
          <span className="text-xs text-slate-500">
            {lang === 'tr' ? 'Bölüme tıklayarak doğrudan giriş yapın' : 'Klicken zum Öffnen'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentModules.map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.id + mod.title}
                onClick={() => onNavigate(mod.id)}
                className={`p-5 rounded-3xl border transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-xs hover:shadow-md ${mod.cardBg} group`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border shadow-2xs ${mod.iconBg} group-hover:scale-105 transition`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    {mod.badge && (
                      <span className={`badge text-[10px] font-bold py-0.5 px-2 ${mod.badgeBg}`}>
                        {mod.badge}
                      </span>
                    )}
                  </div>

                  <h3 className={`text-base font-extrabold ${mod.textColor} mb-1 tracking-tight`}>
                    {mod.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {mod.subtitle}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-slate-700 group-hover:text-slate-950">
                  <span className="text-[11px] text-slate-500 font-medium">{mod.stat || ''}</span>
                  <div className="flex items-center gap-1 group-hover:translate-x-1 transition">
                    <span>{lang === 'tr' ? 'Aç' : 'Öffnen'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
