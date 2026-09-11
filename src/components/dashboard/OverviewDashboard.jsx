import React, { useState } from 'react';
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
  Palmtree,
  Calculator,
  Megaphone,
  Thermometer,
  Layers,
  ShoppingBag,
  Sparkle
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { PersonalakteModal } from '../employees/PersonalakteModal';

export const OverviewDashboard = ({ lang, currentUser, onNavigate }) => {
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');
  const [showChefModal, setShowChefModal] = useState(false);

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

  // Admin Categories: 3 distinct logical pillars placed side by side
  const adminCategories = [
    {
      id: 'hr',
      title: lang === 'tr' ? 'Personel & Çalışma Düzeni' : 'Personal & Arbeitszeiten',
      subtitle: lang === 'tr' ? 'Vardiya, stempeluhr, izinler, maaş ve çalışanlar' : 'Schichten, Stempeluhr, Absenzen, Lohn & Akten',
      icon: Users2,
      badge: lang === 'tr' ? '5 Bölüm' : '5 Module',
      badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      headerBg: 'bg-gradient-to-r from-emerald-50 via-teal-50 to-white border-emerald-200',
      headerTextColor: 'text-emerald-950',
      iconColor: 'bg-emerald-600 text-white',
      modules: [
        {
          id: 'timeTracker',
          title: lang === 'tr' ? 'Giriş-Çıkış (Stempeluhr)' : 'Stempeluhr & Kiosk',
          subtitle: lang === 'tr' ? 'Tablet PIN terminali, canlı saat ve mola takibi' : 'Tablet-PIN-Terminal, Live-Stempeluhr & Pausen',
          icon: Clock,
          badge: `${activeTimeLogs.length} Im Dienst`,
          cardBg: 'bg-gradient-to-br from-cyan-100/90 via-sky-50 to-white border-cyan-300 hover:border-cyan-500',
          iconBg: 'bg-cyan-600 text-white shadow-sm',
          badgeBg: 'bg-cyan-200/80 text-cyan-900 border-cyan-300',
          textColor: 'text-cyan-950',
          stat: lang === 'tr' ? 'Canlı PIN Terminali' : 'Kiosk Terminal'
        },
        {
          id: 'shifts',
          title: lang === 'tr' ? 'Vardiya Planı (2 Vardiya)' : 'Schichtplan (2 Schichten)',
          subtitle: lang === 'tr' ? 'Früh- & Spätschicht, departmanlar & yedek eleman' : 'Einsatzplanung 2 Schichten & Ersatzpersonal',
          icon: CalendarDays,
          badge: `${todayShifts.length} Schichten`,
          cardBg: 'bg-gradient-to-br from-emerald-100/90 via-emerald-50 to-white border-emerald-300 hover:border-emerald-500',
          iconBg: 'bg-emerald-600 text-white shadow-sm',
          badgeBg: 'bg-emerald-200/80 text-emerald-900 border-emerald-300',
          textColor: 'text-emerald-950',
          stat: lang === 'tr' ? '5 Departman Aktif' : '5 Abteilungen'
        },
        {
          id: 'sickLeave',
          title: lang === 'tr' ? 'Hastalık & İzin (Absenzen)' : 'Krankmeldungen & Absenzen',
          subtitle: lang === 'tr' ? 'Gerekçe seçimi, doktor raporu ve tatil günleri' : 'Attest-Upload, Absenzen & Urlaubsanträge',
          icon: HeartPulse,
          badge: sickReports.length > 0 ? `${sickReports.length} Gemeldet` : 'Alles OK',
          cardBg: 'bg-gradient-to-br from-rose-100/90 via-rose-50 to-white border-rose-300 hover:border-rose-500',
          iconBg: 'bg-rose-600 text-white shadow-sm',
          badgeBg: 'bg-rose-200/80 text-rose-900 border-rose-300',
          textColor: 'text-rose-950',
          stat: lang === 'tr' ? 'Rapor & İzin Takibi' : 'Urlaub & Atteste'
        },
        {
          id: 'payroll',
          title: lang === 'tr' ? 'Maaş & Saat Hesaplayıcı' : 'Lohn- & Stundenabrechnung',
          subtitle: lang === 'tr' ? 'İsviçre GAV, fazla mesai & Treuhand CSV bordro çıktısı' : 'GAV Gastrosuisse, Überstunden & Treuhand-CSV',
          icon: Calculator,
          badge: 'GAV Konform',
          cardBg: 'bg-gradient-to-br from-violet-100/90 via-purple-50 to-white border-violet-300 hover:border-violet-500',
          iconBg: 'bg-violet-600 text-white shadow-sm',
          badgeBg: 'bg-violet-200/80 text-violet-900 border-violet-300',
          textColor: 'text-violet-950',
          stat: lang === 'tr' ? 'Treuhand Bordro Hazır' : 'Treuhand Export'
        },
        {
          id: 'employees',
          title: lang === 'tr' ? 'Personel & HR Dosyaları' : 'Mitarbeiter & Personalakten',
          subtitle: lang === 'tr' ? 'Sözleşmeler, AHV, saatlik ücretler & 4 haneli PIN kodları' : 'Verträge, Versicherungen, Stundenlöhne & PINs',
          icon: Users2,
          badge: `${employees.length} Mitarbeiter`,
          cardBg: 'bg-gradient-to-br from-amber-100/90 via-amber-50 to-white border-amber-300 hover:border-amber-500',
          iconBg: 'bg-amber-600 text-white shadow-sm',
          badgeBg: 'bg-amber-200/80 text-amber-900 border-amber-300',
          textColor: 'text-amber-950',
          stat: lang === 'tr' ? 'İK & PIN Yönetimi' : 'Mitarbeiterakten'
        }
      ]
    },
    {
      id: 'finance',
      title: lang === 'tr' ? 'Alışveriş, Fatura & Kasa' : 'Einkauf, Belege & Treuhand',
      subtitle: lang === 'tr' ? 'Gerçek tedarikçiler, fatura OCR ve aylık muhasebe' : 'Lieferanten, Beleg-OCR und Monatsbuchhaltung',
      icon: ShoppingBag,
      badge: lang === 'tr' ? '3 Bölüm' : '3 Module',
      badgeClass: 'bg-blue-100 text-blue-900 border-blue-300',
      headerBg: 'bg-gradient-to-r from-blue-50 via-indigo-50 to-white border-blue-200',
      headerTextColor: 'text-blue-950',
      iconColor: 'bg-blue-600 text-white',
      modules: [
        {
          id: 'suppliers',
          title: lang === 'tr' ? 'Tedarikçiler & Sipariş' : 'Lieferanten & Einkauf',
          subtitle: lang === 'tr' ? 'Prodega, Hiestand, Pistor, Meyerhans, Daroz, Yeşil Vadi' : 'Zentraler Einkauf mit echten Schweizer Lieferanten',
          icon: Truck,
          badge: `${suppliers.length} Partner`,
          cardBg: 'bg-gradient-to-br from-blue-100/90 via-sky-50 to-white border-blue-300 hover:border-blue-500',
          iconBg: 'bg-blue-600 text-white shadow-sm',
          badgeBg: 'bg-blue-200/80 text-blue-900 border-blue-300',
          textColor: 'text-blue-950',
          stat: `${suppliers.length} Tedarikçi Kayıtlı`
        },
        {
          id: 'invoices',
          title: lang === 'tr' ? 'Fatura Tarama & OCR' : 'Rechnungs-Scan & OCR',
          subtitle: lang === 'tr' ? 'Kamera veya fotoğrafla otomatik İsviçre KDV (%2.6/%8.1) ayıklama' : 'Automatische Belegerfassung mit MwSt-Erkennung',
          icon: ScanLine,
          badge: `${unpaidInvoices.length} Offen`,
          cardBg: 'bg-gradient-to-br from-purple-100/90 via-fuchsia-50 to-white border-purple-300 hover:border-purple-500',
          iconBg: 'bg-purple-600 text-white shadow-sm',
          badgeBg: 'bg-purple-200/80 text-purple-900 border-purple-300',
          textColor: 'text-purple-950',
          stat: formatCurrency(totalUnpaid)
        },
        {
          id: 'accounting',
          title: lang === 'tr' ? 'Aylık Muhasebe & Kasa' : 'Monatsbuchhaltung & Finanzen',
          subtitle: lang === 'tr' ? 'Kategori giderleri, KDV dökümü & Treuhand Excel çıktısı' : 'Kostenanalyse, MwSt-Rückforderung & Treuhand-Journal',
          icon: ReceiptText,
          badge: 'Excel / CSV',
          cardBg: 'bg-gradient-to-br from-indigo-100/90 via-blue-50 to-white border-indigo-300 hover:border-indigo-500',
          iconBg: 'bg-indigo-600 text-white shadow-sm',
          badgeBg: 'bg-indigo-200/80 text-indigo-900 border-indigo-300',
          textColor: 'text-indigo-950',
          stat: lang === 'tr' ? 'Aylık Bilanço' : 'Monatsjournal'
        }
      ]
    },
    {
      id: 'operations',
      title: lang === 'tr' ? 'Operasyon, Hijyen & Genel' : 'Betrieb, Hygiene & Organisation',
      subtitle: lang === 'tr' ? 'Resmi HACCP hijyen kontrolü, panolar ve yedekleme' : 'HACCP-Check, Schwarzes Brett & Datensicherung',
      icon: ShieldCheck,
      badge: lang === 'tr' ? '3 Bölüm' : '3 Module',
      badgeClass: 'bg-teal-100 text-teal-900 border-teal-300',
      headerBg: 'bg-gradient-to-r from-teal-50 via-emerald-50 to-white border-teal-200',
      headerTextColor: 'text-teal-950',
      iconColor: 'bg-teal-600 text-white',
      modules: [
        {
          id: 'haccp',
          title: lang === 'tr' ? 'HACCP & Hijyen Kontrolleri' : 'HACCP & Hygiene-Check',
          subtitle: lang === 'tr' ? 'Soğuk oda sıcaklıkları, sabah ve akşam temizlik listesi' : 'Kühlraum-Temperaturen, Morgen- & Abendschliessung',
          icon: ShieldCheck,
          badge: 'HyV / LMG',
          cardBg: 'bg-gradient-to-br from-teal-100/90 via-emerald-50 to-white border-teal-300 hover:border-teal-500',
          iconBg: 'bg-teal-600 text-white shadow-sm',
          badgeBg: 'bg-teal-200/80 text-teal-900 border-teal-300',
          textColor: 'text-teal-950',
          stat: lang === 'tr' ? 'Resmi Denetime Uygun' : 'LMG Konform'
        },
        {
          id: 'bulletin',
          title: lang === 'tr' ? 'Duyuru Panosu & Notlar' : 'Schwarzes Brett & Infos',
          subtitle: lang === 'tr' ? 'Patron duyuruları, talimatlar ve şirket içi bildirimler' : 'Team-Mitteilungen, Arbeitsanweisungen & Termine',
          icon: Megaphone,
          badge: 'Team Info',
          cardBg: 'bg-gradient-to-br from-orange-100/90 via-amber-50 to-white border-orange-300 hover:border-orange-500',
          iconBg: 'bg-orange-600 text-white shadow-sm',
          badgeBg: 'bg-orange-200/80 text-orange-900 border-orange-300',
          textColor: 'text-orange-950',
          stat: lang === 'tr' ? 'Şirket Panosu' : 'Digitaler Aushang'
        },
        {
          id: 'database',
          title: lang === 'tr' ? 'Yerel Veritabanı & Yedek' : 'Lokale Datenbank & Backup',
          subtitle: lang === 'tr' ? 'Tek tıkla güvenli JSON yedek indir veya geri yükle' : 'Offline-First Datensicherung & JSON Export',
          icon: Database,
          badge: 'Local DB',
          cardBg: 'bg-gradient-to-br from-slate-200/90 via-slate-100 to-white border-slate-300 hover:border-slate-500',
          iconBg: 'bg-slate-700 text-white shadow-sm',
          badgeBg: 'bg-slate-200 text-slate-900 border-slate-300',
          textColor: 'text-slate-950',
          stat: lang === 'tr' ? 'Çevrimdışı Güvenli' : 'Offline bereit'
        }
      ]
    }
  ];

  // Employee-only simplified view
  const employeeModules = [
    {
      id: 'timeTracker',
      title: lang === 'tr' ? 'İşe Giriş / Çıkış (Stempeluhr)' : 'Meine Stempeluhr (Zeiterfassung)',
      subtitle: lang === 'tr' ? 'Tek tıkla işe başla, mola ver veya mesaiyi bitir' : 'Arbeitsbeginn, Pause erfassen & Feierabend',
      icon: Clock,
      badge: activeTimeLogs.find(l => l.employeeId === currentUser?.id) ? '● IM DIENST' : 'Bereit',
      cardBg: 'bg-gradient-to-br from-cyan-100/90 via-sky-50 to-white border-cyan-300 hover:border-cyan-500',
      iconBg: 'bg-cyan-600 text-white shadow-sm',
      badgeBg: 'bg-cyan-200/80 text-cyan-900 border-cyan-300',
      textColor: 'text-cyan-950',
      stat: lang === 'tr' ? 'Canlı Mesai' : 'Zeiterfassung'
    },
    {
      id: 'shifts',
      title: lang === 'tr' ? 'Vardiyalarım (2 Vardiya)' : 'Meine Schichten (Dienstplan)',
      subtitle: lang === 'tr' ? 'Bu haftaki çalışma gün ve saatleriniz' : 'Ihre Einsatzzeiten für die aktuelle Woche',
      icon: CalendarDays,
      badge: '2 Schichten',
      cardBg: 'bg-gradient-to-br from-emerald-100/90 via-emerald-50 to-white border-emerald-300 hover:border-emerald-500',
      iconBg: 'bg-emerald-600 text-white shadow-sm',
      badgeBg: 'bg-emerald-200/80 text-emerald-900 border-emerald-300',
      textColor: 'text-emerald-950',
      stat: lang === 'tr' ? 'Haftalık Plan' : 'Wochenplan'
    },
    {
      id: 'haccp',
      title: lang === 'tr' ? 'HACCP & Hijyen Görevleri' : 'HACCP & Hygiene-Check',
      subtitle: lang === 'tr' ? 'Dolap sıcaklıkları ve açılış/kapanış temizlik kontrolleri' : 'Temperatur messen & tägliche Checklisten abhaken',
      icon: ShieldCheck,
      badge: 'Täglich',
      cardBg: 'bg-gradient-to-br from-teal-100/90 via-emerald-50 to-white border-teal-300 hover:border-teal-500',
      iconBg: 'bg-teal-600 text-white shadow-sm',
      badgeBg: 'bg-teal-200/80 text-teal-900 border-teal-300',
      textColor: 'text-teal-950',
      stat: lang === 'tr' ? 'Günlük Kontrol' : 'Tagescheck'
    },
    {
      id: 'bulletin',
      title: lang === 'tr' ? 'Duyuru Panosu & Kurallar' : 'Schwarzes Brett & Mitteilungen',
      subtitle: lang === 'tr' ? 'Şirket içi önemli duyuruları ve mesajları görün' : 'Wichtige Mitteilungen der Geschäftsleitung lesen',
      icon: Megaphone,
      badge: 'Aushang',
      cardBg: 'bg-gradient-to-br from-orange-100/90 via-amber-50 to-white border-orange-300 hover:border-orange-500',
      iconBg: 'bg-orange-600 text-white shadow-sm',
      badgeBg: 'bg-orange-200/80 text-orange-900 border-orange-300',
      textColor: 'text-orange-950',
      stat: lang === 'tr' ? 'Duyurular' : 'Mitteilungen'
    },
    {
      id: 'sickLeave',
      title: lang === 'tr' ? 'Hastalık Bildir (Krankmeldung)' : 'Krankmeldung abgeben',
      subtitle: lang === 'tr' ? 'Gerekçe seçimi ve doktor raporu (Attest) yükleme' : 'Absenzgrund mitteilen & Arztzeugnis hochladen',
      icon: HeartPulse,
      badge: 'Schnellmeldung',
      cardBg: 'bg-gradient-to-br from-rose-100/90 via-rose-50 to-white border-rose-300 hover:border-rose-500',
      iconBg: 'bg-rose-600 text-white shadow-sm',
      badgeBg: 'bg-rose-200/80 text-rose-900 border-rose-300',
      textColor: 'text-rose-950',
      stat: lang === 'tr' ? 'Doktor Raporu' : 'Arztzeugnis'
    },
    {
      id: 'sickLeave',
      title: lang === 'tr' ? 'İzin / Tatil İste (Urlaub)' : 'Urlaubsantrag stellen',
      subtitle: lang === 'tr' ? 'Kalan izin günlerinizi görün ve talep oluşturun' : 'Resturlaub einsehen & freie Tage beantragen',
      icon: Palmtree,
      badge: 'Urlaubskonto',
      cardBg: 'bg-gradient-to-br from-amber-100/90 via-yellow-50 to-white border-amber-300 hover:border-amber-500',
      iconBg: 'bg-amber-600 text-white shadow-sm',
      badgeBg: 'bg-amber-200/80 text-amber-900 border-amber-300',
      textColor: 'text-amber-950',
      stat: lang === 'tr' ? 'İzin Talebi' : 'Urlaubstage'
    }
  ];

  const filteredAdminCategories = activeCategoryFilter === 'all'
    ? adminCategories
    : adminCategories.filter(c => c.id === activeCategoryFilter);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Top Executive Welcome Hub Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white border border-slate-700/80 shadow-xl relative overflow-hidden">
        {/* Ambient Decorative Lighting */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Header Row: Welcome & Chef Identity */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>
                {isAdmin
                  ? (lang === 'tr' ? 'YÖNETİM KONTROL MERKEZİ • ZÜRİH' : 'BETRIEBSLEITUNG AKTIV • ZÜRICH')
                  : (lang === 'tr' ? 'PERSONEL HIZLI İŞLEM PANELİ' : 'MITARBEITER SCHNELLZUGRIFF')}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              {lang === 'tr'
                ? `Hoş Geldiniz, ${currentUser?.name.split(' ')[0]}`
                : `Willkommen, ${currentUser?.name.split(' ')[0]}`}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              {isAdmin
                ? (lang === 'tr'
                    ? 'İsviçre L-GAV Gastgewerbe ve HACCP gıda hijyen standartlarına tam uyumlu dijital yönetim platformu.'
                    : 'Zentrales Management & Schweizer Betriebskontrolle nach L-GAV und Lebensmittelrecht (HACCP).')
                : (lang === 'tr'
                    ? 'İşe giriş-çıkış yapabilir, vardiyalarınızı görebilir veya hastalık ve tatil talebi oluşturabilirsiniz.'
                    : 'Hier können Sie sich einstempeln, Ihre Schichten einsehen oder Absenzen melden.')}
            </p>
          </div>

          {/* Right: Symmetrical Executive Profile Card */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
            {!isAdmin && (
              <button
                onClick={() => {
                  const adminUser = employees.find(e => e.role === 'admin') || employees[0];
                  StorageService.setCurrentUser(adminUser);
                  window.location.reload();
                }}
                className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-md flex items-center gap-2 transition"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{lang === 'tr' ? '👑 Patron Ekranına Geç' : '👑 Zum Chef-Modus'}</span>
              </button>
            )}

            <div
              onClick={() => setShowChefModal(true)}
              className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 transition cursor-pointer flex items-center gap-3.5 shadow-lg group"
              title={lang === 'tr' ? 'Özlük Dosyasını Aç (GAV Dossier)' : 'Personalakte öffnen (GAV Dossier)'}
            >
              <img
                src={currentUser?.avatar}
                alt={currentUser?.name}
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-emerald-400 group-hover:scale-105 transition"
              />
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-xs font-black text-white">{currentUser?.name}</p>
                  <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-emerald-500/30 text-emerald-300 border border-emerald-500/40">
                    PIN: {currentUser?.pin || '9999'}
                  </span>
                </div>
                <p className="text-[11px] text-emerald-300 font-semibold">{currentUser?.jobTitle}</p>
                <span className="inline-flex items-center gap-1 text-[10px] text-slate-300 group-hover:text-white font-bold mt-1 transition">
                  <span>{lang === 'tr' ? 'Özlük Dosyasını Aç →' : 'Personalakte öffnen →'}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Metrics Bar: Symmetrical 4-Card KPI Grid */}
        {isAdmin && (
          <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-3.5 mt-6 pt-5 border-t border-white/10">
            {/* KPI 1: Lieferanten */}
            <div
              onClick={() => onNavigate('suppliers')}
              className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15 transition cursor-pointer hover:-translate-y-0.5 group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  {lang === 'tr' ? 'Tedarikçiler' : 'Lieferanten'}
                </span>
                <div className="w-7 h-7 rounded-lg bg-blue-500/30 border border-blue-400/40 flex items-center justify-center text-blue-300">
                  <Truck className="w-3.5 h-3.5" />
                </div>
              </div>
              <p className="text-lg font-black text-white">{suppliers.length} Partner</p>
              <p className="text-[10px] text-blue-200 mt-0.5">Prodega, Hiestand, Pistor</p>
            </div>

            {/* KPI 2: Mitarbeiter */}
            <div
              onClick={() => onNavigate('employees')}
              className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15 transition cursor-pointer hover:-translate-y-0.5 group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  {lang === 'tr' ? 'Personel' : 'Mitarbeiter'}
                </span>
                <div className="w-7 h-7 rounded-lg bg-emerald-500/30 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
                  <Users2 className="w-3.5 h-3.5" />
                </div>
              </div>
              <p className="text-lg font-black text-white">{employees.length} {lang === 'tr' ? 'Çalışan' : 'Personen'}</p>
              <p className="text-[10px] text-emerald-200 mt-0.5">5 Departman Aktif</p>
            </div>

            {/* KPI 3: Stempeluhr Live */}
            <div
              onClick={() => onNavigate('timeTracker')}
              className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15 transition cursor-pointer hover:-translate-y-0.5 group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  {lang === 'tr' ? 'Canlı Mesai' : 'Stempeluhr'}
                </span>
                <div className="w-7 h-7 rounded-lg bg-cyan-500/30 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                  <Clock className="w-3.5 h-3.5" />
                </div>
              </div>
              <p className="text-lg font-black text-white">{activeTimeLogs.length} {lang === 'tr' ? 'Görevde' : 'Im Dienst'}</p>
              <p className="text-[10px] text-cyan-200 mt-0.5">Tablet Kiosk Terminali</p>
            </div>

            {/* KPI 4: Offene Rechnungen */}
            <div
              onClick={() => onNavigate('invoices')}
              className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15 transition cursor-pointer hover:-translate-y-0.5 group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  {lang === 'tr' ? 'Açık Faturalar' : 'Offene Belege'}
                </span>
                <div className="w-7 h-7 rounded-lg bg-purple-500/30 border border-purple-400/40 flex items-center justify-center text-purple-300">
                  <ReceiptText className="w-3.5 h-3.5" />
                </div>
              </div>
              <p className="text-lg font-black text-white">{formatCurrency(totalUnpaid)}</p>
              <p className="text-[10px] text-purple-200 mt-0.5">{unpaidInvoices.length} {lang === 'tr' ? 'Fatura bekliyor' : 'Belege offen'}</p>
            </div>
          </div>
        )}
      </div>

      {/* Admin View: 3 Distinct Categorized Pillars Side-by-Side */}
      {isAdmin ? (
        <div className="space-y-4">
          {/* Quick Category Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveCategoryFilter('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
                  activeCategoryFilter === 'all'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{lang === 'tr' ? 'Tümü (3 Sütun Yan Yana)' : 'Alle (3 Spalten nebeneinander)'}</span>
              </button>

              <button
                onClick={() => setActiveCategoryFilter('hr')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeCategoryFilter === 'hr'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}
              >
                <Users2 className="w-3.5 h-3.5" />
                <span>{lang === 'tr' ? 'Personel & Vardiya (5)' : 'Personal & Schichten (5)'}</span>
              </button>

              <button
                onClick={() => setActiveCategoryFilter('finance')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeCategoryFilter === 'finance'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{lang === 'tr' ? 'Alışveriş, Fatura & Kasa (3)' : 'Einkauf & Finanzen (3)'}</span>
              </button>

              <button
                onClick={() => setActiveCategoryFilter('operations')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeCategoryFilter === 'operations'
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{lang === 'tr' ? 'Operasyon, Hijyen & Genel (3)' : 'Betrieb & Hygiene (3)'}</span>
              </button>
            </div>

            <span className="text-xs text-slate-500 font-medium px-2">
              {lang === 'tr' ? '💡 Renkli kartlara tıklayarak doğrudan girin' : '💡 Klicken zum Öffnen'}
            </span>
          </div>

          {/* 3 Sütun Yan Yana (Responsive 3-Column Categorized Grid) */}
          <div className={`grid grid-cols-1 ${activeCategoryFilter === 'all' ? 'lg:grid-cols-3' : 'lg:grid-cols-1'} gap-6 items-start`}>
            {filteredAdminCategories.map((category) => {
              const CategoryIcon = category.icon;
              return (
                <div
                  key={category.id}
                  className="bg-white/95 rounded-3xl border border-slate-200/90 shadow-sm p-4 md:p-5 flex flex-col gap-4"
                >
                  {/* Category Header Card */}
                  <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${category.headerBg}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-xs ${category.iconColor}`}>
                        <CategoryIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className={`text-base font-black ${category.headerTextColor} tracking-tight leading-tight`}>
                          {category.title}
                        </h2>
                        <p className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">
                          {category.subtitle}
                        </p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border shadow-2xs shrink-0 ${category.badgeClass}`}>
                      {category.badge}
                    </span>
                  </div>

                  {/* Cards inside this Category */}
                  <div className="space-y-3.5">
                    {category.modules.map((mod) => {
                      const Icon = mod.icon;
                      return (
                        <div
                          key={mod.id + mod.title}
                          onClick={() => onNavigate(mod.id)}
                          className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-xs hover:shadow-md hover:-translate-y-0.5 ${mod.cardBg} group`}
                        >
                          <div>
                            <div className="flex items-start justify-between gap-3 mb-2.5">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-xs ${mod.iconBg} group-hover:scale-105 transition`}>
                                <Icon className="w-5 h-5" />
                              </div>
                              {mod.badge && (
                                <span className={`text-[10px] font-black py-0.5 px-2.5 rounded-full border shadow-2xs ${mod.badgeBg}`}>
                                  {mod.badge}
                                </span>
                              )}
                            </div>

                            <h3 className={`text-base font-black ${mod.textColor} mb-1 tracking-tight`}>
                              {mod.title}
                            </h3>
                            <p className="text-xs text-slate-700 leading-relaxed">
                              {mod.subtitle}
                            </p>
                          </div>

                          <div className="mt-3.5 pt-2.5 border-t border-slate-300/60 flex items-center justify-between text-xs font-bold text-slate-800 group-hover:text-slate-950">
                            <span className="text-[11px] font-semibold text-slate-600">{mod.stat || ''}</span>
                            <div className="flex items-center gap-1 text-slate-900 group-hover:translate-x-1 transition">
                              <span className="font-extrabold">{lang === 'tr' ? 'Aç' : 'Öffnen'}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Employee View: Richly-colored cards */
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-black text-slate-700 uppercase tracking-wider">
              {lang === 'tr' ? 'Görev & İşlemlerim' : 'Meine Aufgaben & Schnellzugriff'}
            </h2>
            <span className="text-xs text-slate-500">
              {lang === 'tr' ? 'Bölüme tıklayarak doğrudan giriş yapın' : 'Klicken zum Öffnen'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {employeeModules.map((mod) => {
              const Icon = mod.icon;
              return (
                <div
                  key={mod.id + mod.title}
                  onClick={() => onNavigate(mod.id)}
                  className={`p-5 rounded-3xl border transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-xs hover:shadow-md hover:-translate-y-0.5 ${mod.cardBg} group`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border shadow-xs ${mod.iconBg} group-hover:scale-105 transition`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      {mod.badge && (
                        <span className={`text-[10px] font-black py-0.5 px-2.5 rounded-full border shadow-2xs ${mod.badgeBg}`}>
                          {mod.badge}
                        </span>
                      )}
                    </div>

                    <h3 className={`text-base font-black ${mod.textColor} mb-1 tracking-tight`}>
                      {mod.title}
                    </h3>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {mod.subtitle}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-300/60 flex items-center justify-between text-xs font-bold text-slate-800 group-hover:text-slate-950">
                    <span className="text-[11px] font-semibold text-slate-600">{mod.stat || ''}</span>
                    <div className="flex items-center gap-1 text-slate-900 group-hover:translate-x-1 transition">
                      <span className="font-extrabold">{lang === 'tr' ? 'Aç' : 'Öffnen'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Chef Personalakte Dossier Modal */}
      {showChefModal && (
        <PersonalakteModal
          employee={currentUser}
          lang={lang}
          onClose={() => setShowChefModal(false)}
          onSave={(updated) => {
            StorageService.saveEmployee(updated);
            StorageService.setCurrentUser(updated);
            setShowChefModal(false);
            window.location.reload();
          }}
          onSwitchUser={(emp) => {
            StorageService.setCurrentUser(emp);
            window.location.reload();
          }}
        />
      )}

    </div>
  );
};

