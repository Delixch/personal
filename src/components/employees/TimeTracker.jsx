import React, { useState, useEffect } from 'react';
import {
  Clock,
  Play,
  Square,
  Coffee,
  CheckCircle2,
  AlertCircle,
  History,
  Timer,
  Calendar,
  Users
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { StorageService } from '../../services/storage';
import { formatDate, calculateHoursWorked } from '../../utils/formatters';
import { TRANSLATIONS } from '../../utils/translations';

export const TimeTracker = ({ lang, currentUser }) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.de;
  const [timeLogs, setTimeLogs] = useState(StorageService.getTimeLogs());
  const [employees, setEmployees] = useState(StorageService.getEmployees());
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const todayStr = currentTime.toISOString().split('T')[0];

  const currentLog = timeLogs.find(
    l => l.employeeId === currentUser?.id && l.date === todayStr && !l.clockOut
  );

  const handleClockIn = () => {
    if (!currentUser) return;
    StorageService.clockIn(currentUser.id);
    setTimeLogs(StorageService.getTimeLogs());
    confetti({
      particleCount: 40,
      spread: 45,
      origin: { y: 0.7 }
    });
  };

  const handleClockOut = () => {
    if (!currentUser) return;
    StorageService.clockOut(currentUser.id);
    setTimeLogs(StorageService.getTimeLogs());
  };

  const handleAddBreak = () => {
    if (!currentUser) return;
    StorageService.addBreakTime(currentUser.id, 30);
    setTimeLogs(StorageService.getTimeLogs());
  };

  const formattedHours = String(currentTime.getHours()).padStart(2, '0');
  const formattedMins = String(currentTime.getMinutes()).padStart(2, '0');
  const formattedSecs = String(currentTime.getSeconds()).padStart(2, '0');

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl glass-panel relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-semibold mb-2">
              <Timer className="w-3.5 h-3.5 text-cyan-600" />
              <span>Digitale Stempeluhr & Arbeitszeiterfassung</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {t.timeTrackerTitle}
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl">
              {lang === 'tr'
                ? 'Gerçek zamanlı giriş, çıkış ve mola takibi, fazla mesai hesaplayıcı.'
                : 'Präzise Zeiterfassung, Pausensteuerung und automatische Überstundenberechnung.'}
            </p>
          </div>

          {/* Live Digital Clock - Light Clean */}
          <div className="bg-slate-50 border border-slate-200 px-5 py-3 rounded-2xl flex items-center gap-3 shadow-sm">
            <Clock className="w-5 h-5 text-emerald-600" />
            <div className="font-mono text-xl md:text-2xl font-black tracking-widest text-slate-900">
              {formattedHours}:{formattedMins}:<span className="text-emerald-600">{formattedSecs}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: My Stempeluhr & Live Staff Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Current Employee Punch Card */}
        <div className="glass-panel p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src={currentUser?.avatar}
                alt={currentUser?.name}
                className="w-12 h-12 rounded-2xl object-cover ring-2 ring-emerald-200"
              />
              <div>
                <h3 className="font-bold text-base text-slate-900">{currentUser?.name}</h3>
                <p className="text-xs text-emerald-700 font-semibold">{currentUser?.jobTitle}</p>
              </div>
            </div>

            {/* Status Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-6 text-center">
              <p className="text-xs text-slate-500 mb-1">
                {lang === 'tr' ? 'Şu Anki Durum' : 'Aktueller Status'}
              </p>
              {currentLog ? (
                <div>
                  <span className="badge badge-emerald text-xs py-1 px-3 mb-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                    {lang === 'tr' ? 'ÇALIŞIYOR (GİRİŞ YAPILDI)' : 'EINGESTEMPELT / IM DIENST'}
                  </span>
                  <p className="text-xs text-slate-700">
                    {lang === 'tr' ? 'Giriş Saati:' : 'Eingestempelt um:'}{' '}
                    <span className="font-mono font-bold text-slate-900">{currentLog.clockIn}</span>
                  </p>
                  {currentLog.breakMinutes > 0 && (
                    <p className="text-[11px] text-amber-800 font-semibold mt-1">
                      ☕ {currentLog.breakMinutes} {lang === 'tr' ? 'dk mola düşüldü' : 'Min Pause erfasst'}
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <span className="badge badge-slate text-xs py-1 px-3 mb-2">
                    {lang === 'tr' ? 'GİRİŞ YAPILMADI' : 'NICHT IM DIENST'}
                  </span>
                  <p className="text-xs text-slate-500">
                    {lang === 'tr' ? 'İşe başlamak için butona basın' : 'Bereit zum Einstempeln'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5">
            {!currentLog ? (
              <button
                onClick={handleClockIn}
                className="w-full py-3.5 rounded-2xl gradient-btn-emerald font-extrabold text-sm flex items-center justify-center gap-2 transition shadow-sm"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{t.clockIn}</span>
              </button>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={handleAddBreak}
                  className="w-full py-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs flex items-center justify-center gap-2 transition"
                >
                  <Coffee className="w-4 h-4 text-amber-700" />
                  <span>{t.breakStart}</span>
                </button>

                <button
                  onClick={handleClockOut}
                  className="w-full py-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 font-extrabold text-xs flex items-center justify-center gap-2 transition"
                >
                  <Square className="w-4 h-4 fill-rose-700 text-rose-700" />
                  <span>{t.clockOut}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right 2 Columns: Live Presence Board */}
        <div className="lg:col-span-2 glass-panel p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'tr' ? 'Personel Durum Panosu (Canlı)' : 'Live-Anwesenheitsliste'}</span>
            </h2>
            <span className="text-xs text-slate-500">
              {formatDate(todayStr)}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {employees.filter(e => e.role !== 'admin').map((emp) => {
              const activeLog = timeLogs.find(
                l => l.employeeId === emp.id && l.date === todayStr && !l.clockOut
              );
              const completedLog = timeLogs.find(
                l => l.employeeId === emp.id && l.date === todayStr && l.clockOut
              );

              return (
                <div
                  key={emp.id}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <img
                      src={emp.avatar}
                      alt={emp.name}
                      className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
                    />
                    <div className="truncate">
                      <p className="text-xs font-bold text-slate-900 truncate">{emp.name}</p>
                      <p className="text-[10px] text-slate-500 truncate">{emp.jobTitle}</p>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    {activeLog ? (
                      <div>
                        <span className="badge badge-emerald text-[9px] py-0 px-1.5">
                          ● IM DIENST
                        </span>
                        <p className="text-[10px] font-mono text-slate-500 mt-0.5">
                          Seit {activeLog.clockIn}
                        </p>
                      </div>
                    ) : completedLog ? (
                      <div>
                        <span className="badge badge-blue text-[9px] py-0 px-1.5">
                          FEIERABEND
                        </span>
                        <p className="text-[10px] font-mono text-slate-500 mt-0.5">
                          {calculateHoursWorked(completedLog.clockIn, completedLog.clockOut, completedLog.breakMinutes)} Std
                        </p>
                      </div>
                    ) : (
                      <span className="badge badge-slate text-[9px] py-0 px-1.5">
                        ABWESEND
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Today's Log Table */}
          <div className="border-t border-slate-100 pt-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              {lang === 'tr' ? 'Son Giriş-Çıkış Hareketleri' : 'Protokollierte Zeiterfassungen'}:
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="border-b border-slate-100 text-[11px] text-slate-400">
                  <tr>
                    <th className="pb-2">Mitarbeiter</th>
                    <th className="pb-2">Kommen</th>
                    <th className="pb-2">Gehen</th>
                    <th className="pb-2">Pause</th>
                    <th className="pb-2">Netto Std</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {timeLogs.slice(0, 5).map((log) => {
                    const emp = employees.find(e => e.id === log.employeeId);
                    const hours = calculateHoursWorked(log.clockIn, log.clockOut, log.breakMinutes);
                    return (
                      <tr key={log.id} className="hover:bg-slate-50">
                        <td className="py-2.5 font-semibold text-slate-900">{emp?.name || 'Mitarbeiter'}</td>
                        <td className="py-2.5 font-mono">{log.clockIn}</td>
                        <td className="py-2.5 font-mono">{log.clockOut || '-'}</td>
                        <td className="py-2.5 font-mono">{log.breakMinutes || 0} min</td>
                        <td className="py-2.5 font-mono font-bold text-emerald-700">{hours} h</td>
                        <td className="py-2.5">
                          {log.status === 'working' ? (
                            <span className="badge badge-emerald py-0 px-1.5 text-[9px]">Laufend</span>
                          ) : (
                            <span className="badge badge-slate py-0 px-1.5 text-[9px]">Abgeschlossen</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
