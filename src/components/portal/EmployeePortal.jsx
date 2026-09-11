import React, { useState } from 'react';
import {
  Clock,
  HeartPulse,
  Palmtree,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Play,
  Square,
  Coffee,
  ChevronRight,
  ShieldCheck,
  User
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { StorageService } from '../../services/storage';
import { SHIFT_TYPES } from '../../services/seedData';
import { formatDate, calculateHoursWorked } from '../../utils/formatters';

export const EmployeePortal = ({ lang, currentUser, onNavigate }) => {
  const [timeLogs, setTimeLogs] = useState(StorageService.getTimeLogs());
  const [shifts, setShifts] = useState(StorageService.getShifts());
  const [employees, setEmployees] = useState(StorageService.getEmployees());

  const todayStr = new Date().toISOString().split('T')[0];

  const activeLog = timeLogs.find(
    l => l.employeeId === currentUser?.id && l.date === todayStr && !l.clockOut
  );

  const myShifts = shifts
    .filter(s => s.employeeId === currentUser?.id && s.date >= todayStr)
    .sort((a, b) => a.date.localeCompare(b.date));

  const myEmp = employees.find(e => e.id === currentUser?.id) || currentUser;
  const vacationRemaining = (myEmp?.vacationTotal || 25) - (myEmp?.vacationUsed || 0);

  const handleClockIn = () => {
    StorageService.clockIn(currentUser.id);
    setTimeLogs(StorageService.getTimeLogs());
    confetti({ particleCount: 40, spread: 45, origin: { y: 0.7 } });
  };

  const handleClockOut = () => {
    StorageService.clockOut(currentUser.id);
    setTimeLogs(StorageService.getTimeLogs());
  };

  const handleBreak = () => {
    StorageService.addBreakTime(currentUser.id, 30);
    setTimeLogs(StorageService.getTimeLogs());
  };

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-200 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="badge badge-emerald text-xs">
                  {lang === 'tr' ? 'Çalışan Portalı' : 'Mitarbeiter-Portal'}
                </span>
                <span className="text-xs text-slate-500">
                  {formatDate(todayStr)}
                </span>
              </div>
              <h1 className="text-2xl font-black text-slate-900">
                {lang === 'tr' ? `Hoş Geldin, ${currentUser?.name.split(' ')[0]}!` : `Willkommen, ${currentUser?.name.split(' ')[0]}!`}
              </h1>
              <p className="text-xs text-emerald-700 font-semibold">
                {currentUser?.jobTitle} · Abteilung: {currentUser?.department?.toUpperCase()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('sickLeave')}
              className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
            >
              <HeartPulse className="w-4 h-4 text-rose-600" />
              <span>{lang === 'tr' ? 'Hastalık Bildir (Krankmeldung)' : 'Krankmeldung abgeben'}</span>
            </button>
            <button
              onClick={() => onNavigate('sickLeave')}
              className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
            >
              <Palmtree className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'tr' ? 'İzin İste (Urlaub)' : 'Urlaub anfragen'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Punch Clock Card for Employee */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Stempeluhr Widget */}
        <div className="glass-panel p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>{lang === 'tr' ? 'Giriş-Çıkış Zamanı (Stempeluhr)' : 'Meine Stempeluhr'}</span>
              </h3>
              <span className="badge badge-emerald py-0 px-2 text-[10px]">LIVE</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center mb-6">
              <p className="text-xs text-slate-500 mb-1">
                {lang === 'tr' ? 'Çalışma Durumu' : 'Status heute'}
              </p>
              {activeLog ? (
                <div>
                  <span className="badge badge-emerald text-xs py-1 px-3 mb-2">
                    ● IM DIENST
                  </span>
                  <p className="text-xs text-slate-900 font-mono font-bold">
                    Eingestempelt: {activeLog.clockIn} Uhr
                  </p>
                  {activeLog.breakMinutes > 0 && (
                    <p className="text-[11px] text-amber-800 font-semibold mt-1">
                      ☕ {activeLog.breakMinutes} Min Pause
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <span className="badge badge-slate text-xs py-1 px-3 mb-2">
                    NICHT EINGESTEMPELT
                  </span>
                  <p className="text-xs text-slate-500">
                    {lang === 'tr' ? 'Giriş yapmak için butona tıklayın' : 'Bereit für Dienstbeginn'}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div>
            {!activeLog ? (
              <button
                onClick={handleClockIn}
                className="w-full py-3.5 rounded-2xl gradient-btn-emerald font-extrabold text-xs flex items-center justify-center gap-2 transition shadow-sm"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{lang === 'tr' ? 'İşe Başla (Einstempeln)' : 'Jetzt Einstempeln (Start)'}</span>
              </button>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={handleBreak}
                  className="w-full py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold flex items-center justify-center gap-2 transition"
                >
                  <Coffee className="w-4 h-4 text-amber-700" />
                  <span>30 Min Pause</span>
                </button>
                <button
                  onClick={handleClockOut}
                  className="w-full py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 text-xs font-bold flex items-center justify-center gap-2 transition"
                >
                  <Square className="w-4 h-4 fill-rose-700 text-rose-700" />
                  <span>{lang === 'tr' ? 'İşi Bitir (Ausstempeln)' : 'Jetzt Ausstempeln (Ende)'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Next Shifts List */}
        <div className="md:col-span-2 glass-panel p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>{lang === 'tr' ? 'Yaklaşan Vardiyalarım (2 Vardiya)' : 'Meine anstehenden Schichten'}</span>
            </h3>
            <button
              onClick={() => onNavigate('shifts')}
              className="text-xs text-emerald-700 font-semibold hover:underline flex items-center gap-1"
            >
              <span>{lang === 'tr' ? 'Tam Çizelge' : 'Gesamter Dienstplan'}</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5">
            {myShifts.length === 0 ? (
              <p className="text-center py-8 text-xs text-slate-400">
                {lang === 'tr' ? 'Planlanmış gelecek vardiyanız yok.' : 'Keine anstehenden Schichten eingetragen.'}
              </p>
            ) : (
              myShifts.slice(0, 4).map((shift) => {
                const shiftInfo = SHIFT_TYPES[shift.shiftType.toUpperCase()] || SHIFT_TYPES.FRUEH;
                const isSick = shift.status === 'sick';

                return (
                  <div
                    key={shift.id}
                    className={`p-3 rounded-2xl border flex items-center justify-between gap-3 ${
                      isSick
                        ? 'bg-rose-50 border-rose-200 text-rose-900'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-bold text-xs text-slate-900">
                          {formatDate(shift.date)}
                        </span>
                        <span className={`badge badge-${shiftInfo.badgeColor} text-[10px] py-0 px-2`}>
                          {shiftInfo.name}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {shift.notes || 'Reguläre Schicht'}
                      </p>
                    </div>

                    <div className="text-right font-mono text-xs text-emerald-700 font-bold">
                      {shiftInfo.start} - {shiftInfo.end}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Vacation Balance Summary */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">
              {lang === 'tr' ? 'Kalan Yıllık İzin Hakkınız:' : 'Ihr Resturlaubsanspruch:'}
            </span>
            <span className="font-mono font-black text-emerald-700 text-sm">
              {vacationRemaining} {lang === 'tr' ? 'Gün' : 'Tage'}
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
