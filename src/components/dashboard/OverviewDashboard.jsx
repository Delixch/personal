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
  Sparkle,
  Home
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { PersonalakteModal } from '../employees/PersonalakteModal';

export const OverviewDashboard = ({
  lang,
  currentUser,
  onNavigate,
  activeCategoryFilter: propCategoryFilter,
  setActiveCategoryFilter: propSetCategoryFilter
}) => {
  const [localCategoryFilter, setLocalCategoryFilter] = useState('all');
  const activeCategoryFilter = propCategoryFilter !== undefined ? propCategoryFilter : localCategoryFilter;
  const setActiveCategoryFilter = propSetCategoryFilter || setLocalCategoryFilter;
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

  const adminCategories = [
    {
      id: 'hr',
      title: lang === 'tr' ? 'Personel & Çalışma Düzeni' : 'Personal & Arbeitszeiten',
      subtitle: lang === 'tr' ? 'Vardiya, stempeluhr, izinler, maaş ve çalışanlar' : 'Schichten, Stempeluhr, Absenzen, Lohn & Akten',
      icon: Users2,
      badge: lang === 'tr' ? '5 Bölüm' : '5 Module',
      badgeClass: 'badge-neutral',
      headerBg: 'bg-subtle border-line',
      headerTextColor: 'text-ink',
      iconColor: 'icon-box',
      modules: [
        {
          id: 'timeTracker',
          title: lang === 'tr' ? 'Giriş-Çıkış (Stempeluhr)' : 'Stempeluhr & Kiosk',
          subtitle: lang === 'tr' ? 'Tablet PIN terminali, canlı saat ve mola takibi' : 'Tablet-PIN-Terminal, Live-Stempeluhr & Pausen',
          icon: Clock,
          badge: `${activeTimeLogs.length} Im Dienst`,
          cardBg: 'card-inner border-line ',
          iconBg: 'icon-box',
          badgeBg: 'badge-neutral',
          textColor: 'text-ink',
          stat: lang === 'tr' ? 'Canlı PIN Terminali' : 'Kiosk Terminal'
        },
        {
          id: 'shifts',
          title: lang === 'tr' ? 'Vardiya Planı (2 Vardiya)' : 'Schichtplan (2 Schichten)',
          subtitle: lang === 'tr' ? 'Früh- & Spätschicht, departmanlar & yedek eleman' : 'Einsatzplanung 2 Schichten & Ersatzpersonal',
          icon: CalendarDays,
          badge: `${todayShifts.length} Schichten`,
          cardBg: 'card-inner border-line ',
          iconBg: 'icon-box',
          badgeBg: 'badge-neutral',
          textColor: 'text-ink',
          stat: lang === 'tr' ? '5 Departman Aktif' : '5 Abteilungen'
        },
        {
          id: 'sickLeave',
          title: lang === 'tr' ? 'Hastalık & İzin (Absenzen)' : 'Krankmeldungen & Absenzen',
          subtitle: lang === 'tr' ? 'Gerekçe seçimi, doktor raporu ve tatil günleri' : 'Attest-Upload, Absenzen & Urlaubsanträge',
          icon: HeartPulse,
          badge: sickReports.length > 0 ? `${sickReports.length} Gemeldet` : 'Alles OK',
          cardBg: 'card-inner border-line ',
          iconBg: 'icon-box',
          badgeBg: 'badge-neutral',
          textColor: 'text-ink',
          stat: lang === 'tr' ? 'Rapor & İzin Takibi' : 'Urlaub & Atteste'
        },
        {
          id: 'payroll',
          title: lang === 'tr' ? 'Maaş & Saat Hesaplayıcı' : 'Lohn- & Stundenabrechnung',
          subtitle: lang === 'tr' ? 'İsviçre GAV, fazla mesai & Treuhand CSV bordro çıktısı' : 'GAV Gastrosuisse, Überstunden & Treuhand-CSV',
          icon: Calculator,
          badge: 'GAV Konform',
          cardBg: 'card-inner border-line ',
          iconBg: 'icon-box',
          badgeBg: 'badge-neutral',
          textColor: 'text-ink',
          stat: lang === 'tr' ? 'Treuhand Bordro Hazır' : 'Treuhand Export'
        },
        {
          id: 'employees',
          title: lang === 'tr' ? 'Personel & HR Dosyaları' : 'Mitarbeiter & Personalakten',
          subtitle: lang === 'tr' ? 'Sözleşmeler, AHV, saatlik ücretler & 4 haneli PIN kodları' : 'Verträge, Versicherungen, Stundenlöhne & PINs',
          icon: Users2,
          badge: `${employees.length} Mitarbeiter`,
          cardBg: 'card-inner border-line ',
          iconBg: 'icon-box',
          badgeBg: 'badge-neutral',
          textColor: 'text-ink',
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
      badgeClass: 'badge-neutral',
      headerBg: 'bg-subtle border-line',
      headerTextColor: 'text-ink',
      iconColor: 'icon-box',
      modules: [
        {
          id: 'suppliers',
          title: lang === 'tr' ? 'Tedarikçiler & Sipariş' : 'Lieferanten & Einkauf',
          subtitle: lang === 'tr' ? 'Prodega, Hiestand, Pistor, Meyerhans, Daroz, Yeşil Vadi' : 'Zentraler Einkauf mit echten Schweizer Lieferanten',
          icon: Truck,
          badge: `${suppliers.length} Partner`,
          cardBg: 'card-inner border-line ',
          iconBg: 'icon-box',
          badgeBg: 'badge-neutral',
          textColor: 'text-ink',
          stat: lang === 'tr' ? `${suppliers.length} Tedarikçi Kayıtlı` : `${suppliers.length} Partner erfasst`
        },
        {
          id: 'invoices',
          title: lang === 'tr' ? 'Fatura Tarama & OCR' : 'Rechnungs-Scan & OCR',
          subtitle: lang === 'tr' ? 'Kamera veya fotoğrafla otomatik İsviçre KDV (%2.6/%8.1) ayıklama' : 'Automatische Belegerfassung mit MwSt-Erkennung',
          icon: ScanLine,
          badge: `${unpaidInvoices.length} Offen`,
          cardBg: 'card-inner border-line ',
          iconBg: 'icon-box',
          badgeBg: 'badge-neutral',
          textColor: 'text-ink',
          stat: formatCurrency(totalUnpaid)
        },
        {
          id: 'accounting',
          title: lang === 'tr' ? 'Aylık Muhasebe & Kasa' : 'Monatsbuchhaltung & Finanzen',
          subtitle: lang === 'tr' ? 'Kategori giderleri, KDV dökümü & Treuhand Excel çıktısı' : 'Kostenanalyse, MwSt-Rückforderung & Treuhand-Journal',
          icon: ReceiptText,
          badge: 'Excel / CSV',
          cardBg: 'card-inner border-line ',
          iconBg: 'icon-box',
          badgeBg: 'badge-neutral',
          textColor: 'text-ink',
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
      badgeClass: 'badge-neutral',
      headerBg: 'bg-subtle border-line',
      headerTextColor: 'text-ink',
      iconColor: 'icon-box',
      modules: [
        {
          id: 'haccp',
          title: lang === 'tr' ? 'HACCP & Hijyen Kontrolleri' : 'HACCP & Hygiene-Check',
          subtitle: lang === 'tr' ? 'Soğuk oda sıcaklıkları, sabah ve akşam temizlik listesi' : 'Kühlraum-Temperaturen, Morgen- & Abendschliessung',
          icon: ShieldCheck,
          badge: 'HyV / LMG',
          cardBg: 'card-inner border-line ',
          iconBg: 'icon-box',
          badgeBg: 'badge-neutral',
          textColor: 'text-ink',
          stat: lang === 'tr' ? 'Resmi Denetime Uygun' : 'LMG Konform'
        },
        {
          id: 'bulletin',
          title: lang === 'tr' ? 'Duyuru Panosu & Notlar' : 'Schwarzes Brett & Infos',
          subtitle: lang === 'tr' ? 'Patron duyuruları, talimatlar ve şirket içi bildirimler' : 'Team-Mitteilungen, Arbeitsanweisungen & Termine',
          icon: Megaphone,
          badge: 'Team Info',
          cardBg: 'card-inner border-line ',
          iconBg: 'icon-box',
          badgeBg: 'badge-neutral',
          textColor: 'text-ink',
          stat: lang === 'tr' ? 'Şirket Panosu' : 'Digitaler Aushang'
        },
        {
          id: 'database',
          title: lang === 'tr' ? 'Yerel Veritabanı & Yedek' : 'Lokale Datenbank & Backup',
          subtitle: lang === 'tr' ? 'Tek tıkla güvenli JSON yedek indir veya geri yükle' : 'Offline-First Datensicherung & JSON Export',
          icon: Database,
          badge: 'Local DB',
          cardBg: 'card-inner border-line ',
          iconBg: 'icon-box',
          badgeBg: 'badge-neutral',
          textColor: 'text-ink',
          stat: lang === 'tr' ? 'Çevrimdışı Güvenli' : 'Offline bereit'
        }
      ]
    }
  ];

  const employeeModules = [
    {
      id: 'timeTracker',
      title: lang === 'tr' ? 'İşe Giriş / Çıkış (Stempeluhr)' : 'Meine Stempeluhr (Zeiterfassung)',
      subtitle: lang === 'tr' ? 'Tek tıkla işe başla, mola ver veya mesaiyi bitir' : 'Arbeitsbeginn, Pause erfassen & Feierabend',
      icon: Clock,
      badge: activeTimeLogs.find(l => l.employeeId === currentUser?.id) ? '● IM DIENST' : 'Bereit',
      cardBg: 'card-inner border-line ',
      iconBg: 'icon-box',
      badgeBg: 'badge-neutral',
      textColor: 'text-ink',
      stat: lang === 'tr' ? 'Canlı Mesai' : 'Zeiterfassung'
    },
    {
      id: 'shifts',
      title: lang === 'tr' ? 'Vardiyalarım (Dienstplan)' : 'Meine Schichten (Dienstplan)',
      subtitle: lang === 'tr' ? 'Bu haftaki çalışma gün ve saatleriniz' : 'Ihre Einsatzzeiten für die aktuelle Woche',
      icon: CalendarDays,
      badge: `${shifts.filter(s => s.employeeId === currentUser?.id).length} ${lang === 'tr' ? 'Vardiya' : 'Schichten'}`,
      cardBg: 'card-inner border-line ',
      iconBg: 'icon-box',
      badgeBg: 'badge-neutral',
      textColor: 'text-ink',
      stat: lang === 'tr' ? 'Haftalık Plan' : 'Wochenplan'
    },
    {
      id: 'haccp',
      title: lang === 'tr' ? 'HACCP & Hijyen Görevleri' : 'HACCP & Hygiene-Check',
      subtitle: lang === 'tr' ? 'Dolap sıcaklıkları ve açılış/kapanış temizlik kontrolleri' : 'Temperatur messen & tägliche Checklisten abhaken',
      icon: ShieldCheck,
      badge: 'Täglich',
      cardBg: 'card-inner border-line ',
      iconBg: 'icon-box',
      badgeBg: 'badge-neutral',
      textColor: 'text-ink',
      stat: lang === 'tr' ? 'Günlük Kontrol' : 'Tagescheck'
    },
    {
      id: 'bulletin',
      title: lang === 'tr' ? 'Duyuru Panosu & Kurallar' : 'Schwarzes Brett & Mitteilungen',
      subtitle: lang === 'tr' ? 'Şirket içi önemli duyuruları ve mesajları görün' : 'Wichtige Mitteilungen der Geschäftsleitung lesen',
      icon: Megaphone,
      badge: 'Aushang',
      cardBg: 'card-inner border-line ',
      iconBg: 'icon-box',
      badgeBg: 'badge-neutral',
      textColor: 'text-ink',
      stat: lang === 'tr' ? 'Duyurular' : 'Mitteilungen'
    },
    {
      id: 'sickLeave',
      title: lang === 'tr' ? 'Hastalık Bildir (Krankmeldung)' : 'Krankmeldung abgeben',
      subtitle: lang === 'tr' ? 'Gerekçe seçimi ve doktor raporu (Attest) yükleme' : 'Absenzgrund mitteilen & Arztzeugnis hochladen',
      icon: HeartPulse,
      badge: 'Schnellmeldung',
      cardBg: 'card-inner border-line ',
      iconBg: 'icon-box',
      badgeBg: 'badge-neutral',
      textColor: 'text-ink',
      stat: lang === 'tr' ? 'Doktor Raporu' : 'Arztzeugnis'
    },
    {
      id: 'sickLeave',
      title: lang === 'tr' ? 'İzin / Tatil İste (Urlaub)' : 'Urlaubsantrag stellen',
      subtitle: lang === 'tr' ? 'Kalan izin günlerinizi görün ve talep oluşturun' : 'Resturlaub einsehen & freie Tage beantragen',
      icon: Palmtree,
      badge: 'Urlaubskonto',
      cardBg: 'card-inner border-line ',
      iconBg: 'icon-box',
      badgeBg: 'badge-neutral',
      textColor: 'text-ink',
      stat: lang === 'tr' ? 'İzin Talebi' : 'Urlaubstage'
    }
  ];

  const filteredAdminCategories = activeCategoryFilter === 'all'
    ? adminCategories
    : adminCategories.filter(c => c.id === activeCategoryFilter);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      <div className="p-6 rounded-3xl bg-surface text-ink border border-line relative overflow-hidden">

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="page-title text-ink">
                {lang === 'tr'
                  ? `Hoş Geldiniz, ${currentUser?.name.split(' ')[0]}`
                  : `Willkommen, ${currentUser?.name.split(' ')[0]}`}
              </h1>
              </div>

            <p className="text-subhead text-ink-soft max-w-2xl md:max-w-3xl leading-relaxed">
              {isAdmin
                ? (lang === 'tr'
                    ? 'İsviçre L-GAV Gastgewerbe ve HACCP gıda hijyen standartlarına tam uyumlu dijital yönetim platformu.'
                    : 'Zentrales Management & Schweizer Betriebskontrolle nach L-GAV und Lebensmittelrecht (HACCP).')
                : (lang === 'tr'
                    ? 'İşe giriş-çıkış yapabilir, vardiyalarınızı görebilir veya hastalık ve tatil talebi oluşturabilirsiniz.'
                    : 'Hier können Sie sich einstempeln, Ihre Schichten einsehen oder Absenzen melden.')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
            <div
              onClick={() => setShowChefModal(true)}
              className="p-3.5 rounded-2xl card-inner border border-line transition-all duration-200 hover:-translate-y-1 hover:border-brand/60 hover:shadow-lg hover:shadow-black/30 active:scale-98 cursor-pointer flex items-center gap-3.5 group"
              title={lang === 'tr' ? 'Özlük Dosyasını Aç (GAV Dossier)' : 'Personalakte öffnen (GAV Dossier)'}
            >
              <img
                src={currentUser?.avatar}
                alt={currentUser?.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-line transition"
              />
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-xs font-black text-ink">{currentUser?.name}</p>
                  <span className="badge badge-brand">
                    PIN: {currentUser?.pin || '9999'}
                  </span>
                </div>
                <p className="text-[11px] text-brand font-semibold mt-0.5">{currentUser?.jobTitle}</p>
                <span className="inline-flex items-center gap-1 text-[10px] text-ink-soft group- font-bold mt-1 transition">
                  <span>{lang === 'tr' ? 'Özlük Dosyasını Aç →' : 'Personalakte öffnen →'}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {isAdmin && (
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-6 pt-5 border-t border-line">
            
            {/* CARD 1: LIEFERANTEN */}
            <div
              onClick={() => onNavigate('suppliers')}
              className="p-4 rounded-2xl card-inner border border-line transition-all duration-200 hover:-translate-y-1 hover:border-white hover:shadow-lg hover:shadow-black/30 active:scale-98 cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-8 h-8 rounded-xl icon-box flex items-center justify-center transition-transform duration-200 group-hover:scale-110 shrink-0">
                  <Truck className="w-4 h-4 text-ink" />
                </div>
                <span className="text-[11px] font-bold text-brand uppercase tracking-wider">
                  {lang === 'tr' ? 'Tedarikçiler' : 'Lieferanten'}
                </span>
              </div>
              <div>
                <p className="text-xl font-black tracking-tight" style={{ color: '#10b981' }}>
                  {suppliers.length} {lang === 'tr' ? 'Firma' : 'Partner'}
                </p>
                <p className="text-xs text-ink leading-relaxed mt-0.5 truncate font-normal">Prodega, Hiestand, Pistor</p>
              </div>
            </div>

            {/* CARD 2: MITARBEITER */}
            <div
              onClick={() => onNavigate('employees')}
              className="p-4 rounded-2xl card-inner border border-line transition-all duration-200 hover:-translate-y-1 hover:border-white hover:shadow-lg hover:shadow-black/30 active:scale-98 cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-8 h-8 rounded-xl icon-box flex items-center justify-center transition-transform duration-200 group-hover:scale-110 shrink-0">
                  <Users2 className="w-4 h-4 text-ink" />
                </div>
                <span className="text-[11px] font-bold text-brand uppercase tracking-wider">
                  {lang === 'tr' ? 'Personel' : 'Mitarbeiter'}
                </span>
              </div>
              <div>
                <p className="text-xl font-black tracking-tight" style={{ color: '#10b981' }}>
                  {employees.length} {lang === 'tr' ? 'Kişi' : 'Personen'}
                </p>
                <p className="text-xs text-ink leading-relaxed mt-0.5 font-normal">{lang === 'tr' ? '5 Departman Aktif' : '5 Abteilungen aktiv'}</p>
              </div>
            </div>

            {/* CARD 3: STEMPELUHR */}
            <div
              onClick={() => onNavigate('timeTracker')}
              className="p-4 rounded-2xl card-inner border border-line transition-all duration-200 hover:-translate-y-1 hover:border-white hover:shadow-lg hover:shadow-black/30 active:scale-98 cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-8 h-8 rounded-xl icon-box flex items-center justify-center transition-transform duration-200 group-hover:scale-110 shrink-0">
                  <Clock className="w-4 h-4 text-ink" />
                </div>
                <span className="text-[11px] font-bold text-brand uppercase tracking-wider">
                  {lang === 'tr' ? 'Canlı Mesai' : 'Stempeluhr'}
                </span>
              </div>
              <div>
                <p className="text-xl font-black tracking-tight flex items-center gap-2" style={{ color: '#10b981' }}>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] inline-block animate-pulse shrink-0"></span>
                  <span>{activeTimeLogs.length} {lang === 'tr' ? 'Çalışıyor' : 'Im Dienst'}</span>
                </p>
                <p className="text-xs text-ink leading-relaxed mt-0.5 font-normal">{lang === 'tr' ? 'Tablet Kiosk Terminali' : 'Digitales Kiosk-Terminal'}</p>
              </div>
            </div>

            {/* CARD 4: OFFENE BELEGE */}
            <div
              onClick={() => onNavigate('invoices')}
              className="p-4 rounded-2xl card-inner border border-line transition-all duration-200 hover:-translate-y-1 hover:border-white hover:shadow-lg hover:shadow-black/30 active:scale-98 cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-8 h-8 rounded-xl icon-box flex items-center justify-center transition-transform duration-200 group-hover:scale-110 shrink-0">
                  <ReceiptText className="w-4 h-4 text-ink" />
                </div>
                <span className="text-[11px] font-bold text-brand uppercase tracking-wider">
                  {lang === 'tr' ? 'Açık Faturalar' : 'Offene Belege'}
                </span>
              </div>
              <div>
                <p className="text-xl font-black tracking-tight font-mono" style={{ color: '#10b981' }}>
                  {formatCurrency(totalUnpaid)}
                </p>
                <p className="text-xs text-ink leading-relaxed mt-0.5 font-normal">{unpaidInvoices.length} {lang === 'tr' ? 'Fatura bekliyor' : 'Belege offen'}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {isAdmin ? (
        <div className="space-y-4">
          
          <div className="bg-surface p-6 rounded-3xl border border-line">
            <div className="flex items-start sm:items-center gap-3">
              
              <button
                onClick={() => setActiveCategoryFilter('all')}
                title={lang === 'tr' ? 'Tüm Bölümleri Göster' : 'Alle Bereiche anzeigen'}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center shrink-0 ${
                  activeCategoryFilter === 'all'
                    ? 'btn-brand font-black'
                    : 'card-inner text-ink border border-line'
                }`}
              >
                <Home className="w-4 h-4" />
              </button>

              <div className="flex flex-col sm:flex-row flex-wrap gap-2 w-full">
                <button
                  onClick={() => setActiveCategoryFilter(activeCategoryFilter === 'hr' ? 'all' : 'hr')}
                  className={`px-3.5 py-2 rounded-md text-xs font-bold transition flex items-center gap-1.5 w-full sm:w-auto cursor-pointer ${
                    activeCategoryFilter === 'hr'
                      ? 'btn-brand font-black'
                      : 'card-inner text-ink border border-line'
                  }`}
                >
                  <Users2 className="w-3.5 h-3.5" />
                  <span className="text-left">{lang === 'tr' ? 'Personel & Vardiya (5)' : 'Personal & Schichten (5)'}</span>
                </button>

                <button
                  onClick={() => setActiveCategoryFilter(activeCategoryFilter === 'finance' ? 'all' : 'finance')}
                  className={`px-3.5 py-2 rounded-md text-xs font-bold transition flex items-center gap-1.5 w-full sm:w-auto cursor-pointer ${
                    activeCategoryFilter === 'finance'
                      ? 'btn-brand font-black'
                      : 'card-inner text-ink border border-line'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span className="text-left">{lang === 'tr' ? 'Alışveriş, Fatura & Kasa (3)' : 'Einkauf & Finanzen (3)'}</span>
                </button>

                <button
                  onClick={() => setActiveCategoryFilter(activeCategoryFilter === 'operations' ? 'all' : 'operations')}
                  className={`px-3.5 py-2 rounded-md text-xs font-bold transition flex items-center gap-1.5 w-full sm:w-auto cursor-pointer ${
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

          <div className={`grid grid-cols-1 ${activeCategoryFilter === 'all' ? 'lg:grid-cols-3' : 'lg:grid-cols-1'} gap-6 items-start`}>
            {filteredAdminCategories.map((category) => {
              const CategoryIcon = category.icon;
              return (
                <div
                  key={category.id}
                  className="bg-surface rounded-3xl border border-line p-6 flex flex-col gap-4"
                >
                  
                  <div className="space-y-3.5">
                    {category.modules.map((mod) => {
                      const Icon = mod.icon;
                      return (
                        <div
                          key={mod.id + mod.title}
                          onClick={() => onNavigate(mod.id)}
                          className={`p-4 rounded-2xl border cursor-pointer flex flex-col justify-between ${mod.cardBg} card-inner group transition-all duration-200 hover:-translate-y-1 hover:border-white hover:shadow-lg hover:shadow-black/30 active:scale-98`}
                        >
                          <div>
                            {/* İKON VE TURUNCU BAŞLIK YAN YANA */}
                            <div className="flex items-center gap-3 mb-2.5">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${mod.iconBg} shrink-0 transition-transform duration-200 group-hover:scale-110`}>
                                <Icon className="w-5 h-5" />
                              </div>
                              <h3 className="text-base font-bold tracking-tight text-brand card-title-orange leading-snug">
                                {mod.title}
                              </h3>
                            </div>

                            {/* BEYAZ ALT YAZI ONUN ALTINDA */}
                            <p className="text-xs text-ink leading-relaxed mb-2">
                              {mod.subtitle}
                            </p>
                          </div>

                          {/* FOOTER: BADGE VE STAT SOLDA (İNCE YAZI), ÖFFNEN SAĞDA (İNCE YAZI) */}
                          <div className="mt-3 pt-2.5 border-t border-line-soft card-footer-action flex items-center justify-between text-xs font-normal text-ink-soft">
                            <div className="flex items-center gap-2 flex-wrap">
                              {mod.badge && (
                                <span
                                  className="text-xs font-normal text-white flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30"
                                >
                                  <span className="w-2 h-2 rounded-full bg-[#10b981] inline-block animate-pulse shrink-0"></span>
                                  <span>{mod.badge}</span>
                                </span>
                              )}
                              {mod.stat && (
                                <span className="text-[11px] font-normal text-ink-soft">
                                  {mod.stat}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-ink-soft transition shrink-0 ml-2 animate-pulse">
                              <span className="font-normal">{lang === 'tr' ? 'Aç' : 'Öffnen'}</span>
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
        <div className="bg-surface rounded-3xl border border-line p-6 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-black text-ink uppercase tracking-wider">
              {lang === 'tr' ? 'Görev & İşlemlerim' : 'Meine Aufgaben & Schnellzugriff'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {employeeModules.map((mod) => {
              const Icon = mod.icon;
              return (
                <div
                  key={mod.id + mod.title}
                  onClick={() => onNavigate(mod.id)}
                  className={`p-4 rounded-2xl border cursor-pointer flex flex-col justify-between ${mod.cardBg} card-inner group transition-all duration-200 hover:-translate-y-1 hover:border-white hover:shadow-lg hover:shadow-black/30 active:scale-98`}
                >
                  <div>
                    {/* İKON VE TURUNCU BAŞLIK YAN YANA */}
                    <div className="flex items-center gap-3 mb-2.5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${mod.iconBg} shrink-0 transition-transform duration-200 group-hover:scale-110`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className={`text-base font-black ${mod.textColor} tracking-tight leading-snug`}>
                        {mod.title}
                      </h3>
                    </div>

                    {/* BEYAZ ALT YAZI ONUN ALTINDA */}
                    <p className="text-xs text-ink-soft leading-relaxed mb-2">
                      {mod.subtitle}
                    </p>
                  </div>

                  {/* FOOTER: BADGE VE STAT SOLDA (İNCE YAZI), ÖFFNEN SAĞDA (İNCE YAZI) */}
                  <div className="mt-3 pt-2.5 border-t border-line-soft card-footer-action flex items-center justify-between text-xs font-normal text-ink-soft">
                    <div className="flex items-center gap-2 flex-wrap">
                      {mod.badge && (
                        <span
                          className="text-xs font-normal text-white flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30"
                        >
                          <span className="w-2 h-2 rounded-full bg-[#10b981] inline-block animate-pulse shrink-0"></span>
                          <span>{mod.badge}</span>
                        </span>
                      )}
                      {mod.stat && (
                        <span className="text-[11px] font-normal text-ink-soft">
                          {mod.stat}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-ink-soft transition shrink-0 ml-2 animate-pulse">
                      <span className="font-normal">{lang === 'tr' ? 'Aç' : 'Öffnen'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showChefModal && (
        <PersonalakteModal
          employee={currentUser}
          currentUser={currentUser}
          lang={lang}
          onClose={() => setShowChefModal(false)}
          onSave={(updated) => {
            StorageService.saveEmployee(updated);
            StorageService.setCurrentUser(updated);
            setShowChefModal(false);
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

