import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  User,
  FileText,
  ShieldCheck,
  Building,
  DollarSign,
  Phone,
  Mail,
  KeyRound,
  Calendar,
  Clock,
  CheckCircle2,
  Download,
  Eye,
  Edit3,
  Save,
  Printer,
  FileCheck,
  AlertCircle,
  Sparkles,
  Fingerprint,
  Camera,
  Home,
  ChevronDown,
  ArrowLeft,
  HeartHandshake,
  Award,
  Lock,
  Palmtree,
  HeartPulse,
  ReceiptText,
  Coins,
  ChevronRight,
  TrendingUp,
  Briefcase,
  Layers,
  Check,
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { StorageService } from '../../services/storage';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const PersonalakteModal = ({
  employee: initialEmployee,
  currentUser,
  onClose,
  onSave,
  onSwitchUser,
  lang = 'de'
}) => {
  if (!initialEmployee) return null;

  const activeUser = currentUser || StorageService.getCurrentUser();
  const isAdmin = activeUser?.role === 'admin';

  const allEmployees = StorageService.getEmployees();
  const [currentEmployeeId, setCurrentEmployeeId] = useState(initialEmployee.id);
  const employee = allEmployees.find(e => e.id === currentEmployeeId) || initialEmployee;

  const [activeTab, setActiveTab] = useState('360');
  const [isEditing, setIsEditing] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [currentAvatar, setCurrentAvatar] = useState(employee.avatar);

  useEffect(() => {
    setCurrentAvatar(employee.avatar);
  }, [employee.avatar, employee.id]);

  const handleAvatarChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const targetSize = 120; // 120x120 px - ultra light (~5-8 KB) & crisp thumbnail
        canvas.width = targetSize;
        canvas.height = targetSize;
        const ctx = canvas.getContext('2d');

        const minDim = Math.min(img.width, img.height);
        const startX = (img.width - minDim) / 2;
        const startY = (img.height - minDim) / 2;

        ctx.drawImage(img, startX, startY, minDim, minDim, 0, 0, targetSize, targetSize);
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.65);

        setCurrentAvatar(compressedBase64);
        const updated = { ...employee, avatar: compressedBase64 };
        StorageService.saveEmployee(updated);
        if (currentUser?.id === employee.id) {
          StorageService.setCurrentUser(updated);
        }
        if (onSave) onSave(updated);
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const scrollContainerRef = useRef(null);

  // Sekme değiştiğinde kaydırma çubuğunu en başa (veya aşağıya) al
  useEffect(() => {
    if (scrollContainerRef.current) {
      // KPI banner'ının yüksekliği kadar aşağı kaydır ki içerik hemen odaklansın
      // Mobilde 4-KPI banner çok yer kapladığı için sekme değiştiğinde onu gizlemek güzel bir UX.
      const isMobile = window.innerWidth < 640;
      scrollContainerRef.current.scrollTop = isMobile ? 180 : 0; 
    }
  }, [activeTab]);

  const timeLogs = StorageService.getTimeLogs();
  const shifts = StorageService.getShifts();
  const sickReports = StorageService.getSickReports();
  const leaveRequests = StorageService.getLeaveRequests();

  const todayStr = new Date().toISOString().split('T')[0];

  const empLogs = timeLogs.filter(l => l.employeeId === employee.id);
  const empShifts = shifts.filter(s => s.employeeId === employee.id);
  const empSick = sickReports.filter(r => r.employeeId === employee.id);
  const empLeave = leaveRequests.filter(r => r.employeeId === employee.id);

  const isCurrentlyWorking = empLogs.some(l => l.date === todayStr && !l.clockOut);
  const todaysLog = empLogs.find(l => l.date === todayStr);

  let totalWorkedMinutes = 0;
  empLogs.forEach(l => {
    if (l.clockIn && l.clockOut) {
      const [hIn, mIn] = l.clockIn.split(':').map(Number);
      const [hOut, mOut] = l.clockOut.split(':').map(Number);
      let diff = (hOut * 60 + mOut) - (hIn * 60 + mIn);
      if (diff < 0) diff += 24 * 60;
      const net = Math.max(0, diff - (l.breakMinutes || 0));
      totalWorkedMinutes += net;
    }
  });

  const calculatedHours = +(totalWorkedMinutes / 60).toFixed(1);
  const pensumPercent = employee.contractType?.includes('80%')
    ? 80
    : employee.contractType?.includes('60%')
    ? 60
    : employee.contractType?.includes('50%')
    ? 50
    : 100;

  const targetMonthlyHours = Math.round(182 * (pensumPercent / 100));
  const weeklyHours = ((42 * pensumPercent) / 100).toFixed(1);
  
  const effectiveHours = calculatedHours;
  const overtime = calculatedHours > 0 ? +(calculatedHours - targetMonthlyHours).toFixed(1) : 0;

  const hourlyRate = employee.hourlyRate || 30.0;
  const grossMonthlySalary = +(effectiveHours * hourlyRate).toFixed(2);
  const ahvDeduction = +(grossMonthlySalary * 0.053).toFixed(2);
  const alvDeduction = +(grossMonthlySalary * 0.011).toFixed(2);
  const bvgDeduction = +(grossMonthlySalary * 0.038).toFixed(2);
  const uvgKtgDeduction = +(grossMonthlySalary * 0.0158).toFixed(2);
  const totalDeductions = +(ahvDeduction + alvDeduction + bvgDeduction + uvgKtgDeduction).toFixed(2);
  const netMonthlySalary = +(grossMonthlySalary - totalDeductions).toFixed(2);
  
  const thirteentMonthAccrual = +(grossMonthlySalary * 0.0833).toFixed(2);
  const annualGrossEstimate = +(grossMonthlySalary * 12 + grossMonthlySalary * 12 * 0.0833).toFixed(2);
  const annualNetPaidEstimate = +(netMonthlySalary * 9).toFixed(2);

  useEffect(() => {
    // Modal açıldığında arkadaki sayfanın kaymasını (scroll) engelle
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const vacationTotal = employee.vacationTotal || 25;
  const vacationUsed = employee.vacationUsed || 0;
  const vacationRemaining = Math.max(0, vacationTotal - vacationUsed);

  const SWISS_BANKS = [
    'UBS Switzerland AG',
    'Zürcher Kantonalbank (ZKB)',
    'Credit Suisse (Schweiz) AG',
    'Raiffeisen Schweiz',
    'PostFinance AG',
    'Migros Bank AG',
    'Banque Cantonale Vaudoise (BCV)',
    'Valiant Bank AG',
    'Basler Kantonalbank (BKB)',
    'Berner Kantonalbank (BEKB)',
    'St.Galler Kantonalbank (SGKB)',
    'Luzerner Kantonalbank (LUKB)',
    'Aargauische Kantonalbank (AKB)',
    'Bank Cler',
    'Andere Bank / Yabancı Banka'
  ];

  const [formData, setFormData] = useState({
    name: employee.name || '',
    jobTitle: employee.jobTitle || '',
    department: employee.department || 'kuche',
    hourlyRate: employee.hourlyRate || 30.0,
    email: employee.email || '',
    password: employee.password || '1234',
    pin: employee.pin || '1001',
    phone: employee.phone || '+41 79 000 00 00',
    ahv: employee.ahv || '756.0000.0000.00',
    contractType: employee.contractType || 'Festanstellung 100%',
    vacationTotal: employee.vacationTotal || 25,
    vacationUsed: employee.vacationUsed || 0,
    joinedDate: employee.joinedDate || new Date().toISOString().split('T')[0],
    address: employee.address || '',
    birthDate: employee.birthDate || '',
    nationality: employee.nationality || (employee.role === 'admin' ? 'Schweiz (ZH)' : 'Türkei / Ausweis C'),
    emergencyContact: employee.emergencyContact || 'Leyla Yılmaz (Ehepartnerin) - +41 79 444 55 66',
    iban: employee.iban || '',
    bankName: employee.bankName || 'UBS Switzerland AG'
  });

  const handleSave = (e) => {
    e.preventDefault();
    const updated = {
      ...employee,
      ...formData,
      hourlyRate: parseFloat(formData.hourlyRate) || 0,
      vacationTotal: parseInt(formData.vacationTotal, 10) || 25,
      vacationUsed: parseInt(formData.vacationUsed, 10) || 0
    };
    onSave(updated);
    setIsEditing(false);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const handleDeactivate = (e) => {
    e.preventDefault();
    if (window.confirm(lang === 'tr' ? 'Bu personeli işten çıkarmak/pasife almak istediğinize emin misiniz? (Geçmiş verileri saklanacak ancak sisteme girişi kapatılacaktır)' : 'Mitarbeiter wirklich deaktivieren? (Zugang wird gesperrt)')) {
      const updated = {
        ...employee,
        status: 'inactive',
        aktiv: false,
        austrittsdatum: new Date().toISOString().split('T')[0]
      };
      onSave(updated);
    }
  };

  const documents = [
    {
      id: 'doc-contract',
      title: lang === 'tr' ? 'İş Sözleşmesi (L-GAV Gastgewerbe 2025)' : 'Arbeitsvertrag (L-GAV Gastgewerbe 2025)',
      type: 'PDF',
      date: formData.joinedDate,
      status: 'Gültig & Digital Signiert',
      fileSize: '428 KB',
      description: lang === 'tr' ? 'Resmi İsviçre gastronomi toplu iş sözleşmesi' : 'Offizieller Schweizer Gesamt-Arbeitsvertrag Gastgewerbe'
    },
    {
      id: 'doc-id',
      title: lang === 'tr' ? 'Kimlik / Çalışma İzni (Aufenthaltsbewilligung)' : 'Ausweiskopie & Aufenthaltsstatus',
      type: 'PDF',
      date: '2023-01-10',
      status: 'Geprüft (Kantonales Migrationsamt ZH)',
      fileSize: '1.2 MB',
      description: formData.nationality
    },
    {
      id: 'doc-haccp',
      title: lang === 'tr' ? 'HACCP Hijyen & Gıda Güvenliği Belgesi' : 'HACCP-Hygienezertifikat & LMG-Schulung',
      type: 'PDF',
      date: '2024-02-15',
      status: 'Konform (HyV Art. 51)',
      fileSize: '310 KB',
      description: lang === 'tr' ? 'Kanton gıda denetimlerine uygun geçerli sertifika' : 'Gültiger Nachweis für Lebensmittelkontrolle'
    },
    {
      id: 'doc-bank',
      title: lang === 'tr' ? 'Banka Maaş Hesabı & IBAN Teyidi' : 'Bankverbindung & Lohnauszahlung (ZKB)',
      type: 'PDF',
      date: '2023-01-05',
      status: 'Verifiziert',
      fileSize: '185 KB',
      description: formData.iban
    }
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex justify-start bg-black/70 backdrop-blur-xs modal-backdrop"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl sm:max-w-3xl lg:max-w-4xl h-full bg-surface border-r border-line flex flex-col overflow-hidden text-ink shadow-2xl drawer-left-container pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header Card */}
        <div className="p-5 sm:p-6 bg-surface text-ink flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-line">
          <div className="flex items-center gap-4">
            <div className="relative group cursor-pointer" title={lang === 'tr' ? 'Fotoğraf Yükle / Değiştir' : 'Foto hochladen / ändern'}>
              <img
                src={currentAvatar || employee.avatar}
                alt={employee.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover ring-2 ring-brand/40 group-hover:brightness-90 transition"
              />
              <label className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center text-white text-[10px] font-bold cursor-pointer">
                <Camera className="w-5 h-5 mb-0.5" />
                <span>{lang === 'tr' ? 'Foto Seç' : 'Foto wählen'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-[10px] font-normal uppercase tracking-wider px-2.5 py-0.5 rounded-md card-inner text-brand border border-brand/30">
                  {employee.role === 'admin' ? '👑 CHEF / INHABER' : 'MITARBEITER / HR'}
                </span>
                <span className="text-[10px] font-mono font-normal text-ink-muted px-2 py-0.5 rounded-md card-inner border border-line">
                  ID: #{employee.id.slice(0, 8).toUpperCase()}
                </span>
                {/* Live working badge */}
                <span className={`text-[10px] font-normal px-2.5 py-0.5 rounded-md flex items-center gap-1.5 ${
                  isCurrentlyWorking 
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/40' 
                    : 'card-inner text-ink-muted border border-line'
                }`}>
                  {isCurrentlyWorking ? (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-ink-muted"></span>
                  )}
                  <span>{isCurrentlyWorking ? (lang === 'tr' ? 'ŞU AN GÖREVDE' : 'IM DIENST') : (lang === 'tr' ? 'SERBEST / ÇIKTI' : 'FEIERABEND')}</span>
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-normal tracking-tight text-ink flex items-center gap-2">
                <span>{formData.name}</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-md card-inner text-brand border border-brand/30 font-normal">
                  PIN: {formData.pin}
                </span>
              </h2>

              <p className="text-xs sm:text-sm text-ink font-normal mt-1 flex items-center gap-2">
                <span>
                  {formData.jobTitle ? (formData.jobTitle.charAt(0).toUpperCase() + formData.jobTitle.slice(1)) : 'Mitarbeiter'}
                </span>
                <span className="text-ink-muted">•</span>
                <span className="font-normal uppercase" style={{ color: 'var(--brand)' }}>
                  {(formData.department || 'staff').toUpperCase()}
                </span>
                <span className="text-ink-muted">•</span>
                <span className="font-mono text-emerald-400 font-normal">
                  {formatCurrency(formData.hourlyRate || 30)}/h
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
            {/* Quick Switch Employee Dropdown right in the modal (Admin Only) */}
            {isAdmin && (
              <select
                value={employee?.id || ''}
                onChange={(e) => {
                  const newId = e.target.value;
                  setCurrentEmployeeId(newId);
                  const emp = allEmployees.find(m => m.id === newId);
                  if (emp) {
                    setFormData({
                      name: emp.name || '',
                      jobTitle: emp.jobTitle || 'Mitarbeiter',
                      department: emp.department || 'staff',
                      hourlyRate: emp.hourlyRate || 30.0,
                      email: emp.email || '',
                      password: emp.password || '1234',
                      role: emp.role || 'staff',
                      pin: emp.pin || '1001',
                      phone: emp.phone || '',
                      ahv: emp.ahv || ''
                    });
                  }
                }}
                className="pl-3 pr-8 py-2 rounded-md card-inner text-ink text-xs font-bold border border-line focus:outline-none focus:border-brand cursor-pointer"
              >
                {allEmployees.map(e => (
                  <option key={e.id} value={e.id}>
                    {e.role === 'admin' ? '👑 ' : '👤 '} {e.name}
                  </option>
                ))}
              </select>
            )}

            {/* Quick Switch User (Admin Only) */}
            {isAdmin && onSwitchUser && (
              <button
                onClick={() => {
                  onSwitchUser(employee);
                  onClose();
                }}
                className="px-3.5 py-2 rounded-md card-inner text-ink text-xs font-bold transition flex items-center gap-1.5 border border-line hover:border-brand cursor-pointer"
                title="Bu personelin ekranına geç"
              >
                <Fingerprint className="w-3.5 h-3.5 shrink-0" />
                <span>{lang === 'tr' ? 'Bu Hesaba Geç' : 'Einloggen'}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-md card-inner text-ink transition border border-line hover:border-brand cursor-pointer"
              title="Schliessen"
            >
              <X className="w-4 h-4 shrink-0" />
            </button>
          </div>
        </div>



        {/* Tab Navigation Strip (Mobile Dropdown + Desktop Tabs) */}
        <div className="px-4 py-2 sm:py-2.5 sm:px-6 bg-ground border-b border-line">
          {/* Mobile Dropdown */}
          <div className="block sm:hidden relative w-full">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="w-full pl-3.5 pr-11 py-2 rounded-md card-inner text-ink text-xs font-bold border border-line focus:outline-none focus:border-brand appearance-none cursor-pointer tracking-wide"
            >
              <option value="360">{lang === 'tr' ? '⭐ 360° Sicil Özeti' : '⭐ 360° Chef-Übersicht'}</option>
              <option value="zeiterfassung">{lang === 'tr' ? 'Saatler & Stempeluhr' : 'Stempeluhr & Stunden'}</option>
              <option value="schichten">{lang === 'tr' ? 'Vardiya Planı' : 'Schichtplan'}</option>
              <option value="lohn">{lang === 'tr' ? 'Maaş, Bordro & Senelik' : 'Lohn & Abrechnung'}</option>
              <option value="absenzen">{lang === 'tr' ? 'Hastalık & İzin Geçmişi' : 'Urlaub & Absenzen'}</option>
              <option value="stammdaten">{lang === 'tr' ? 'Sözleşme, AHV & Evraklar' : 'Vertrag & Dokumente'}</option>
            </select>
            
            {/* Yanıp Sönen Turuncu Ok (Çizgisiz & Sade, pointer-events-none ile tüm alana dokunulabilir) */}
            <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center text-brand">
              <ChevronDown className="w-5 h-5 text-brand animate-pulse stroke-[2.5]" />
            </div>
          </div>

          {/* Desktop Tabs */}
          <div className="hidden sm:flex items-start gap-2 text-xs font-bold py-1">
            <button
              onClick={() => setActiveTab('360')}
              className={`px-3.5 py-2 rounded-md transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeTab === '360'
                  ? 'btn-brand font-black'
                  : 'card-inner text-ink border border-line'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>{lang === 'tr' ? '⭐ 360° Sicil Özeti' : '⭐ 360° Chef-Übersicht'}</span>
            </button>

            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setActiveTab('zeiterfassung')}
                  className={`px-3.5 py-2 rounded-md transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    activeTab === 'zeiterfassung'
                      ? 'btn-brand font-black'
                      : 'card-inner text-ink border border-line'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span>{lang === 'tr' ? 'Saatler & Stempeluhr' : 'Stempeluhr & Stunden'}</span>
                </button>

                <button
                  onClick={() => setActiveTab('schichten')}
                  className={`px-3.5 py-2 rounded-md transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    activeTab === 'schichten'
                      ? 'btn-brand font-black'
                      : 'card-inner text-ink border border-line'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>{lang === 'tr' ? 'Vardiya Planı' : 'Schichtplan'}</span>
                </button>

                <button
                  onClick={() => setActiveTab('lohn')}
                  className={`px-3.5 py-2 rounded-md transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    activeTab === 'lohn'
                      ? 'btn-brand font-black'
                      : 'card-inner text-ink border border-line'
                  }`}
                >
                  <DollarSign className="w-4 h-4" />
                  <span>{lang === 'tr' ? 'Maaş, Bordro & Senelik' : 'Lohn & Abrechnung'}</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setActiveTab('absenzen')}
                  className={`px-3.5 py-2 rounded-md transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    activeTab === 'absenzen'
                      ? 'btn-brand font-black'
                      : 'card-inner text-ink border border-line'
                  }`}
                >
                  <HeartPulse className="w-4 h-4" />
                  <span>{lang === 'tr' ? 'Hastalık & İzin Geçmişi' : 'Urlaub & Absenzen'}</span>
                </button>

                <button
                  onClick={() => setActiveTab('stammdaten')}
                  className={`px-3.5 py-2 rounded-md transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    activeTab === 'stammdaten'
                      ? 'btn-brand font-black'
                      : 'card-inner text-ink border border-line'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>{lang === 'tr' ? 'Sözleşme, AHV & Evraklar' : 'Vertrag & Dokumente'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Tab Content Body */}
        <div ref={scrollContainerRef} className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">

          {/* 4-KPI Executive Master Banner (Now inside scrollable area to save mobile space) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 p-3 sm:p-4 bg-ground rounded-2xl border border-line text-xs">
            
            {/* KPI 1: Worked Hours & Overtime */}
            <div className="p-2.5 sm:p-3 rounded-xl bg-surface border border-line flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl icon-box flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-ink font-normal block uppercase tracking-wider">
                  {lang === 'tr' ? 'Bu Ayki Mesai' : 'Arbeitszeit'}
                </span>
                <span className="font-mono font-normal text-sm text-ink block">
                  {effectiveHours} Std.
                </span>
                <span className={`block text-[10px] font-normal ${overtime === 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {overtime === 0 ? '0h Denk' : overtime > 0 ? `+${overtime}h Fazla` : `${overtime}h Eksik`} (Soll: <span className="text-emerald-400">{targetMonthlyHours}h</span>)
                </span>
              </div>
            </div>

            {/* KPI 2: Vacation Balance */}
            <div className="p-2.5 sm:p-3 rounded-xl bg-surface border border-line flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl icon-box flex items-center justify-center shrink-0">
                <Palmtree className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-ink font-normal block uppercase tracking-wider">
                  {lang === 'tr' ? 'Kalan İzin' : 'Resturlaub'}
                </span>
                <span className="font-mono font-normal text-sm text-brand block">
                  {vacationRemaining} {lang === 'tr' ? 'Gün' : 'Tage'}
                </span>
                <span className="block text-[10px] text-ink font-normal">
                  {vacationTotal} / {vacationUsed} {lang === 'tr' ? 'Kullanıldı' : 'bezogen'}
                </span>
              </div>
            </div>

            {/* KPI 3: Monthly Net Salary */}
            <div className="p-2.5 sm:p-3 rounded-xl bg-surface border border-line flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl icon-box flex items-center justify-center shrink-0">
                <DollarSign className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-ink font-normal block uppercase tracking-wider">
                  {lang === 'tr' ? 'Net Maaş' : 'Nettolohn'}
                </span>
                <span className="font-mono font-normal text-sm text-ink block">
                  {formatCurrency(netMonthlySalary)}
                </span>
                <span className="block text-[10px] text-ink font-normal">
                  {lang === 'tr' ? 'Bankaya Yatırıldı (ZKB)' : 'Ausbezahlt via ZKB'}
                </span>
              </div>
            </div>

            {/* KPI 4: Annual Indicator */}
            <div className="p-2.5 sm:p-3 rounded-xl bg-surface border border-line flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl icon-box flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-ink font-normal block uppercase tracking-wider">
                  {lang === 'tr' ? 'Yıllık Maaş' : 'Jahreslohn'}
                </span>
                <span className="font-mono font-normal text-sm text-ink block">
                  {formatCurrency(annualGrossEstimate)}
                </span>
                <span className="block text-[10px] text-ink font-normal">
                  {lang === 'tr' ? '13. Maaş Dahil • AHV✓' : 'Inkl. 13. Monatslohn • AHV✓'}
                </span>
              </div>
            </div>

          </div>

          {/* TAB 1: 360° CHEF-ÜBERSICHT (THE MASTER SNAPSHOT) */}
          {activeTab === '360' && (
            <div className="space-y-6">
              
              {/* Executive Summary Banner */}
              <div className="p-4 rounded-2xl bg-subtle text-ink border border-line flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-black text-ink flex items-center gap-2">
                    <Award className="w-5 h-5 text-brand" />
                    <span>{lang === 'tr' ? 'Personel 360° Sicil & Yönetici Karnesi' : 'Vollständiges Mitarbeiter-Dossier (Chef-Ansicht)'}</span>
                  </h3>
                  <p className="text-xs text-ink-soft mt-0.5">
                    {lang === 'tr'
                      ? 'Tüm modüllerden toplanan canlı veriler: Stempeluhr, vardiyalar, maaş dekontu, kalan izin ve resmi evraklar.'
                      : 'Alle Daten aus Zeiterfassung, Schichtplanung, Lohnabrechnung und Absenzen auf einen Blick.'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-brand-light text-brand font-bold text-xs border border-brand-border">
                    GAV Gastrosuisse Konform
                  </span>
                </div>
              </div>

              {/* 3-Pillars Side-by-Side Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* 1. Stempeluhr & Saatler Özeti */}
                <div className="p-4 rounded-2xl card-inner border border-line space-y-3">
                  <div className="flex items-center justify-between border-b border-line pb-2">
                    <span className="text-xs font-black uppercase text-ink flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-ink" />
                      {lang === 'tr' ? 'Çalışma Saatleri' : 'Zeiterfassung'}
                    </span>
                    <button 
                      onClick={() => setActiveTab('zeiterfassung')} 
                      className="text-[11px] font-bold text-ink"
                    >
                      {lang === 'tr' ? 'Detay →' : 'Details →'}
                    </button>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-ink-soft">{lang === 'tr' ? 'Hedef Saat (Soll):' : 'Sollstunden (Monat):'}</span>
                      <span className="font-mono font-bold text-emerald-400">{targetMonthlyHours} Std. / {lang === 'tr' ? 'Ay' : 'M'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink-soft">{lang === 'tr' ? 'Çalışılan (Ist):' : 'Geleistet (Ist):'}</span>
                      <span className="font-mono font-bold text-ink">{effectiveHours} Std.</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink-soft">{lang === 'tr' ? 'Saldo / Fazla-Eksik:' : 'Saldo / Überstunden:'}</span>
                      <span className={`font-mono font-black ${overtime === 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {overtime > 0 ? `+${overtime} Std.` : `${overtime} Std.`}
                      </span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-line text-[11px]">
                      <span className="text-ink-soft">{lang === 'tr' ? 'Bugünkü Durum:' : 'Heutiger Status:'}</span>
                      <span className="font-bold text-ink">
                        {isCurrentlyWorking ? (lang === 'tr' ? `Giriş: ${todaysLog?.clockIn || '08:00'}` : `Angestempelt: ${todaysLog?.clockIn || '08:00'}`) : (lang === 'tr' ? 'Şu an görevde değil' : 'Derzeit nicht im Dienst')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Maaş & Senelik Gösterge Özeti */}
                <div className="p-4 rounded-2xl card-inner border border-line space-y-3">
                  <div className="flex items-center justify-between border-b border-line pb-2">
                    <span className="text-xs font-black uppercase text-ink flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-ink" />
                      {lang === 'tr' ? 'Maaş & Bordro' : 'Lohnabrechnung'}
                    </span>
                    <button 
                      onClick={() => setActiveTab('lohn')} 
                      className="text-[11px] font-bold text-ink"
                    >
                      {lang === 'tr' ? 'Detay →' : 'Details →'}
                    </button>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-ink-soft">{lang === 'tr' ? 'Saatlik Brüt:' : 'Stundenlohn (Brutto):'}</span>
                      <span className="font-mono font-bold text-ink">{formatCurrency(hourlyRate)}/h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink-soft">{lang === 'tr' ? 'Aylık Brüt:' : 'Monatslohn (Brutto):'}</span>
                      <span className="font-mono font-bold text-ink">{formatCurrency(grossMonthlySalary)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink-soft">{lang === 'tr' ? 'Net Ele Geçen:' : 'Nettolohn (Auszahlung):'}</span>
                      <span className="font-mono font-black text-ink">{formatCurrency(netMonthlySalary)}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-line text-[11px]">
                      <span className="text-ink-soft">{lang === 'tr' ? 'Yıllık Brüt (13. dahil):' : 'Jahreslohn (inkl. 13.):'}</span>
                      <span className="font-mono font-bold text-ink">{formatCurrency(annualGrossEstimate)}</span>
                    </div>
                  </div>
                </div>

                {/* 3. İzin, Rapor & Vardiya Özeti */}
                <div className="p-4 rounded-2xl card-inner border border-line space-y-3">
                  <div className="flex items-center justify-between border-b border-line pb-2">
                    <span className="text-xs font-black uppercase text-brand flex items-center gap-1.5">
                      <Palmtree className="w-4 h-4 text-brand" />
                      {lang === 'tr' ? 'İzin & Devamsızlık' : 'Urlaub & Absenzen'}
                    </span>
                    <button 
                      onClick={() => setActiveTab('absenzen')} 
                      className="text-[11px] font-bold text-brand"
                    >
                      {lang === 'tr' ? 'Detay →' : 'Details →'}
                    </button>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-ink-soft">{lang === 'tr' ? 'Kalan İzin:' : 'Resturlaub:'}</span>
                      <span className="font-mono font-black text-brand">{vacationRemaining} {lang === 'tr' ? 'Gün' : 'Tage'} ({vacationRemaining / 5} {lang === 'tr' ? 'Hafta' : 'Wochen'})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink-soft">{lang === 'tr' ? 'Kullanılan İzin:' : 'Bezogener Urlaub:'}</span>
                      <span className="font-mono text-ink-soft">{vacationUsed} {lang === 'tr' ? 'Gün' : 'Tage'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink-soft">{lang === 'tr' ? 'Hastalık Raporu:' : 'Krankmeldungen:'}</span>
                      <span className="font-bold text-ink">{empSick.length} {lang === 'tr' ? 'Bildirim (Attest ✓)' : 'Meldungen (Attest ✓)'}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-line text-[11px]">
                      <span className="text-ink-soft">{lang === 'tr' ? 'Haftalık Vardiya:' : 'Schichten (Woche):'}</span>
                      <span className="font-bold text-ink">
                        {empShifts.length > 0 ? `${empShifts.length} ${lang === 'tr' ? 'Vardiya Görevli' : 'Schichten'}` : (lang === 'tr' ? 'Vardiya Yok' : 'Keine Schichten')}
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Official Status Verification Seal */}
              <div className="p-4 rounded-2xl card-inner border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl card-inner text-ink flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-ink">
                      {lang === 'tr' ? 'İsviçre Resmi Kayıt & SGK Durumu (AHV/ALV/BVG)' : 'Amtlicher Status & Ausgleichskassen'}
                    </h4>
                    <p className="text-xs text-ink-soft">
                      AHV-Nr: <span className="font-mono text-ink-soft font-bold">{formData.ahv}</span> • 
                      GastroSocial Pensionskasse • SUVA Unfallversicherung • Visana KTG
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="badge badge-emerald font-bold text-xs py-1 px-3 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{lang === 'tr' ? 'Tüm Primler Yatırıldı' : 'Beiträge aktuell'}</span>
                  </span>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: ZEITERFASSUNG & STEMPELUHR */}
          {activeTab === 'zeiterfassung' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-ink">
                    {lang === 'tr' ? 'Giriş-Çıkış Kayıtları & Çalışma Saatleri' : 'Stempeluhr-Protokoll & Arbeitszeiten'}
                  </h3>
                  <p className="text-xs text-ink-soft">
                    {lang === 'tr' ? 'Tablet terminalinden ve sistemden kaydedilen canlı saat hareketleri.' : 'Präzise Zeiterfassungsdaten und Pausenprotokolle.'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-black text-base text-ink">{effectiveHours} Std. Total</span>
                  <span className="block text-[11px] text-ink-soft">Soll: {targetMonthlyHours} Std.</span>
                </div>
              </div>

              {/* Time Logs Table */}
              <div className="border border-line rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-subtle text-ink-soft font-bold border-b border-line">
                    <tr>
                      <th className="p-3">Datum (Tarih)</th>
                      <th className="p-3">Kommen (Giriş)</th>
                      <th className="p-3">Gehen (Çıkış)</th>
                      <th className="p-3">Pause (Mola)</th>
                      <th className="p-3">Netto Zeit</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line font-mono">
                    {empLogs.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="p-4 text-center text-ink-muted font-sans">
                          {lang === 'tr' ? 'Bu çalışan için henüz canlı log oluşmadı. Standart 42h sözleşme mesaisi baz alınıyor.' : 'Noch keine Stempelungen erfasst. Basis-Vollzeit hinterlegt.'}
                        </td>
                      </tr>
                    ) : (
                      empLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-subtle/50 transition">
                          <td className="p-3 font-sans font-bold text-ink">{log.date}</td>
                          <td className="p-3 text-ink font-bold">{log.clockIn}</td>
                          <td className="p-3 text-ink-soft">{log.clockOut || '● İŞTE'}</td>
                          <td className="p-3 text-ink-soft">{log.breakMinutes || 0} Min</td>
                          <td className="p-3 font-bold text-ink">
                            {log.clockOut ? '8.0 Std.' : 'Açık'}
                          </td>
                          <td className="p-3 font-sans">
                            <span className={`badge ${
                              log.clockOut ? 'badge-emerald' : 'badge-sky'
                            } text-[10px] font-bold py-0.5 px-2`}>
                              {log.clockOut ? 'Abgeschlossen' : 'Im Dienst'}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: SCHICHTPLAN & EINSÄTZE */}
          {activeTab === 'schichten' && (() => {
            const today = new Date();
            const currentDay = today.getDay();
            const diff = today.getDate() - currentDay + (currentDay === 0 ? -6 : 1);
            const monday = new Date(today.setDate(diff));

            const dayNamesDe = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
            const dayNamesTr = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];

            const modalWeekDays = [];
            for (let i = 0; i < 7; i++) {
              const d = new Date(monday);
              d.setDate(monday.getDate() + i);
              const dateStr = d.toISOString().split('T')[0];
              modalWeekDays.push({
                dateStr,
                dayName: lang === 'tr' ? dayNamesTr[i] : dayNamesDe[i],
                formattedDate: `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}`
              });
            }

            return (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-ink">
                      {lang === 'tr' ? 'Vardiya Çizelgesi & Çalışma Günleri' : 'Dienstplan & Schichtübersicht'}
                    </h3>
                    <p className="text-xs text-ink-soft">
                      {lang === 'tr' ? 'Bu haftaki çalışma vardiyaları ve görev durumları.' : 'Einsatzplanung für die aktuelle Woche.'}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    empShifts.length > 0 ? 'bg-brand-light text-brand border border-brand-border' : 'card-inner text-ink-muted'
                  }`}>
                    {empShifts.length} {lang === 'tr' ? 'Vardiya Planlandı' : 'Schichten geplant'}
                  </span>
                </div>

                {empShifts.length === 0 && (
                  <div className="p-4 rounded-2xl card-inner border border-line text-center space-y-1">
                    <p className="text-xs font-bold text-ink">
                      {lang === 'tr' ? 'Bu personel için sistemde kayıtlı aktif vardiya bulunmamaktadır.' : 'Keine Schichten für diese Woche im System erfasst.'}
                    </p>
                    <p className="text-[11px] text-ink-soft">
                      {lang === 'tr' ? 'Tüm günler serbest (Ruhetag) olarak görüntülenmektedir.' : 'Alle Tage sind als wöchentlicher Ruhetag markiert.'}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {modalWeekDays.map((wDay) => {
                    const shift = empShifts.find(s => s.date === wDay.dateStr);
                    const isOff = !shift;

                    let shiftLabel = 'Ruhetag';
                    let shiftTime = 'Frei';
                    let shiftBadgeClass = 'card-inner text-ink-muted';

                    if (shift) {
                      if (shift.shiftType === 'frueh') {
                        shiftLabel = lang === 'tr' ? 'Sabah Vardiyası' : 'Frühschicht';
                        shiftTime = '08:00 – 16:30';
                        shiftBadgeClass = 'badge badge-brand';
                      } else if (shift.shiftType === 'spaet') {
                        shiftLabel = lang === 'tr' ? 'Akşam Vardiyası' : 'Spätschicht';
                        shiftTime = '16:00 – 00:30';
                        shiftBadgeClass = 'badge badge-sky';
                      } else if (shift.shiftType === 'ganztag') {
                        shiftLabel = lang === 'tr' ? 'Bölünmüş Vardiya' : 'Ganztag (Zimmerstunde)';
                        shiftTime = '10:00 – 22:30';
                        shiftBadgeClass = 'badge badge-purple';
                      } else {
                        shiftLabel = shift.shiftType || 'Schicht';
                        shiftTime = shift.startTime && shift.endTime ? `${shift.startTime} – ${shift.endTime}` : '08:00 – 16:30';
                        shiftBadgeClass = 'badge badge-brand';
                      }
                    }

                    return (
                      <div 
                        key={wDay.dateStr} 
                        className={`p-3.5 rounded-2xl border ${
                          isOff 
                            ? 'card-inner border-line opacity-75' 
                            : 'card-inner border-brand/40 bg-surface'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-bold text-xs text-ink flex items-center gap-1.5">
                            <span>{wDay.dayName}</span>
                            <span className="text-[10px] text-ink-muted font-mono">({wDay.formattedDate})</span>
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${shiftBadgeClass}`}>
                            {shiftLabel}
                          </span>
                        </div>
                        <p className="font-mono text-xs font-black text-ink">
                          {shiftTime}
                        </p>
                        <p className="text-[11px] text-ink-soft mt-0.5">
                          {isOff 
                            ? (lang === 'tr' ? 'Haftalık İzin Günü' : 'Wöchentlicher Ruhetag') 
                            : `${lang === 'tr' ? 'Departman' : 'Abteilung'}: ${(shift.department || formData.department).toUpperCase()}`}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* TAB 4: LOHN, ABRECHNUNG & JAHRESGÖSTERGE */}
          {activeTab === 'lohn' && (
            <div className="space-y-5">
              
              {/* Top Monthly vs Annual Indicator Banner */}
              <div className="p-4 rounded-2xl bg-dark border border-line flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-black text-ink flex items-center gap-2">
                    <ReceiptText className="w-5 h-5 text-ink" />
                    <span>{lang === 'tr' ? 'Maaş Bordrosu & Yıllık Gösterge (GAV Gastrosuisse)' : 'Lohnabrechnung & Jahresausweis (L-GAV)'}</span>
                  </h3>
                  <p className="text-xs text-ink mt-0.5">
                    İsviçre Comatic ve Treuhand formatında net ele geçen, 13. maaş ve resmi sosyal kesintiler.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-ink-soft block uppercase font-bold">Lohn-Status:</span>
                  <span className="px-3 py-1 rounded-full bg-subtle text-white font-black text-xs inline-flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>{lang === 'tr' ? 'Eylül 2026: ÖDENDİ' : 'Sept 2026: Überwiesen'}</span>
                  </span>
                </div>
              </div>

              {/* Monthly Paycheck Breakdown Table */}
              <div className="p-4 rounded-2xl card-inner border border-line space-y-3">
                <h4 className="text-xs font-black uppercase text-ink-soft tracking-wider">
                  {lang === 'tr' ? 'Aylık Bordro Hesabı (Monatsabrechnung)' : 'Detaillierte Monatsberechnung:'}
                </h4>

                <div className="space-y-2 text-xs divide-y divide-line">
                  <div className="flex justify-between py-1.5">
                    <span className="text-ink-soft">Basis-Stundenlohn:</span>
                    <span className="font-mono font-bold text-ink">{formatCurrency(hourlyRate)}/h</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-ink-soft">Abrechnungs-Stunden ({effectiveHours} Std.):</span>
                    <span className="font-mono font-bold text-ink">{formatCurrency(grossMonthlySalary)}</span>
                  </div>
                  <div className="flex justify-between py-1.5 text-brand">
                    <span>AHV / IV / EO (%5.30):</span>
                    <span className="font-mono font-bold">-{formatCurrency(ahvDeduction)}</span>
                  </div>
                  <div className="flex justify-between py-1.5 text-brand">
                    <span>ALV Arbeitslosenversicherung (%1.10):</span>
                    <span className="font-mono font-bold">-{formatCurrency(alvDeduction)}</span>
                  </div>
                  <div className="flex justify-between py-1.5 text-brand">
                    <span>BVG Pensionskasse GastroSocial (~%3.80):</span>
                    <span className="font-mono font-bold">-{formatCurrency(bvgDeduction)}</span>
                  </div>
                  <div className="flex justify-between py-1.5 text-brand">
                    <span>UVG (NBU 0.85%) & KTG Krankentaggeld (0.73%):</span>
                    <span className="font-mono font-bold">-{formatCurrency(uvgKtgDeduction)}</span>
                  </div>
                  <div className="flex justify-between py-2 pt-3 border-t-2 border-line font-bold text-sm card-inner px-3 rounded-xl">
                    <span className="text-ink font-black">Nettolohn (Ele Geçen Net Maaş):</span>
                    <span className="font-mono font-black text-ink text-base">{formatCurrency(netMonthlySalary)}</span>
                  </div>
                </div>
              </div>

              {/* Annual Indicator & Accumulation Box */}
              <div className="p-4 rounded-2xl card-inner border border-line space-y-3">
                <h4 className="text-xs font-black uppercase text-ink-soft tracking-wider flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-ink" />
                  <span>{lang === 'tr' ? 'Senelik Gösterge & Yıllık Toplamlar (Jahresausweis)' : 'Jahreslohn & Kumulierte Werte 2026'}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl card-inner border border-line">
                    <span className="text-ink-soft block">Yıl İçi Ödenen Net (Jan-Sep):</span>
                    <span className="text-base font-mono font-black text-ink mt-1 block">
                      {formatCurrency(annualNetPaidEstimate)}
                    </span>
                    <span className="text-[10px] text-ink font-bold">✓ 9 Ay Tam Ödendi</span>
                  </div>

                  <div className="p-3 rounded-xl card-inner border border-line">
                    <span className="text-ink-soft block">13. Maaş Birikimi (%8.33):</span>
                    <span className="text-base font-mono font-black text-ink mt-1 block">
                      {formatCurrency(thirteentMonthAccrual * 9)}
                    </span>
                    <span className="text-[10px] text-ink-soft">Aralık ayında ödenecek</span>
                  </div>

                  <div className="p-3 rounded-xl card-inner border border-line">
                    <span className="text-ink-soft block">Yıllık Tahmini Brüt (Jahreslohn):</span>
                    <span className="text-base font-mono font-black text-ink mt-1 block">
                      {formatCurrency(annualGrossEstimate)}
                    </span>
                    <span className="text-[10px] text-ink-soft">Comatic Treuhand hazır</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl card-inner border border-line flex items-center justify-between text-xs">
                  <div>
                    <span className="text-ink-soft">Banka & IBAN Hesabı:</span>
                    <p className="font-mono font-bold text-ink">{formData.iban}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-subtle text-ink-soft font-bold text-[11px]">
                    {formData.bankName}
                  </span>
                </div>
              </div>

            </div>
          )}

          {/* TAB 5: URLAUB & ABSENZEN (HASTALIK & İZİN) */}
          {activeTab === 'absenzen' && (
            <div className="space-y-5">
              
              {/* Vacation Balance Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl card-inner border border-line">
                  <span className="text-[11px] font-bold text-brand uppercase">Yıllık İzin Hakkı (Total):</span>
                  <p className="text-2xl font-mono font-black text-brand mt-1">{vacationTotal} Gün</p>
                  <p className="text-[11px] text-ink-soft mt-0.5">{vacationTotal / 5} Hafta Tatil</p>
                </div>

                <div className="p-4 rounded-2xl card-inner border border-line">
                  <span className="text-[11px] font-bold text-ink-soft uppercase">Kullanılan İzin (Bezogen):</span>
                  <p className="text-2xl font-mono font-black text-ink mt-1">{vacationUsed} Gün</p>
                  <p className="text-[11px] text-ink-soft mt-0.5">Onaylı İzinler</p>
                </div>

                <div className="p-4 rounded-2xl card-inner border border-line">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase">Kalan Tatil (Resturlaub):</span>
                  <p className="text-2xl font-mono font-black text-emerald-400 mt-1">{vacationRemaining} Gün</p>
                  <p className="text-[11px] text-ink-soft font-semibold mt-0.5">Kullanılabilir Bakiye</p>
                </div>
              </div>

              {/* Sick Leave & Attest History */}
              <div className="p-4 rounded-2xl card-inner border border-line space-y-3">
                <h4 className="text-xs font-black uppercase text-ink-soft tracking-wider flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-brand" />
                  <span>{lang === 'tr' ? 'Hastalık Bildirimleri & Doktor Raporları (Attest)' : 'Krankmeldungen & Arztzeugnisse:'}</span>
                </h4>

                {empSick.length === 0 ? (
                  <div className="p-4 rounded-xl card-inner border border-line text-xs text-ink flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-ink" />
                    <span>{lang === 'tr' ? 'Bu çalışanın kayıtlı bir hastalık veya devamsızlık raporu bulunmamaktadır (Sicil Temiz).' : 'Keine Krankmeldungen vorhanden. 100% Anwesenheit.'}</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {empSick.map((r) => (
                      <div key={r.id} className="p-3 rounded-xl card-inner border border-line flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-ink">{r.reason || 'Grippaler Infekt'}</p>
                          <p className="text-[11px] text-ink-soft">{r.startDate} bis {r.endDate || r.startDate}</p>
                        </div>
                        <span className="badge badge-rose text-[10px] font-bold py-0.5 px-2">
                          Attest hinterlegt
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 6: STAMMDATEN, VERTRAG & DOKUMENTE */}
          {activeTab === 'stammdaten' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-ink">
                    {lang === 'tr' ? 'Sözleşme, AHV, Şifre & Resmi Belgeler' : 'Vertrag, AHV & Dokumentenablage'}
                  </h3>
                  <p className="text-xs text-ink-soft">
                    {lang === 'tr' ? 'Resmi kimlik, PIN kodu, İsviçre L-GAV sözleşmesi ve arşiv evrakları.' : 'Offizielle Dokumente, PIN-Code und Schweizer Arbeitsvertrag.'}
                  </p>
                </div>

                {isAdmin && (
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                      isEditing
                        ? 'btn-ghost text-ink'
                        : 'btn-brand text-white font-bold'
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isEditing ? (lang === 'tr' ? 'Vazgeç' : 'Abbrechen') : (lang === 'tr' ? 'Bilgileri Düzenle' : 'Daten bearbeiten')}</span>
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleSave} className="space-y-4 card-inner p-5 rounded-2xl border border-line">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-bold text-ink-soft mb-1">Ad Soyad (Name):</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl card-inner border border-line text-ink font-semibold"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-ink-soft mb-1">Pozisyon / Ünvan (Job Title):</label>
                      <input
                        type="text"
                        value={formData.jobTitle}
                        onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl card-inner border border-line text-ink font-semibold"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-ink-soft mb-1">4 Haneli Tablet Kiosk PIN:</label>
                      <input
                        type="text"
                        maxLength="4"
                        value={formData.pin}
                        onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl card-inner border border-line text-ink font-mono font-bold text-sm tracking-widest"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-ink-soft mb-1">Telefon / WhatsApp:</label>
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl card-inner border border-line text-ink font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-ink-soft mb-1">AHV / AVS Numarası:</label>
                      <input
                        type="text"
                        value={formData.ahv}
                        onChange={(e) => setFormData({ ...formData, ahv: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl card-inner border border-line text-ink font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-ink-soft mb-1">Saatlik Ücret (CHF/h):</label>
                      <input
                        type="number"
                        step="0.5"
                        value={formData.hourlyRate}
                        onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl card-inner border border-line text-ink font-mono font-bold"
                      />
                    </div>

                    <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-ink-soft mb-1">Maaş Bankası (Bank):</label>
                        <select
                          value={formData.bankName}
                          onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl card-inner border border-line text-ink font-semibold"
                        >
                          {SWISS_BANKS.map(b => (
                            <option key={b} value={b}>{b}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block font-bold text-ink-soft mb-1">IBAN Numarası:</label>
                        <input
                          type="text"
                          value={formData.iban}
                          onChange={(e) => setFormData({ ...formData, iban: e.target.value })}
                          placeholder="Örn: CH93 0000 0000 0000 0000 0"
                          className="w-full px-3 py-2 rounded-xl card-inner border border-line text-ink font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 rounded-xl bg-slate-200 text-ink-soft text-xs font-bold"
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl card-inner text-white text-xs font-black flex items-center gap-1.5"
                    >
                      <Save className="w-4 h-4" />
                      <span>{lang === 'tr' ? 'Değişiklikleri Kaydet' : 'Änderungen speichern'}</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Left Column: Identifiers */}
                  <div className="p-4 rounded-2xl card-inner border border-line space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-ink-soft flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-ink" />
                      <span>{lang === 'tr' ? 'Sistem & Terminal Giriş Bilgileri' : 'Zugangsdaten & Tablet-PIN'}</span>
                    </h4>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between p-2.5 rounded-xl card-inner border border-line">
                        <span className="text-ink-soft flex items-center gap-1.5">
                          <Fingerprint className="w-4 h-4 text-ink" />
                          Tablet Kiosk PIN:
                        </span>
                        <span className="font-mono font-black text-sm px-2.5 py-0.5 rounded-lg card-inner text-ink border border-line">
                          {formData.pin}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-xl card-inner border border-line">
                        <span className="text-ink-soft flex items-center gap-1.5">
                          <Mail className="w-4 h-4 text-ink" />
                          E-Mail Login:
                        </span>
                        <span className="font-mono text-ink font-bold">
                          {formData.email}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-xl card-inner border border-line">
                        <span className="text-ink-soft flex items-center gap-1.5">
                          <KeyRound className="w-4 h-4 text-brand" />
                          Passwort:
                        </span>
                        <span className="font-mono text-ink font-bold">
                          {formData.password}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-xl card-inner border border-line">
                        <span className="text-ink-soft">AHV / AVS-Nr:</span>
                        <span className="font-mono font-bold text-ink px-2 py-0.5 rounded bg-subtle">
                          {formData.ahv}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Digital Documents Archive */}
                  <div className="p-4 rounded-2xl card-inner border border-line space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-ink-soft flex items-center gap-1.5">
                      <FileCheck className="w-3.5 h-3.5 text-ink" />
                      <span>{lang === 'tr' ? 'Resmi Evraklar & Önizleme' : 'Dokumentenablage'}</span>
                    </h4>

                    <div className="space-y-2">
                      {documents.map((doc) => (
                        <div key={doc.id} className="p-2.5 rounded-xl card-inner border border-line flex items-center justify-between text-xs">
                          <div>
                            <p className="font-bold text-ink">{doc.title}</p>
                            <p className="text-[10px] text-ink-soft">{doc.date} • {doc.status}</p>
                          </div>
                          <button
                            onClick={() => setPreviewDoc(doc)}
                            className="px-2.5 py-1 rounded-lg bg-subtle text-ink-soft font-bold transition flex items-center gap-1 text-[11px]"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Önizle</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-3 sm:p-4 card-inner border-t border-line flex items-center justify-between gap-2">
          
          <div className="flex items-center gap-3">
            {isAdmin && (
              <button
                onClick={handleDeactivate}
                className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-red-500/10 text-red-500 text-[11px] sm:text-xs font-bold hover:bg-red-500/20 transition flex items-center gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <span className="hidden sm:inline">{lang === 'tr' ? 'İşten Çıkar (Pasife Al)' : 'Deaktivieren'}</span>
                <span className="sm:hidden">{lang === 'tr' ? 'Pasife Al' : 'Deaktivieren'}</span>
              </button>
            )}
            
            <div className="hidden sm:flex items-center gap-2 text-[11px] text-ink-soft">
              <ShieldCheck className="w-3.5 h-3.5 text-ink" />
              <span>{lang === 'tr' ? 'nDSG Şifreli Sicil' : 'nDSG Akte'}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => window.print()}
              className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl card-inner border border-line text-ink text-[11px] sm:text-xs font-bold transition flex items-center gap-1.5"
            >
              <Printer className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-ink-soft" />
              <span className="hidden sm:inline">{lang === 'tr' ? 'Kayıtları Yazdır' : 'Akte drucken'}</span>
              <span className="sm:hidden">{lang === 'tr' ? 'Yazdır' : 'Drucken'}</span>
            </button>
            <button
              onClick={onClose}
              className="px-3 sm:px-5 py-1.5 sm:py-2 rounded-xl bg-dark text-white text-[11px] sm:text-xs font-black transition"
            >
              {lang === 'tr' ? 'Kapat' : 'Schliessen'}
            </button>
          </div>
        </div>

      {/* DOCUMENT PREVIEW MODAL */}
      {previewDoc && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs modal-backdrop">
          <div className="w-full max-w-2xl bg-surface rounded-3xl p-6 border border-line relative max-h-[85vh] overflow-y-auto modal-container text-ink shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between border-b border-line pb-3 mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-ink" />
                <h3 className="font-bold text-sm text-ink">{previewDoc.title}</h3>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="p-1 rounded-lg text-ink-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Official Swiss Contract View */}
            <div className="p-6 card-inner rounded-2xl border border-line font-serif text-ink text-xs space-y-4">
              <div className="flex justify-between items-start border-b border-line pb-4">
                <div>
                  <h4 className="font-black text-sm tracking-wide uppercase font-sans text-ink">
                    ADO FIRMA ENTERPRISE GMBH
                  </h4>
                  <p className="text-[11px] font-sans text-ink-soft">Zürich, Schweiz • CHE-115.892.411 MWST</p>
                </div>
                <div className="text-right font-sans">
                  <span className="px-2 py-0.5 rounded bg-subtle text-ink font-bold text-[10px]">
                    L-GAV GASTGEWERBE 2025
                  </span>
                  <p className="text-[10px] text-ink-soft mt-1">Datum: {previewDoc.date}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h5 className="font-bold font-sans text-xs text-ink uppercase">
                  Arbeitsvertrag & Personaldossier für {formData.name}
                </h5>
                <p className="leading-relaxed">
                  Zwischen der ADO Firma Enterprise GmbH (Arbeitgeber) und <strong>{formData.name}</strong>, geb. {formData.birthDate}, 
                  AHV-Nummer <strong>{formData.ahv}</strong>, wohnhaft in {formData.address}.
                </p>
                <p className="leading-relaxed">
                  <strong>Funktion:</strong> {formData.jobTitle || 'Mitarbeiter'} ({(formData.department || 'staff').toUpperCase()})<br />
                  <strong>Pensum:</strong> {pensumPercent}% ({weeklyHours} Std./Woche)<br />
                  <strong>Stundenansatz / Lohn:</strong> CHF {formData.hourlyRate} brutto pro Stunde<br />
                  <strong>13. Monatslohn:</strong> 8.33% gemäss Art. 12 L-GAV gewährleistet.
                </p>
              </div>

              <div className="pt-6 border-t border-line flex justify-between items-end font-sans">
                <div>
                  <p className="text-[10px] text-ink-soft mb-6">Für den Arbeitgeber:</p>
                  <p className="font-bold text-xs border-t border-slate-400 pt-1">ADO Chef / Geschäftsführung</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-ink-soft mb-6">Arbeitnehmer:</p>
                  <p className="font-bold text-xs border-t border-slate-400 pt-1">{formData.name}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 rounded-xl bg-dark text-white text-white text-xs font-bold"
              >
                {lang === 'tr' ? 'Kapat' : 'Schliessen'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);
};
