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
      case 'kuche': return <ChefHat className="w-3.5 h-3.5 text-emerald-600" />;
      case 'service': return <UtensilsCrossed className="w-3.5 h-3.5 text-blue-600" />;
      case 'bar': return <Wine className="w-3.5 h-3.5 text-purple-600" />;
      case 'lager': return <Boxes className="w-3.5 h-3.5 text-amber-600" />;
      default: return <Sparkles className="w-3.5 h-3.5 text-rose-600" />;
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
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl glass-panel relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold mb-2">
              <CalendarDays className="w-3.5 h-3.5 text-blue-600" />
              <span>{lang === 'tr' ? '2 Vardiyalı Dinamik Personel Çizelgesi' : '2-Schichten Personaleinsatzplanung'}</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {t.shiftTitle}
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl">
              {t.shiftSubtitle}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setWeekOffset(prev => prev - 1)}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm transition"
              title="Vorherige Woche"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setWeekOffset(0)}
              className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 shadow-sm transition"
            >
              {lang === 'tr' ? 'Bu Hafta' : 'Diese Woche'}
            </button>
            <button
              onClick={() => setWeekOffset(prev => prev + 1)}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm transition"
              title="Nächste Woche"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="ml-2 px-4 py-2 rounded-xl gradient-btn-emerald font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>{t.addShift}</span>
            </button>
          </div>
        </div>

        {/* Sick Alert Warning Bar if any */}
        {sickAlerts.length > 0 && (
          <div className="mt-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between gap-3 text-rose-900 text-xs shadow-sm">
            <div className="flex items-center gap-2 font-bold">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
              <span>
                {lang === 'tr'
                  ? `DİKKAT: ${sickAlerts.length} vardiyada hastalık bildirimi var! Lütfen yerine yedek personel atayın.`
                  : `ACHTUNG: ${sickAlerts.length} Schichtausfall durch Krankmeldung! Bitte Ersatzkraft zuteilen.`}
              </span>
            </div>
          </div>
        )}

        {/* Department Filters */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedDept('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
              selectedDept === 'all'
                ? 'bg-blue-50 border-blue-300 text-blue-900 font-bold'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {lang === 'tr' ? 'Tüm Departmanlar' : 'Alle Abteilungen'}
          </button>
          {SEED_DEPARTMENTS.map(dept => (
            <button
              key={dept.id}
              onClick={() => setSelectedDept(dept.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border flex items-center gap-1.5 ${
                selectedDept === dept.id
                  ? 'bg-blue-50 border-blue-300 text-blue-900 font-bold'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {getDepartmentIcon(dept.id)}
              <span>{dept.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 7-Day Weekly Grid */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {weekDays.map((dateStr, idx) => {
          const dayName = lang === 'tr' ? dayNamesTr[idx] : dayNamesDe[idx];
          const isToday = dateStr === new Date().toISOString().split('T')[0];
          const dayShifts = filteredShifts.filter(s => s.date === dateStr);

          return (
            <div
              key={dateStr}
              className={`rounded-2xl border p-3 flex flex-col min-h-[360px] ${
                isToday
                  ? 'bg-emerald-50/40 border-emerald-300 shadow-sm'
                  : 'bg-white border-slate-200'
              }`}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2.5">
                <div>
                  <span className={`text-xs font-extrabold uppercase ${isToday ? 'text-emerald-800' : 'text-slate-800'}`}>
                    {dayName}
                  </span>
                  <p className="text-[11px] text-slate-500">{formatDate(dateStr)}</p>
                </div>
                {isToday && (
                  <span className="badge badge-emerald py-0 px-1.5 text-[9px]">HEUTE</span>
                )}
              </div>

              {/* Day Shifts List */}
              <div className="flex-1 space-y-2 overflow-y-auto">
                {dayShifts.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-center py-8 text-[11px] text-slate-400">
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
                            ? 'bg-rose-50 border-rose-300 text-rose-900'
                            : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-800'
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-1 mb-1.5">
                            <div className="flex items-center gap-1.5 truncate">
                              <img
                                src={emp?.avatar}
                                alt={emp?.name}
                                className="w-5 h-5 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
                              />
                              <span className="text-xs font-bold text-slate-900 truncate">
                                {emp?.name.split(' ')[0]}
                              </span>
                            </div>
                            <button
                              onClick={() => handleDeleteShift(shift.id)}
                              className="text-slate-400 hover:text-rose-600 p-0.5 transition shrink-0"
                              title="Schicht löschen"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="mb-1.5">
                            {getShiftBadge(shift.shiftType)}
                          </div>

                          {shift.notes && (
                            <p className="text-[10px] text-slate-500 italic truncate mb-1">
                              {shift.notes}
                            </p>
                          )}
                        </div>

                        {/* Sick Alert & Reassign Button */}
                        {isSick && (
                          <div className="mt-2 pt-2 border-t border-rose-200">
                            <div className="flex items-center gap-1 text-[10px] font-bold text-rose-700 mb-1">
                              <AlertTriangle className="w-3 h-3" />
                              <span>KRANK: {shift.sickReason || 'Absenz'}</span>
                            </div>
                            <button
                              onClick={() => setShowReplaceModal(shift)}
                              className="w-full py-1 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-300 text-[10px] font-bold flex items-center justify-center gap-1 transition"
                            >
                              <UserCheck className="w-3 h-3" />
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

      {/* Add Shift Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl relative border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-emerald-600" />
                <span>{t.addShift}</span>
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveShift} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'tr' ? 'Çalışan Seçin' : 'Mitarbeiter wählen'}:
                </label>
                <select
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-emerald-500"
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'tr' ? 'Vardiya Türü' : 'Schicht-Typ'}:
                  </label>
                  <select
                    value={formData.shiftType}
                    onChange={(e) => setFormData({ ...formData, shiftType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-emerald-500"
                  >
                    <option value="frueh">Frühschicht (08:00 - 16:30)</option>
                    <option value="spaet">Spätschicht (16:00 - 00:30)</option>
                    <option value="ganztag">Ganztags / Split (10:00 - 22:30)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'tr' ? 'Departman' : 'Abteilung'}:
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-emerald-500"
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'tr' ? 'Tarih' : 'Datum'}:
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'tr' ? 'Not / İstek' : 'Hinweis / Aufgaben'}:
                </label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder={lang === 'tr' ? 'Örn: Hazırlık & servis' : 'z.B. Vorbereitung & Abendservice'}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl gradient-btn-emerald font-bold text-xs transition shadow-sm"
                >
                  {lang === 'tr' ? 'Vardiyayı Kaydet' : 'Schicht verbindlich eintragen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Replace Employee Modal */}
      {showReplaceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl relative border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>{t.assignReplacement}</span>
            </h3>
            <p className="text-xs text-slate-600 mb-4">
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
                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-left transition text-xs"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <img
                        src={emp.avatar}
                        alt={emp.name}
                        className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200"
                      />
                      <div className="truncate">
                        <p className="font-semibold text-slate-900 truncate">{emp.name}</p>
                        <p className="text-[10px] text-slate-500 truncate">{emp.jobTitle}</p>
                      </div>
                    </div>
                    <span className="badge badge-emerald text-[9px]">Zuteilen</span>
                  </button>
                ))}
            </div>

            <button
              onClick={() => setShowReplaceModal(null)}
              className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition"
            >
              {lang === 'tr' ? 'İptal' : 'Abbrechen'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
