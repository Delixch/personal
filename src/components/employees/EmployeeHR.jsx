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
  UserPlus,
  Sparkles
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

      <div className="p-6 sm:p-8 rounded-3xl bg-surface text-ink border border-line relative overflow-hidden mb-6 card-inner">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="page-title text-ink">
              {lang === 'tr' ? 'Personel Dosyaları, Sözleşmeler & Girişler' : 'Mitarbeiterakten, Verträge & Zugänge'}
            </h1>
            <p className="text-subhead text-ink-soft max-w-2xl leading-relaxed mt-1">
              {lang === 'tr'
                ? 'Her personele özel e-posta & şifre erişimi, dijital sigorta, sözleşme ve onboarding takibi.'
                : 'Zentrale Verwaltung aller Mitarbeiter-Zugänge, Stundenansätze, AHV-Nummern und Arbeitsverträge.'}
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl btn-brand font-black text-xs flex items-center gap-1.5 transition self-start md:self-auto shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>{lang === 'tr' ? 'Yeni Personel Ekle' : 'Neuen Mitarbeiter erfassen'}</span>
          </button>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-dark text-white border border-line">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-ink" />
              <span>{lang === 'tr' ? 'Personel 360° Hızlı Sicil Seçici (Chef Kolaylığı)' : '360° Mitarbeiter-Schnellzugriff (Chef-Modus)'}</span>
            </h3>
            <p className="text-[11px] text-ink-muted mt-0.5">
              {lang === 'tr'
                ? 'Bölüm bölüm gezmeden tek tıkla çalışanın çalıştığı saatleri, kalan iznini, maaşını ve tüm evraklarını açın:'
                : 'Klicken Sie auf einen Mitarbeiter, um alle Arbeitszeiten, Resturlaub, Lohnabrechnungen und Akten sofort zu sehen:'}
            </p>
          </div>
          <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-brand-light text-ink border border-line self-start sm:self-auto">
            {employees.length} {lang === 'tr' ? 'Kayıtlı Personel' : 'Mitarbeiter'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {employees.map((emp) => (
            <button
              key={emp.id}
              onClick={() => setSelectedEmployee(emp)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl card-inner border border-line text-xs font-bold text-white transition active:scale-98"
            >
              <img
                src={emp.avatar}
                alt={emp.name}
                className="w-5 h-5 rounded-full object-cover ring-1 ring-emerald-400"
              />
              <span>{emp.role === 'admin' ? '👑 ' : ''}{emp.name.split(' ')[0]}</span>
              <span className="text-[10px] text-ink font-mono font-normal">PIN:{emp.pin || '1001'}</span>
            </button>
          ))}
        </div>
      </div>

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
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-200 group- transition"
                    />
                    <div>
                      <h3 className="font-bold text-sm text-ink group- transition">{emp.name}</h3>
                      <p className="text-xs text-ink font-semibold">{emp.jobTitle}</p>
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

                <div className="grid grid-cols-3 gap-1.5 mb-3 text-center">
                  <div className="p-1.5 rounded-lg bg-cyan-50 border border-line">
                    <span className="text-[9px] text-ink-soft block uppercase font-bold">Mesai</span>
                    <span className="font-mono text-xs font-black text-ink">42.0h/W</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-amber-50 border border-line">
                    <span className="text-[9px] text-ink-soft block uppercase font-bold">Kalan İzin</span>
                    <span className="font-mono text-xs font-black text-brand">{vacationRest} Gün</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-purple-50 border border-line">
                    <span className="text-[9px] text-ink-soft block uppercase font-bold">Saatlik</span>
                    <span className="font-mono text-xs font-black text-ink">{formatCurrency(emp.hourlyRate)}</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-ink-soft card-inner p-3 rounded-xl border border-line my-2">
                  <div className="flex items-center justify-between">
                    <span className="text-ink-soft flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-ink" />
                      E-Mail:
                    </span>
                    <span className="font-mono text-ink text-[11px] truncate max-w-[150px]">
                      {emp.email}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-ink-soft flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-ink" />
                      Passwort / PIN:
                    </span>
                    <div className="flex items-center gap-1.5 font-mono text-xs">
                      <span className="text-ink-soft">{emp.password}</span>
                      <span className="text-ink-muted">|</span>
                      <span className="px-1.5 py-0.2 rounded bg-emerald-50 text-ink font-bold border border-line">
                        PIN: {emp.pin || '1001'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-ink-soft">AHV / AVS:</span>
                    <span className="font-mono text-[11px] text-ink-soft">{emp.ahv || 'In Prüfung'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[10px]">
                  <span className="inline-flex items-center gap-1 text-ink bg-emerald-50 px-2 py-0.5 rounded-md border border-line">
                    <BadgeCheck className="w-3 h-3 text-ink" />
                    <span>Vertrag aktiv</span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-ink bg-blue-50 px-2 py-0.5 rounded-md border border-line">
                    <ShieldCheck className="w-3 h-3 text-ink" />
                    <span>UVG / Kasse</span>
                  </span>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedEmployee(emp);
                }}
                className="mt-4 w-full py-2.5 rounded-xl card-inner text-xs font-black text-white transition flex items-center justify-center gap-2 group-"
              >
                <FileText className="w-4 h-4 text-white" />
                <span>{lang === 'tr' ? '⭐ 360° Sicil & Tüm Bilgileri Aç →' : '⭐ 360° Akte & Alle Daten öffnen →'}</span>
              </button>
            </div>
          );
        })}
      </div>

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

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs modal-backdrop">
          <div className="w-full max-w-lg rounded-3xl bg-surface p-6 relative border border-line max-h-[90vh] overflow-y-auto modal-container text-ink shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between border-b border-line pb-3 mb-4">
              <h2 className="text-base font-bold text-ink flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-ink" />
                <span>{lang === 'tr' ? 'Yeni Personel & Erişim Tanımla' : 'Neuen Mitarbeiter erfassen'}</span>
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-ink-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEmployee} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-ink-soft mb-1">
                  Vor- und Nachname (Ad Soyad):
                </label>
                <input
                  type="text"
                  required
                  value={newEmp.name}
                  onChange={(e) => setNewEmp({ ...newEmp, name: e.target.value })}
                  placeholder="z.B. Deniz Arslan"
                  className="w-full px-3 py-2 rounded-xl card-inner border border-line text-ink text-xs focus:outline-none focus:border-line"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-ink-soft mb-1">
                    E-Mail (App-Login):
                  </label>
                  <input
                    type="email"
                    required
                    value={newEmp.email}
                    onChange={(e) => setNewEmp({ ...newEmp, email: e.target.value })}
                    placeholder="deniz@firma.ch"
                    className="w-full px-3 py-2 rounded-xl card-inner border border-line text-ink text-xs focus:outline-none focus:border-line"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-soft mb-1">
                    Passwort (Şifre):
                  </label>
                  <input
                    type="text"
                    required
                    value={newEmp.password}
                    onChange={(e) => setNewEmp({ ...newEmp, password: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl card-inner border border-line text-ink text-xs focus:outline-none focus:border-line font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-ink-soft mb-1">
                    Abteilung (Departman):
                  </label>
                  <select
                    value={newEmp.department}
                    onChange={(e) => setNewEmp({ ...newEmp, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl card-inner border border-line text-ink text-xs focus:outline-none focus:border-line"
                  >
                    {SEED_DEPARTMENTS.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-soft mb-1">
                    Funktion / Titel:
                  </label>
                  <input
                    type="text"
                    required
                    value={newEmp.jobTitle}
                    onChange={(e) => setNewEmp({ ...newEmp, jobTitle: e.target.value })}
                    placeholder="z.B. Chef de Partie / Barista"
                    className="w-full px-3 py-2 rounded-xl card-inner border border-line text-ink text-xs focus:outline-none focus:border-line"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-ink-soft mb-1">
                    Stundenlohn (CHF/h):
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={newEmp.hourlyRate}
                    onChange={(e) => setNewEmp({ ...newEmp, hourlyRate: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl card-inner border border-line text-ink text-xs focus:outline-none focus:border-line font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-soft mb-1">
                    Telefon / WhatsApp:
                  </label>
                  <input
                    type="text"
                    value={newEmp.phone}
                    onChange={(e) => setNewEmp({ ...newEmp, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl card-inner border border-line text-ink text-xs focus:outline-none focus:border-line font-mono"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl card-inner border border-line space-y-2">
                <p className="text-xs font-bold text-ink uppercase tracking-wider mb-1">
                  Onboarding & HR Checkliste:
                </p>
                <label className="flex items-center gap-2 text-xs text-ink-soft">
                  <input type="checkbox" defaultChecked className="rounded text-ink" />
                  <span>Arbeitsvertrag digital hinterlegt (GAV Gastgewerbe)</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-ink-soft">
                  <input type="checkbox" defaultChecked className="rounded text-ink" />
                  <span>Kranken- und Unfallversicherung (UVG) angemeldet</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-ink-soft">
                  <input type="checkbox" defaultChecked className="rounded text-ink" />
                  <span>Hygieneschulung & Sicherheitsunterweisung erfolgt</span>
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl btn-brand font-bold text-xs transition"
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
