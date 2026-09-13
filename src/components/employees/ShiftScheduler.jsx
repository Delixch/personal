import React, { useState } from 'react';
import {
  CalendarDays,
  Plus,
  Clock,
  AlertTriangle,
  UserCheck,
  ChefHat,
  UtensilsCrossed,
  Wine,
  Boxes,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle2,
  Trash2,
  ShieldAlert
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { StorageService } from '../../services/storage';
import { SHIFT_TYPES, SEED_DEPARTMENTS } from '../../services/seedData';
import { formatDate } from '../../utils/formatters';
import { TRANSLATIONS } from '../../utils/translations';

export const ShiftScheduler = ({ lang, currentUser }) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.de;
  const [shifts, setShifts] = useState(StorageService.getShifts());
  const [employees, setEmployees] = useState(StorageService.getEmployees());
  const [selectedDept, setSelectedDept] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showReplaceModal, setShowReplaceModal] = useState(null);

  const [weekOffset, setWeekOffset] = useState(0);

  const getWeekDays = () => {
    const today = new Date();
    today.setDate(today.getDate() + weekOffset * 7);
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(today.setDate(diff));

    const week = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      week.push(d.toISOString().split('T')[0]);
    }
    return week;
  };

  const weekDays = getWeekDays();
  const dayNamesDe = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
  const dayNamesTr = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

  const getWeekLabel = () => {
    const mondayDate = new Date(weekDays[0] + 'T12:00:00');
    const target = new Date(Date.UTC(mondayDate.getFullYear(), mondayDate.getMonth(), mondayDate.getDate()));
    const dayNr = (target.getUTCDay() + 6) % 7;
    target.setUTCDate(target.getUTCDate() - dayNr + 3);
    const firstThursday = target.valueOf();
    target.setUTCMonth(0, 1);
    if (target.getUTCDay() !== 4) {
      target.setUTCMonth(0, 1 + ((4 - target.getUTCDay()) + 7) % 7);
    }
    const kw = 1 + Math.ceil((firstThursday - target) / 604800000);

    if (weekOffset === 0) {
      return lang === 'tr' ? `Bu Hafta (Hafta ${kw})` : `Diese Woche (KW ${kw})`;
    }
    if (weekOffset === 1) {
      return lang === 'tr' ? `Gelecek Hafta (Hafta ${kw})` : `Nächste Woche (KW ${kw})`;
    }
    if (weekOffset === -1) {
      return lang === 'tr' ? `Geçen Hafta (Hafta ${kw})` : `Letzte Woche (KW ${kw})`;
    }
    if (weekOffset > 1) {
      return lang === 'tr' ? `+${weekOffset} Hafta (Hafta ${kw})` : `+${weekOffset} Wochen (KW ${kw})`;
    }
    return lang === 'tr' ? `${weekOffset} Hafta (Hafta ${kw})` : `${weekOffset} Wochen (KW ${kw})`;
  };

  const [formData, setFormData] = useState({
    employeeId: employees[0]?.id || '',
    department: 'kuche',
    shiftType: 'frueh',
    date: weekDays[0],
    notes: ''
  });

  const filteredShifts = shifts.filter(s => {
    if (selectedDept === 'all') return true;
    return s.department === selectedDept;
  });

  const handleSaveShift = (e) => {
    e.preventDefault();
    StorageService.saveShift(formData);
    setShifts(StorageService.getShifts());
    setShowAddModal(false);

    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.6 }
    });
  };

  const handleDeleteShift = (id) => {
    StorageService.deleteShift(id);
    setShifts(StorageService.getShifts());
  };

  const handleReplaceEmployee = (targetShift, newEmpId) => {
    const updated = {
      ...targetShift,
      employeeId: newEmpId,
      status: 'confirmed',
      notes: `${targetShift.notes || ''} (Ersatzkraft für erkrankten Mitarbeiter)`
    };
    StorageService.saveShift(updated);
    setShifts(StorageService.getShifts());
    setShowReplaceModal(null);
  };

  const getDepartmentIcon = (deptId) => {
    switch (deptId) {
      case 'kuche': return <ChefHat className="w-3.5 h-3.5" />;
      case 'service': return <UtensilsCrossed className="w-3.5 h-3.5" />;
      case 'bar': return <Wine className="w-3.5 h-3.5" />;
      case 'lager': return <Boxes className="w-3.5 h-3.5" />;
      default: return <Sparkles className="w-3.5 h-3.5" />;
    }
  };

  const getShiftBadge = (typeKey) => {
    const info = SHIFT_TYPES[typeKey.toUpperCase()] || SHIFT_TYPES.FRUEH;
    return (
      <span className={`badge badge-${info.badgeColor} text-[10px] py-0 px-1.5`}>
        {info.name.split(' ')[0]} ({info.start} - {info.end})
      </span>
    );
  };

  const sickAlerts = shifts.filter(s => s.status === 'sick');

  return (
    <div className="space-y-6">

      <div className="p-6 sm:p-8 rounded-3xl bg-surface text-ink border border-line relative overflow-hidden mb-6 card-inner">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="page-title text-ink">
              {t.shiftTitle}
            </h1>
            <p className="text-subhead text-ink-soft max-w-2xl leading-relaxed mt-1">
              {t.shiftSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setWeekOffset(prev => prev - 1)}
              className="p-2.5 rounded-md bg-[#1e1514] text-ink hover:bg-[#2a1d1b] transition"
              title={lang === 'tr' ? 'Önceki Hafta' : 'Vorherige Woche'}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setWeekOffset(0)}
              className={`px-3.5 py-2.5 rounded-md text-xs font-bold transition ${
                weekOffset === 0
                  ? 'bg-[#1e1514] text-ink border border-line-soft'
                  : 'bg-[#2e1f1c] border border-brand/50 text-brand font-black'
              }`}
              title={lang === 'tr' ? 'Mevcut haftaya dön' : 'Zur aktuellen Woche zurückkehren'}
            >
              {getWeekLabel()}
            </button>
            <button
              onClick={() => setWeekOffset(prev => prev + 1)}
              className="p-2.5 rounded-md bg-[#1e1514] text-ink hover:bg-[#2a1d1b] transition"
              title={lang === 'tr' ? 'Gelecek Hafta' : 'Nächste Woche'}
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="ml-2 px-4 py-2.5 rounded-md btn-brand font-black text-xs flex items-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" />
              <span>{t.addShift}</span>
            </button>
          </div>
        </div>

        {sickAlerts.length > 0 && (
          <div className="mt-4 p-3.5 rounded-2xl card-inner border border-brand-border flex items-center justify-between gap-3 text-brand text-xs">
            <div className="flex items-center gap-2 font-bold">
              <ShieldAlert className="w-4 h-4 text-brand icon-brand shrink-0" />
              <span>
                {lang === 'tr'
                  ? `DİKKAT: ${sickAlerts.length} vardiyada hastalık bildirimi var! Lütfen yerine yedek personel atayın.`
                  : `ACHTUNG: ${sickAlerts.length} Schichtausfall durch Krankmeldung! Bitte Ersatzkraft zuteilen.`}
              </span>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-line-soft overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedDept('all')}
            className={`px-3.5 py-2 rounded-md text-xs font-bold whitespace-nowrap transition border ${
              selectedDept === 'all'
                ? 'bg-[#2e1f1c] border-brand/50 text-brand font-black'
                : 'bg-[#1e1514] border-transparent text-ink-soft hover:text-ink'
            }`}
          >
            {lang === 'tr' ? 'Tüm Departmanlar' : 'Alle Abteilungen'}
          </button>
          {SEED_DEPARTMENTS.map(dept => (
            <button
              key={dept.id}
              onClick={() => setSelectedDept(dept.id)}
              className={`px-3.5 py-2 rounded-md text-xs font-bold whitespace-nowrap transition border flex items-center gap-1.5 ${
                selectedDept === dept.id
                  ? 'bg-[#2e1f1c] border-brand/50 text-brand font-black'
                  : 'bg-[#1e1514] border-transparent text-ink-soft hover:text-ink'
              }`}
            >
              {getDepartmentIcon(dept.id)}
              <span>{dept.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {weekDays.map((dateStr, idx) => {
          const dayName = lang === 'tr' ? dayNamesTr[idx] : dayNamesDe[idx];
          const isToday = dateStr === new Date().toISOString().split('T')[0];
          const dayShifts = filteredShifts.filter(s => s.date === dateStr);

          return (
            <div
              key={dateStr}
              className={`rounded-2xl border p-3 flex flex-col min-h-[360px] card-inner ${
                isToday
                  ? 'border-brand font-bold'
                  : 'border-line'
              }`}
            >
              
              <div className="flex items-center justify-between border-b border-line-soft pb-2 mb-2.5">
                <div>
                  <span className={`text-xs font-extrabold uppercase ${isToday ? 'text-brand font-black' : 'text-ink'}`}>
                    {dayName}
                  </span>
                  <p className="text-[11px] text-subhead">{formatDate(dateStr)}</p>
                </div>
                {isToday && (
                  <span className="badge badge-brand py-0 px-1.5 text-[9px]">HEUTE</span>
                )}
              </div>

              <div className="flex-1 space-y-2 overflow-y-auto">
                {dayShifts.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-center py-8 text-[11px] text-ink-muted">
                    {lang === 'tr' ? 'Boş gün' : 'Keine Schichten'}
                  </div>
                ) : (
                  dayShifts.map((shift) => {
                    const emp = employees.find(e => e.id === shift.employeeId);
                    const isSick = shift.status === 'sick';

                    return (
                      <div
                        key={shift.id}
                        className={`p-2.5 rounded-xl border transition text-left flex flex-col justify-between ${
                          isSick
                            ? 'bg-subtle border-brand-border text-brand font-semibold'
                            : 'bg-subtle border-line text-ink'
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-1 mb-1.5">
                            <div className="flex items-center gap-1.5 truncate">
                              <img
                                src={emp?.avatar}
                                alt={emp?.name}
                                className="w-5 h-5 rounded-full object-cover shrink-0 ring-1 ring-line"
                              />
                              <span className="text-xs font-bold text-ink truncate">
                                {emp?.name.split(' ')[0]}
                              </span>
                            </div>
                            <button
                              onClick={() => handleDeleteShift(shift.id)}
                              className="text-subhead p-0.5 transition shrink-0"
                              title="Schicht löschen"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="mb-1.5">
                            {getShiftBadge(shift.shiftType)}
                          </div>

                          {shift.notes && (
                            <p className="text-[10px] text-subhead italic truncate mb-1">
                              {shift.notes}
                            </p>
                          )}
                        </div>

                        {isSick && (
                          <div className="mt-2 pt-2 border-t border-line-soft">
                            <div className="flex items-center gap-1 text-[10px] font-bold text-brand mb-1">
                              <AlertTriangle className="w-3 h-3 icon-brand text-brand" />
                              <span>KRANK: {shift.sickReason || 'Absenz'}</span>
                            </div>
                            <button
                              onClick={() => setShowReplaceModal(shift)}
                              className="w-full py-1 rounded-lg bg-subtle text-ink border border-line text-[10px] font-bold flex items-center justify-center gap-1 transition"
                            >
                              <UserCheck className="w-3 h-3 text-brand icon-brand" />
                              <span>{t.assignReplacement}</span>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs modal-backdrop">
          <div className="w-full max-w-md rounded-3xl bg-surface p-6 relative border border-line text-ink modal-container shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between border-b border-line-soft pb-3 mb-4">
              <h2 className="text-base font-bold text-ink flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-brand icon-brand" />
                <span>{t.addShift}</span>
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-subhead"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveShift} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-subhead mb-1">
                  {lang === 'tr' ? 'Çalışan Seçin' : 'Mitarbeiter wählen'}:
                </label>
                <select
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl card-inner border border-line text-ink text-xs focus:outline-none focus:border-brand"
                >
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.jobTitle})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-subhead mb-1">
                    {lang === 'tr' ? 'Vardiya Türü' : 'Schicht-Typ'}:
                  </label>
                  <select
                    value={formData.shiftType}
                    onChange={(e) => setFormData({ ...formData, shiftType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl card-inner border border-line text-ink text-xs focus:outline-none focus:border-brand"
                  >
                    <option value="frueh">Frühschicht (08:00 - 16:30)</option>
                    <option value="spaet">Spätschicht (16:00 - 00:30)</option>
                    <option value="ganztag">Ganztags / Split (10:00 - 22:30)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-subhead mb-1">
                    {lang === 'tr' ? 'Departman' : 'Abteilung'}:
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl card-inner border border-line text-ink text-xs focus:outline-none focus:border-brand"
                  >
                    {SEED_DEPARTMENTS.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-subhead mb-1">
                  {lang === 'tr' ? 'Tarih' : 'Datum'}:
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl card-inner border border-line text-ink text-xs focus:outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-subhead mb-1">
                  {lang === 'tr' ? 'Not / İstek' : 'Hinweis / Aufgaben'}:
                </label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder={lang === 'tr' ? 'Örn: Hazırlık & servis' : 'z.B. Vorbereitung & Abendservice'}
                  className="w-full px-3 py-2 rounded-xl card-inner border border-line text-ink text-xs focus:outline-none focus:border-brand"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl btn-brand font-black text-xs transition"
                >
                  {lang === 'tr' ? 'Vardiyayı Kaydet' : 'Schicht verbindlich eintragen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showReplaceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs modal-backdrop">
          <div className="w-full max-w-sm rounded-3xl bg-surface p-5 relative border border-line text-ink modal-container shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]">
            <h3 className="text-sm font-bold text-ink mb-2 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-brand icon-brand" />
              <span>{t.assignReplacement}</span>
            </h3>
            <p className="text-xs text-subhead mb-4">
              {lang === 'tr'
                ? 'Hasta olan personelin yerine çalışabilecek uygun elemanı seçin:'
                : 'Wählen Sie eine verfügbare Ersatzkraft für diese Schicht:'}
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1 mb-4">
              {employees
                .filter(e => e.id !== showReplaceModal.employeeId && e.role !== 'admin')
                .map(emp => (
                  <button
                    key={emp.id}
                    onClick={() => handleReplaceEmployee(showReplaceModal, emp.id)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl card-inner border border-line text-left transition text-xs"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <img
                        src={emp.avatar}
                        alt={emp.name}
                        className="w-6 h-6 rounded-full object-cover ring-1 ring-line"
                      />
                      <div className="truncate">
                        <p className="font-semibold text-ink truncate">{emp.name}</p>
                        <p className="text-[10px] text-subhead truncate">{emp.jobTitle}</p>
                      </div>
                    </div>
                    <span className="badge badge-brand text-[9px]">Zuteilen</span>
                  </button>
                ))}
            </div>

            <button
              onClick={() => setShowReplaceModal(null)}
              className="w-full py-2 rounded-xl card-inner text-xs font-bold text-ink border border-line transition"
            >
              {lang === 'tr' ? 'İptal' : 'Abbrechen'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
