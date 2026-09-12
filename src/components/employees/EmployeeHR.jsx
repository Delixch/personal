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
    const generatedPin = Math.floor(1000 + Math.random() * 9000).toString();
    const employeeToSave = { ...newEmp, pin: generatedPin };
    
    StorageService.saveEmployee(employeeToSave);
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

      <div className="p-4 sm:p-5 rounded-3xl bg-surface border border-line">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <h3 className="text-sm font-black text-ink flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand" />
              <span>{lang === 'tr' ? 'Personel 360° Hızlı Sicil Seçici (Chef Kolaylığı)' : '360° Mitarbeiter-Schnellzugriff (Chef-Modus)'}</span>
            </h3>
            <p className="text-[11px] text-ink-muted mt-0.5">
              {lang === 'tr'
                ? 'Bölüm bölüm gezmeden tek tıkla çalışanın çalıştığı saatleri, kalan iznini, maaşını ve tüm evraklarını açın:'
                : 'Klicken Sie auf einen Mitarbeiter, um alle Arbeitszeiten, Resturlaub, Lohnabrechnungen und Akten sofort zu sehen:'}
            </p>
          </div>
          <span className="badge badge-brand text-xs self-start sm:self-auto font-black">
            {employees.length} {lang === 'tr' ? 'Personel' : 'Mitarbeiter'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {employees.filter(e => e.aktiv !== false && e.status !== 'inactive').map((emp) => (
            <button
              key={emp.id}
              onClick={() => setSelectedEmployee(emp)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl card-inner border border-line text-xs font-bold text-ink hover:border-brand transition active:scale-98"
            >
              <img
                src={emp.avatar}
                alt={emp.name}
                className="w-5 h-5 rounded-full object-cover ring-1 ring-brand/50"
              />
              <span className="text-ink">{emp.role === 'admin' ? '👑 ' : ''}{emp.name.split(' ')[0]}</span>
              <span className="text-[10px] text-brand font-mono font-bold">PIN:{emp.pin || '1001'}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {employees.filter(e => e.aktiv !== false && e.status !== 'inactive').map((emp) => {
          const vacationRest = (emp.vacationTotal || 25) - (emp.vacationUsed || 0);
          return (
            <div
              key={emp.id}
              className="p-5 rounded-3xl card-inner border border-line flex flex-col justify-between cursor-pointer hover:border-brand transition shadow-sm group"
              onClick={() => setSelectedEmployee(emp)}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={emp.avatar}
                      alt={emp.name}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-brand/30 transition"
                    />
                    <div>
                      <h3 className="font-bold text-sm text-ink group-hover:text-brand transition">{emp.name}</h3>
                      <p className="text-xs text-ink-soft font-semibold">{emp.jobTitle}</p>
                      <span className="badge badge-slate text-[10px] py-0 px-2 mt-1 font-bold">
                        {(emp.department || 'staff').toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {emp.role === 'admin' && (
                    <span className="badge badge-emerald text-[9px] py-0.5 px-2 font-black">
                      👑 CHEF
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                  <div className="p-2 rounded-xl bg-subtle border border-line flex flex-col justify-center">
                    <span className="text-[10px] text-ink-soft block uppercase font-bold">{lang === 'tr' ? 'Mesai' : 'Sollzeit'}</span>
                    <span className="font-mono text-xs font-bold text-ink mt-0.5">42.0h/W</span>
                  </div>
                  <div className="p-2 rounded-xl bg-subtle border border-line flex flex-col justify-center">
                    <span className="text-[10px] text-ink-soft block uppercase font-bold">{lang === 'tr' ? 'Kalan İzin' : 'Resturlaub'}</span>
                    <span className="font-mono text-xs font-black text-brand mt-0.5">{vacationRest} {lang === 'tr' ? 'Gün' : 'Tage'}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-subtle border border-line flex flex-col justify-center">
                    <span className="text-[10px] text-ink-soft block uppercase font-bold">{lang === 'tr' ? 'Saatlik' : 'Stundenlohn'}</span>
                    <span className="font-mono text-xs font-bold text-emerald-400 mt-0.5">{formatCurrency(emp.hourlyRate)}</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-ink-soft bg-subtle p-3.5 rounded-2xl border border-line my-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-ink-soft flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-ink-muted" />
                      <span>E-Mail:</span>
                    </span>
                    <span className="font-mono text-ink font-semibold text-[11px] truncate max-w-[150px]">
                      {emp.email}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-ink-soft flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-ink-muted" />
                      <span>Passwort / PIN:</span>
                    </span>
                    <div className="flex items-center gap-1.5 font-mono text-xs">
                      <span className="text-ink-soft">{emp.password}</span>
                      <span className="text-ink-muted">|</span>
                      <span className="px-2 py-0.5 rounded-md card-inner text-brand font-bold border border-brand/30 text-[11px]">
                        PIN: {emp.pin || '1001'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-ink-soft">AHV / AVS:</span>
                    <span className="font-mono text-[11px] text-ink font-semibold">{emp.ahv || (lang === 'tr' ? 'İncelemede' : 'In Prüfung')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px]">
                  <span className="badge badge-emerald text-[10px] py-0.5 px-2 flex items-center gap-1 font-bold">
                    <BadgeCheck className="w-3.5 h-3.5" />
                    <span>{lang === 'tr' ? 'Sözleşme Aktif' : 'Vertrag aktiv'}</span>
                  </span>
                  <span className="badge badge-indigo text-[10px] py-0.5 px-2 flex items-center gap-1 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>UVG / Kasse</span>
                  </span>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedEmployee(emp);
                }}
                className="mt-4 w-full py-2.5 rounded-xl btn-ghost text-xs font-bold text-ink hover:border-brand hover:text-brand transition flex items-center justify-center gap-2 shadow-xs"
              >
                <FileText className="w-4 h-4 text-brand" />
                <span>{lang === 'tr' ? '360° Sicil & Tüm Bilgileri Aç →' : '360° Akte & Alle Daten öffnen →'}</span>
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
