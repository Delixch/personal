import React, { useState } from 'react';
import {
  Users2,
  Plus,
  Mail,
  KeyRound,
  ShieldCheck,
  FileText,
  DollarSign,
  Phone,
  CheckCircle2,
  X,
  BadgeCheck,
  Building,
  UserPlus
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { StorageService } from '../../services/storage';
import { SEED_DEPARTMENTS } from '../../services/seedData';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { PersonalakteModal } from './PersonalakteModal';

export const EmployeeHR = ({ lang, currentUser }) => {
  const [employees, setEmployees] = useState(StorageService.getEmployees());
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [newEmp, setNewEmp] = useState({
    name: '',
    email: '',
    password: '1234',
    role: 'employee',
    department: 'kuche',
    jobTitle: '',
    hourlyRate: 30.00,
    phone: '+41 79 ',
    ahv: '756.',
    contractType: 'Festanstellung 100%',
    vacationTotal: 25,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    onboardingChecks: {
      contractSigned: true,
      insuranceReported: true,
      hygieneTrained: true,
      keysHanded: true
    }
  });

  const handleCreateEmployee = (e) => {
    e.preventDefault();
    StorageService.saveEmployee(newEmp);
    setEmployees(StorageService.getEmployees());
    setShowAddModal(false);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl glass-panel relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold mb-2">
              <Users2 className="w-3.5 h-3.5 text-amber-600" />
              <span>Digitale Personal- & HR-Verwaltung</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {lang === 'tr' ? 'Personel Dosyaları, Sözleşmeler & Girişler' : 'Mitarbeiterakten, Verträge & Zugänge'}
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl">
              {lang === 'tr'
                ? 'Her personele özel e-posta & şifre erişimi, dijital sigorta, sözleşme ve onboarding takibi.'
                : 'Zentrale Verwaltung aller Mitarbeiter-Zugänge, Stundenansätze, AHV-Nummern und Arbeitsverträge.'}
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl gradient-btn-emerald font-bold text-xs flex items-center gap-1.5 transition shadow-sm self-start md:self-auto"
          >
            <UserPlus className="w-4 h-4" />
            <span>{lang === 'tr' ? 'Yeni Personel Ekle' : 'Neuen Mitarbeiter erfassen'}</span>
          </button>
        </div>
      </div>

      {/* Quick 360-Degree Employee Dossier Selector Bar for Chef */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white shadow-md border border-slate-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'tr' ? 'Personel 360° Hızlı Sicil Seçici (Chef Kolaylığı)' : '360° Mitarbeiter-Schnellzugriff (Chef-Modus)'}</span>
            </h3>
            <p className="text-[11px] text-slate-300 mt-0.5">
              {lang === 'tr'
                ? 'Bölüm bölüm gezmeden tek tıkla çalışanın çalıştığı saatleri, kalan iznini, maaşını ve tüm evraklarını açın:'
                : 'Klicken Sie auf einen Mitarbeiter, um alle Arbeitszeiten, Resturlaub, Lohnabrechnungen und Akten sofort zu sehen:'}
            </p>
          </div>
          <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 self-start sm:self-auto">
            {employees.length} {lang === 'tr' ? 'Kayıtlı Personel' : 'Mitarbeiter'}
          </span>
        </div>

        {/* Quick Employee Pill Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {employees.map((emp) => (
            <button
              key={emp.id}
              onClick={() => setSelectedEmployee(emp)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-white transition hover:scale-102 active:scale-98 shadow-2xs"
            >
              <img
                src={emp.avatar}
                alt={emp.name}
                className="w-5 h-5 rounded-full object-cover ring-1 ring-emerald-400"
              />
              <span>{emp.role === 'admin' ? '👑 ' : ''}{emp.name.split(' ')[0]}</span>
              <span className="text-[10px] text-emerald-300 font-mono font-normal">PIN:{emp.pin || '1001'}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Employee Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {employees.map((emp) => {
          const vacationRest = (emp.vacationTotal || 25) - (emp.vacationUsed || 0);
          return (
            <div
              key={emp.id}
              className="glass-panel glass-panel-hover p-5 flex flex-col justify-between cursor-pointer group"
              onClick={() => setSelectedEmployee(emp)}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={emp.avatar}
                      alt={emp.name}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-200 group-hover:ring-emerald-400 transition"
                    />
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition">{emp.name}</h3>
                      <p className="text-xs text-emerald-700 font-semibold">{emp.jobTitle}</p>
                      <span className="badge badge-slate text-[10px] py-0 px-1.5 mt-1">
                        {emp.department.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {emp.role === 'admin' && (
                    <span className="badge badge-emerald text-[9px] py-0 px-1.5 font-black">
                      👑 CHEF
                    </span>
                  )}
                </div>

                {/* Quick 360-Degree Stat Cards inside the card */}
                <div className="grid grid-cols-3 gap-1.5 mb-3 text-center">
                  <div className="p-1.5 rounded-lg bg-cyan-50 border border-cyan-200">
                    <span className="text-[9px] text-slate-500 block uppercase font-bold">Mesai</span>
                    <span className="font-mono text-xs font-black text-cyan-900">42.0h/W</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-amber-50 border border-amber-200">
                    <span className="text-[9px] text-slate-500 block uppercase font-bold">Kalan İzin</span>
                    <span className="font-mono text-xs font-black text-amber-900">{vacationRest} Gün</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-purple-50 border border-purple-200">
                    <span className="text-[9px] text-slate-500 block uppercase font-bold">Saatlik</span>
                    <span className="font-mono text-xs font-black text-purple-900">{formatCurrency(emp.hourlyRate)}</span>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-1.5 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 my-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-blue-600" />
                      E-Mail:
                    </span>
                    <span className="font-mono text-slate-900 text-[11px] truncate max-w-[150px]">
                      {emp.email}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
                      Passwort / PIN:
                    </span>
                    <div className="flex items-center gap-1.5 font-mono text-xs">
                      <span className="text-slate-700">{emp.password}</span>
                      <span className="text-slate-300">|</span>
                      <span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                        PIN: {emp.pin || '1001'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">AHV / AVS:</span>
                    <span className="font-mono text-[11px] text-slate-600">{emp.ahv || 'In Prüfung'}</span>
                  </div>
                </div>

                {/* Digital Check Badges */}
                <div className="flex items-center gap-1.5 text-[10px]">
                  <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    <BadgeCheck className="w-3 h-3 text-emerald-600" />
                    <span>Vertrag aktiv</span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                    <ShieldCheck className="w-3 h-3 text-blue-600" />
                    <span>UVG / Kasse</span>
                  </span>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedEmployee(emp);
                }}
                className="mt-4 w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-black text-white transition flex items-center justify-center gap-2 shadow-sm group-hover:scale-101"
              >
                <FileText className="w-4 h-4 text-white" />
                <span>{lang === 'tr' ? '⭐ 360° Sicil & Tüm Bilgileri Aç →' : '⭐ 360° Akte & Alle Daten öffnen →'}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Comprehensive Swiss Personalakte Dossier Modal */}
      {selectedEmployee && (
        <PersonalakteModal
          employee={selectedEmployee}
          lang={lang}
          onClose={() => setSelectedEmployee(null)}
          onSave={(updated) => {
            StorageService.saveEmployee(updated);
            setEmployees(StorageService.getEmployees());
            setSelectedEmployee(updated);
          }}
          onSwitchUser={(emp) => {
            StorageService.setCurrentUser(emp);
            window.location.reload();
          }}
        />
      )}

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl relative border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-emerald-600" />
                <span>{lang === 'tr' ? 'Yeni Personel & Erişim Tanımla' : 'Neuen Mitarbeiter erfassen'}</span>
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEmployee} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Vor- und Nachname (Ad Soyad):
                </label>
                <input
                  type="text"
                  required
                  value={newEmp.name}
                  onChange={(e) => setNewEmp({ ...newEmp, name: e.target.value })}
                  placeholder="z.B. Deniz Arslan"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    E-Mail (App-Login):
                  </label>
                  <input
                    type="email"
                    required
                    value={newEmp.email}
                    onChange={(e) => setNewEmp({ ...newEmp, email: e.target.value })}
                    placeholder="deniz@firma.ch"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Passwort (Şifre):
                  </label>
                  <input
                    type="text"
                    required
                    value={newEmp.password}
                    onChange={(e) => setNewEmp({ ...newEmp, password: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Abteilung (Departman):
                  </label>
                  <select
                    value={newEmp.department}
                    onChange={(e) => setNewEmp({ ...newEmp, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-emerald-500"
                  >
                    {SEED_DEPARTMENTS.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Funktion / Titel:
                  </label>
                  <input
                    type="text"
                    required
                    value={newEmp.jobTitle}
                    onChange={(e) => setNewEmp({ ...newEmp, jobTitle: e.target.value })}
                    placeholder="z.B. Chef de Partie / Barista"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Stundenlohn (CHF/h):
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={newEmp.hourlyRate}
                    onChange={(e) => setNewEmp({ ...newEmp, hourlyRate: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Telefon / WhatsApp:
                  </label>
                  <input
                    type="text"
                    value={newEmp.phone}
                    onChange={(e) => setNewEmp({ ...newEmp, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              {/* Onboarding Checklist */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <p className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                  Onboarding & HR Checkliste:
                </p>
                <label className="flex items-center gap-2 text-xs text-slate-700">
                  <input type="checkbox" defaultChecked className="rounded text-emerald-600" />
                  <span>Arbeitsvertrag digital hinterlegt (GAV Gastgewerbe)</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-700">
                  <input type="checkbox" defaultChecked className="rounded text-emerald-600" />
                  <span>Kranken- und Unfallversicherung (UVG) angemeldet</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-700">
                  <input type="checkbox" defaultChecked className="rounded text-emerald-600" />
                  <span>Hygieneschulung & Sicherheitsunterweisung erfolgt</span>
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl gradient-btn-emerald font-bold text-xs transition shadow-sm"
                >
                  {lang === 'tr' ? 'Personeli Kaydet & Erişimi Aç' : 'Mitarbeiter anlegen & Zugang freischalten'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
