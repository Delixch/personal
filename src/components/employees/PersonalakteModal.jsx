import React, { useState } from 'react';
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
  Home,
  HeartHandshake,
  Award,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const PersonalakteModal = ({
  employee,
  onClose,
  onSave,
  onSwitchUser,
  lang = 'de'
}) => {
  if (!employee) return null;

  const [activeTab, setActiveTab] = useState('stammdaten');
  const [isEditing, setIsEditing] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);

  // Editable form state
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
    vacationUsed: employee.vacationUsed || 5,
    joinedDate: employee.joinedDate || '2023-01-01',
    address: employee.address || 'Zürichstrasse 42, 8001 Zürich',
    birthDate: employee.birthDate || '14.05.1988',
    nationality: employee.nationality || (employee.role === 'admin' ? 'Schweiz (ZH)' : 'Türkei / Ausweis C'),
    emergencyContact: employee.emergencyContact || 'Leyla Yılmaz (Ehepartnerin) - +41 79 444 55 66',
    iban: employee.iban || 'CH93 0076 2011 6238 5295 7 (Zürcher Kantonalbank)'
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

  // Swiss GAV Gastrosuisse Contract details
  const pensumPercent = formData.contractType.includes('80%')
    ? 80
    : formData.contractType.includes('60%')
    ? 60
    : formData.contractType.includes('50%')
    ? 50
    : 100;
  const weeklyHours = ((42 * pensumPercent) / 100).toFixed(1);
  const monthlySalaryEstimate = (formData.hourlyRate * ((182 * pensumPercent) / 100)).toFixed(2);
  const thirteentSalaryEstimate = ((monthlySalaryEstimate * 12 * 0.0833) / 12).toFixed(2);

  // Dossier Documents List
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-4xl max-h-[92vh] rounded-3xl bg-white border border-slate-200 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Top Header Card */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-700">
          <div className="flex items-center gap-4">
            <img
              src={employee.avatar}
              alt={employee.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-emerald-500/40 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {employee.role === 'admin' ? '👑 CHEF / INHABER' : 'MITARBEITER / HR'}
                </span>
                <span className="text-[11px] font-mono text-slate-300">
                  ID: {employee.id.toUpperCase()}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                {formData.name}
              </h2>
              <p className="text-xs sm:text-sm text-emerald-300 font-semibold">
                {formData.jobTitle} • {formData.department.toUpperCase()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Quick Switch User */}
            <button
              onClick={() => {
                onSwitchUser(employee);
                onClose();
              }}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition flex items-center gap-1.5 shadow-sm"
              title="Bu personelin gözünden bak"
            >
              <Fingerprint className="w-4 h-4" />
              <span>{lang === 'tr' ? 'Bu Kullanıcıya Geç' : 'Als Benutzer wechseln'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
              title="Schliessen"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Strip */}
        <div className="flex items-center gap-1 sm:gap-2 px-4 sm:px-6 py-2.5 bg-slate-100 border-b border-slate-200 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('stammdaten')}
            className={`px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'stammdaten'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-300 font-black'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <User className="w-4 h-4 text-emerald-600" />
            <span>{lang === 'tr' ? '1. Temel Bilgiler & İletişim' : '1. Stammdaten & Kontakt'}</span>
          </button>

          <button
            onClick={() => setActiveTab('vertrag')}
            className={`px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'vertrag'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-300 font-black'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <FileText className="w-4 h-4 text-blue-600" />
            <span>{lang === 'tr' ? '2. GAV İş Sözleşmesi & Maaş' : '2. Arbeitsvertrag & GAV'}</span>
          </button>

          <button
            onClick={() => setActiveTab('sozial')}
            className={`px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'sozial'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-300 font-black'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            <span>{lang === 'tr' ? '3. Sosyal Güvenlik & Sigorta' : '3. Sozialversicherungen'}</span>
          </button>

          <button
            onClick={() => setActiveTab('dokumente')}
            className={`px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'dokumente'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-300 font-black'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <FileCheck className="w-4 h-4 text-amber-600" />
            <span>{lang === 'tr' ? '4. Dijital Evraklar (4)' : '4. Digitale Akten (4)'}</span>
          </button>
        </div>

        {/* Scrollable Tab Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">

          {/* TAB 1: STAMMDATEN & KONTAKT */}
          {activeTab === 'stammdaten' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {lang === 'tr' ? 'Kişisel Bilgiler, İletişim & Tablet PIN Kodu' : 'Persönliche Stammdaten & Tablet-PIN'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {lang === 'tr'
                      ? 'Tablet giriş-çıkış terminali için PIN kodu ve resmi kimlik bilgileri.'
                      : 'Verwaltung der Login-Daten, Kontaktdaten und Kiosk-Stempel-PIN.'}
                  </p>
                </div>

                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    isEditing
                      ? 'bg-slate-200 text-slate-800'
                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isEditing ? (lang === 'tr' ? 'Vazgeç' : 'Abbrechen') : (lang === 'tr' ? 'Bilgileri Düzenle' : 'Daten bearbeiten')}</span>
                </button>
              </div>

              {isEditing ? (
                <form onSubmit={handleSave} className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Ad Soyad (Name):</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-semibold"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Pozisyon / Ünvan (Job Title):</label>
                      <input
                        type="text"
                        value={formData.jobTitle}
                        onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-semibold"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">4 Haneli Tablet Kiosk PIN:</label>
                      <input
                        type="text"
                        maxLength="4"
                        value={formData.pin}
                        onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-emerald-700 font-mono font-bold text-sm tracking-widest"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Telefon / WhatsApp:</label>
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">E-Mail (Giriş):</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Şifre (Passwort):</label>
                      <input
                        type="text"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">AHV / AVS Numarası:</label>
                      <input
                        type="text"
                        value={formData.ahv}
                        onChange={(e) => setFormData({ ...formData, ahv: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Saatlik Ücret (CHF/h):</label>
                      <input
                        type="number"
                        step="0.5"
                        value={formData.hourlyRate}
                        onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-emerald-700 font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 text-xs font-bold"
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md flex items-center gap-1.5"
                    >
                      <Save className="w-4 h-4" />
                      <span>{lang === 'tr' ? 'Değişiklikleri Kaydet' : 'Änderungen speichern'}</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Left Column: Essential Identifiers */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{lang === 'tr' ? 'Sistem & Terminal Giriş Bilgileri' : 'Zugangsdaten & Tablet-PIN'}</span>
                    </h4>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200">
                        <span className="text-slate-500 flex items-center gap-1.5">
                          <Fingerprint className="w-4 h-4 text-emerald-600" />
                          Tablet Kiosk PIN:
                        </span>
                        <span className="font-mono font-black text-sm px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300">
                          {formData.pin}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200">
                        <span className="text-slate-500 flex items-center gap-1.5">
                          <Mail className="w-4 h-4 text-blue-600" />
                          E-Mail Login:
                        </span>
                        <span className="font-mono text-slate-900 font-bold">
                          {formData.email}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200">
                        <span className="text-slate-500 flex items-center gap-1.5">
                          <KeyRound className="w-4 h-4 text-amber-600" />
                          Passwort:
                        </span>
                        <span className="font-mono text-slate-800 font-bold">
                          {formData.password}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200">
                        <span className="text-slate-500 flex items-center gap-1.5">
                          <Phone className="w-4 h-4 text-emerald-600" />
                          Telefon:
                        </span>
                        <span className="font-mono text-slate-900 font-bold">
                          {formData.phone}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Personal & Official Identifiers */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-blue-600" />
                      <span>{lang === 'tr' ? 'Resmi İsviçre Kimlik & Adres' : 'Amtliche Daten & Wohnort'}</span>
                    </h4>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200">
                        <span className="text-slate-500">AHV / AVS-Nr:</span>
                        <span className="font-mono font-bold text-slate-900 px-2 py-0.5 rounded bg-slate-100">
                          {formData.ahv}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200">
                        <span className="text-slate-500">Geburtsdatum:</span>
                        <span className="font-bold text-slate-800">{formData.birthDate}</span>
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200">
                        <span className="text-slate-500">Nationalität:</span>
                        <span className="font-bold text-slate-800">{formData.nationality}</span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                        <span className="text-slate-500 block mb-1">Wohnadresse:</span>
                        <span className="font-bold text-slate-900">{formData.address}</span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                        <span className="text-slate-500 block mb-1">Notfallkontakt (Acil Durum):</span>
                        <span className="font-semibold text-rose-800">{formData.emergencyContact}</span>
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </div>
          )}

          {/* TAB 2: ARBEITSVERTRAG & GAV GASTROSUISSE */}
          {activeTab === 'vertrag' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-black text-blue-950 flex items-center gap-2">
                    <Building className="w-5 h-5 text-blue-700" />
                    <span>L-GAV Gastgewerbe Arbeitsvertrag (İsviçre Gastronomi Sözleşmesi)</span>
                  </h3>
                  <p className="text-xs text-blue-800 mt-0.5">
                    GastroSuisse ve Hotel & Gastro Union standartlarına tam uyumlu dijital sözleşme dökümü.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-blue-600 text-white font-black text-xs shrink-0 shadow-xs">
                  GAV 2025 AKTIV
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Vertragsart:</span>
                  <p className="text-sm font-black text-slate-900 mt-1">{formData.contractType}</p>
                  <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">Pensum: {pensumPercent}%</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Stundenlohn / Ansatz:</span>
                  <p className="text-base font-mono font-black text-emerald-700 mt-1">
                    {formatCurrency(formData.hourlyRate)}/h
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Monatlich ca. CHF {monthlySalaryEstimate}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Soll-Arbeitszeit:</span>
                  <p className="text-sm font-black text-slate-900 mt-1">{weeklyHours} Std / Woche</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Basis 42h (Vollzeit)</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Ferienanspruch:</span>
                  <p className="text-sm font-black text-slate-900 mt-1">{formData.vacationTotal} Tage / Jahr</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Verbraucht: {formData.vacationUsed} Tage</p>
                </div>
              </div>

              {/* Legal GAV Checklist Table */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
                <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider">
                  Gesetzliche Vertragsklauseln & GAV-Bestimmungen:
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-900">13. Monatslohn (8.33%):</p>
                      <p className="text-slate-600 text-[11px] mt-0.5">
                        L-GAV Art. 12 konform hinterlegt. Monatliche Rückstellung ca. CHF {thirteentSalaryEstimate}.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-900">Ruhetage & Wochenfeiertage:</p>
                      <p className="text-slate-600 text-[11px] mt-0.5">
                        2 Ruhetage pro Woche (durchschnittlich) gemäss Dienstplan garantiert.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-900">Kündigungsfristen:</p>
                      <p className="text-slate-600 text-[11px] mt-0.5">
                        Probezeit 1 Monat, im 1. Dienstjahr 1 Monat, ab 2. Dienstjahr 2 Monate auf Monatsende.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-900">Überstundenregelung (L-GAV Art. 15):</p>
                      <p className="text-slate-600 text-[11px] mt-0.5">
                        Kompensation durch Freizeit gleicher Dauer oder Auszahlung mit +25% Zuschlag.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SOZIALVERSICHERUNGEN & VORSORGE */}
          {activeTab === 'sozial' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  {lang === 'tr' ? 'İsviçre Sosyal Güvenlik & Sigorta Kayıtları' : 'Schweizer Sozialversicherungen & Kassen'}
                </h3>
                <p className="text-xs text-slate-500">
                  {lang === 'tr'
                    ? 'AHV, ALV, BVG GastroSocial, SUVA kaza ve KTG hastalık sigortası bildirimleri.'
                    : 'Alle obligatorischen Abzüge und Meldungen an die kantonalen Ausgleichskassen.'}
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black">
                      AHV
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">AHV / IV / EO (Alters- und Hinterlassenenversicherung)</h4>
                      <p className="text-xs text-slate-500">SVA Zürich • Ausgleichskasse GastroSocial</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-slate-900 text-sm">5.30% Arbeitnehmer</span>
                    <span className="block text-[11px] text-emerald-700 font-bold">✓ Aktiv gemeldet</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-black">
                      BVG
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">BVG Pensionskasse (2. Säule Berufliche Vorsorge)</h4>
                      <p className="text-xs text-slate-500">GastroSocial Pensionskasse • Koordinierter Lohn</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-slate-900 text-sm">ca. 7.00% Altersgutschrift</span>
                    <span className="block text-[11px] text-emerald-700 font-bold">✓ Beitragszahler</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-black">
                      UVG
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">UVG Unfallversicherung (Berufs- & Nichtberufsunfall)</h4>
                      <p className="text-xs text-slate-500">SUVA • BU 100% Arbeitgeber, NBU 0.85% Arbeitnehmer</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-slate-900 text-sm">0.85% NBU</span>
                    <span className="block text-[11px] text-emerald-700 font-bold">✓ Vollumfänglich versichert</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-black">
                      KTG
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">KTG Krankentaggeldversicherung (Kollekiv)</h4>
                      <p className="text-xs text-slate-500">Visana / Swica • 80% Lohnfortzahlung ab 3. Krankheitstag</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-slate-900 text-sm">0.73% Anteil</span>
                    <span className="block text-[11px] text-emerald-700 font-bold">✓ Attestpflicht ab Tag 3</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DIGITALE DOKUMENTE & AKTEN */}
          {activeTab === 'dokumente' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {lang === 'tr' ? 'Dijital Dosyalar & Resmi Belgeler' : 'Digitale Dokumentenablage & Nachweise'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {lang === 'tr'
                      ? 'İmzalı sözleşmeler, kimlik taramaları, hijyen belgeleri ve banka bilgileri.'
                      : 'Rechtssicher archivierte PDF-Akten dieses Mitarbeiters.'}
                  </p>
                </div>

                <button
                  onClick={() => alert(lang === 'tr' ? 'Demo: Yeni belge yükleme simülasyonu aktif.' : 'Demo: Dokumentenupload erfolgreich simuliert.')}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{lang === 'tr' ? '+ Belge Yükle' : '+ Dokument hochladen'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between hover:border-emerald-400 transition"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center font-bold text-xs">
                          {doc.type}
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {doc.status}
                        </span>
                      </div>

                      <h4 className="font-bold text-sm text-slate-900 mb-0.5">
                        {doc.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2">
                        {doc.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-400 font-mono">
                        {doc.date} • {doc.fileSize}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setPreviewDoc(doc)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition flex items-center gap-1 text-[11px]"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{lang === 'tr' ? 'Önizle' : 'Vorschau'}</span>
                        </button>
                        <button
                          onClick={() => alert(lang === 'tr' ? `${doc.title} indirildi!` : `${doc.title} heruntergeladen!`)}
                          className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                          title="Download"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{lang === 'tr' ? 'İsviçre nDSG veri koruma standartlarına uygun şifreli yerel arşiv.' : 'DSGVO / Schweizer nDSG konform verschlüsselte Personalakte.'}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                window.print();
              }}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>{lang === 'tr' ? 'Dossier Yazdır' : 'Akte drucken'}</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black transition shadow-sm"
            >
              {lang === 'tr' ? 'Kapat' : 'Schliessen'}
            </button>
          </div>
        </div>

      </div>

      {/* DOCUMENT PREVIEW MODAL */}
      {previewDoc && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-6 shadow-2xl border border-slate-300 relative max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-900">{previewDoc.title}</h3>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated Official Swiss Contract View */}
            <div className="p-6 bg-amber-50/40 rounded-2xl border border-amber-200/80 font-serif text-slate-800 text-xs space-y-4 shadow-inner">
              <div className="flex justify-between items-start border-b border-slate-300 pb-4">
                <div>
                  <h4 className="font-black text-sm tracking-wide uppercase font-sans text-slate-900">
                    ADO FIRMA ENTERPRISE GMBH
                  </h4>
                  <p className="text-[11px] font-sans text-slate-500">Zürich, Schweiz • CHE-115.892.411 MWST</p>
                </div>
                <div className="text-right font-sans">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    L-GAV GASTGEWERBE 2025
                  </span>
                  <p className="text-[10px] text-slate-500 mt-1">Datum: {previewDoc.date}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h5 className="font-bold font-sans text-xs text-slate-900 uppercase">
                  Arbeitsvertrag / Personalnachweis für {formData.name}
                </h5>
                <p className="leading-relaxed">
                  Zwischen der ADO Firma Enterprise GmbH (Arbeitgeber) und <strong>{formData.name}</strong>, geb. {formData.birthDate}, 
                  AHV-Nummer <strong>{formData.ahv}</strong>, wohnhaft in {formData.address}.
                </p>
                <p className="leading-relaxed">
                  <strong>Funktion:</strong> {formData.jobTitle} ({formData.department.toUpperCase()})<br />
                  <strong>Pensum:</strong> {pensumPercent}% ({weeklyHours} Std./Woche)<br />
                  <strong>Stundenansatz / Lohn:</strong> CHF {formData.hourlyRate} brutto pro Stunde<br />
                  <strong>13. Monatslohn:</strong> 8.33% gemäss Art. 12 L-GAV gewährleistet.
                </p>
              </div>

              <div className="pt-6 border-t border-slate-300 flex justify-between items-end font-sans">
                <div>
                  <p className="text-[10px] text-slate-500 mb-6">Für den Arbeitgeber:</p>
                  <p className="font-bold text-xs border-t border-slate-400 pt-1">ADO Chef / Geschäftsführung</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-500 mb-6">Arbeitnehmer:</p>
                  <p className="font-bold text-xs border-t border-slate-400 pt-1">{formData.name}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
              >
                {lang === 'tr' ? 'Kapat' : 'Schliessen'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
