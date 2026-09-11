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
  Users,
  Delete,
  Check,
  Sparkles,
  Smartphone,
  Tablet
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
  
  // Tracker Mode: 'personal' | 'kiosk'
  const [trackerMode, setTrackerMode] = useState('personal');

  // Kiosk Mode States
  const [pinDigits, setPinDigits] = useState('');
  const [kioskEmp, setKioskEmp] = useState(null);
  const [kioskFeedback, setKioskFeedback] = useState(null); // { type: 'success'|'error', message: '' }

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

  // Kiosk PIN Keypad Logic
  const handlePinPress = (digit) => {
    if (kioskFeedback) setKioskFeedback(null);
    if (pinDigits.length < 4) {
      const nextPin = pinDigits + digit;
      setPinDigits(nextPin);

      // Auto-validate on 4 digits
      if (nextPin.length === 4) {
        const found = employees.find(e => e.pin === nextPin || (e.role === 'admin' && nextPin === '9999'));
        if (found) {
          setKioskEmp(found);
        } else {
          setKioskFeedback({
            type: 'error',
            message: lang === 'tr' ? 'PIN bulunamadı! (Örnek: 1001-1006)' : 'PIN nicht gefunden! (Demo-PINs: 1001-1006 / 9999)'
          });
          setTimeout(() => {
            setPinDigits('');
            setKioskFeedback(null);
          }, 2000);
        }
      }
    }
  };

  const handleClearPin = () => {
    setPinDigits('');
    setKioskEmp(null);
    setKioskFeedback(null);
  };

  const handleKioskAction = (action) => {
    if (!kioskEmp) return;
    const res = StorageService.clockWithPin(kioskEmp.pin, action);
    if (res.success) {
      setTimeLogs(StorageService.getTimeLogs());
      confetti({ particleCount: 50, spread: 55, origin: { y: 0.6 } });

      let actionText = '';
      if (action === 'in') actionText = lang === 'tr' ? 'Giriş Başarılı! İyi çalışmalar,' : 'Dienstbeginn erfasst! Guten Dienst,';
      if (action === 'out') actionText = lang === 'tr' ? 'Çıkış Yapıldı! İyi akşamlar,' : 'Feierabend erfasst! Schönen Feierabend,';
      if (action === 'break') actionText = lang === 'tr' ? '30 Dk Mola Kaydedildi,' : '30 Min Pause erfasst,';

      setKioskFeedback({
        type: 'success',
        message: `${actionText} ${kioskEmp.name.split(' ')[0]}!`
      });

      // Auto reset after 3 seconds
      setTimeout(() => {
        setPinDigits('');
        setKioskEmp(null);
        setKioskFeedback(null);
      }, 3000);
    }
  };

  const kioskActiveLog = kioskEmp ? timeLogs.find(
    l => l.employeeId === kioskEmp.id && l.date === todayStr && !l.clockOut
  ) : null;

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
                ? 'Dokunmatik PIN terminali ile kartsız & e-postasız saniyelik giriş-çıkış, mola takibi ve canlı mesai panosu.'
                : 'Präzise Zeiterfassung via Touch-PIN Terminal (Kiosk-Modus für Wand-Tablets) oder persönliche Stempeluhr.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Mode Switcher */}
            <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
              <button
                onClick={() => setTrackerMode('personal')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  trackerMode === 'personal'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>{lang === 'tr' ? 'Profilim' : 'Persönlich'}</span>
              </button>
              <button
                onClick={() => setTrackerMode('kiosk')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  trackerMode === 'kiosk'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Tablet className="w-3.5 h-3.5" />
                <span>{lang === 'tr' ? 'Tablet PIN Terminali' : 'PIN Terminal (Kiosk)'}</span>
              </button>
            </div>

            {/* Live Digital Clock */}
            <div className="bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-2xl flex items-center gap-2.5 shadow-sm">
              <Clock className="w-4 h-4 text-emerald-600" />
              <div className="font-mono text-lg md:text-xl font-black tracking-wider text-slate-900">
                {formattedHours}:{formattedMins}:<span className="text-emerald-600">{formattedSecs}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODE 1: TABLET PIN TERMINAL (KIOSK) */}
      {trackerMode === 'kiosk' && (
        <div className="max-w-xl mx-auto p-8 rounded-3xl bg-white border border-slate-200 shadow-lg text-center">
          
          <div className="mb-6">
            <span className="badge badge-emerald text-xs px-3 py-1 mb-2">
              ● WAND-TABLET STEMPELUHR
            </span>
            <h2 className="text-xl font-black text-slate-900">
              {lang === 'tr' ? '4 Haneli PIN Kodunuzu Tuşlayın' : 'Bitte 4-stelligen PIN eingeben'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {lang === 'tr'
                ? 'E-posta veya şifre gerekmez, doğrudan numpad ile damga basın.'
                : 'Keine E-Mail nötig – direkt per Touch-Keypad ein- und ausstempeln.'}
            </p>
          </div>

          {/* Feedback Message */}
          {kioskFeedback && (
            <div className={`p-3 rounded-2xl mb-4 text-xs font-bold flex items-center justify-center gap-2 animate-in fade-in ${
              kioskFeedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                : 'bg-rose-50 text-rose-800 border border-rose-300'
            }`}>
              {kioskFeedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
              <span>{kioskFeedback.message}</span>
            </div>
          )}

          {/* If Employee is Identified by PIN */}
          {kioskEmp && !kioskFeedback ? (
            <div className="p-6 rounded-3xl bg-emerald-50/50 border border-emerald-200 mb-6 animate-in zoom-in-95">
              <div className="flex items-center justify-center gap-3 mb-4">
                <img
                  src={kioskEmp.avatar}
                  alt={kioskEmp.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-400 shadow-sm"
                />
                <div className="text-left">
                  <h3 className="text-lg font-black text-slate-900">{kioskEmp.name}</h3>
                  <p className="text-xs text-emerald-800 font-bold">{kioskEmp.jobTitle}</p>
                </div>
              </div>

              <div className="mb-5">
                {kioskActiveLog ? (
                  <span className="badge badge-emerald text-xs py-1 px-3">
                    ● AKTUELL IM DIENST (Seit {kioskActiveLog.clockIn} Uhr)
                  </span>
                ) : (
                  <span className="badge badge-slate text-xs py-1 px-3">
                    NICHT IM DIENST (Bereit für Dienstbeginn)
                  </span>
                )}
              </div>

              {/* Big Touch Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {!kioskActiveLog ? (
                  <button
                    onClick={() => handleKioskAction('in')}
                    className="col-span-full py-4 rounded-2xl gradient-btn-emerald text-white text-sm font-extrabold flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] transition"
                  >
                    <Play className="w-5 h-5 fill-white" />
                    <span>{lang === 'tr' ? '🟢 İşe Başla (Dienstbeginn)' : '🟢 Kommen (Dienstbeginn)'}</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleKioskAction('break')}
                      className="py-3.5 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
                    >
                      <Coffee className="w-4 h-4 text-amber-700" />
                      <span>{lang === 'tr' ? '☕ 30 Dk Mola' : '☕ 30m Pause'}</span>
                    </button>
                    <button
                      onClick={() => handleKioskAction('out')}
                      className="sm:col-span-2 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
                    >
                      <Square className="w-4 h-4 fill-white" />
                      <span>{lang === 'tr' ? '🔴 Çıkış Yap (Feierabend)' : '🔴 Gehen (Feierabend)'}</span>
                    </button>
                  </>
                )}
              </div>

              <button
                onClick={handleClearPin}
                className="mt-4 text-xs text-slate-400 hover:text-slate-600 underline font-medium"
              >
                {lang === 'tr' ? 'Vazgeç / Başka PIN' : 'Anderer Mitarbeiter / Zurück'}
              </button>
            </div>
          ) : (
            /* Touch PIN Display & Keypad */
            <div className="space-y-6">
              
              {/* PIN Dots Display */}
              <div className="flex items-center justify-center gap-4 py-2">
                {[0, 1, 2, 3].map((idx) => {
                  const isFilled = pinDigits.length > idx;
                  return (
                    <div
                      key={idx}
                      className={`w-4 h-4 rounded-full transition-all duration-200 ${
                        isFilled
                          ? 'bg-emerald-600 scale-125 ring-4 ring-emerald-100'
                          : 'bg-slate-200'
                      }`}
                    />
                  );
                })}
              </div>

              {/* Touch Numpad */}
              <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                  <button
                    key={num}
                    onClick={() => handlePinPress(num)}
                    className="h-16 rounded-2xl bg-slate-50 hover:bg-emerald-50 active:bg-emerald-100 border border-slate-200 text-slate-800 text-2xl font-black shadow-xs transition hover:border-emerald-300"
                  >
                    {num}
                  </button>
                ))}
                
                <button
                  onClick={handleClearPin}
                  className="h-16 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold transition flex items-center justify-center"
                >
                  C (Löschen)
                </button>
                
                <button
                  onClick={() => handlePinPress('0')}
                  className="h-16 rounded-2xl bg-slate-50 hover:bg-emerald-50 active:bg-emerald-100 border border-slate-200 text-slate-800 text-2xl font-black shadow-xs transition hover:border-emerald-300"
                >
                  0
                </button>
                
                <button
                  onClick={() => {
                    if (pinDigits.length > 0) setPinDigits(pinDigits.slice(0, -1));
                  }}
                  className="h-16 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-sm font-bold transition flex items-center justify-center"
                >
                  ⌫
                </button>
              </div>

              {/* Demo Helper Chips */}
              <div className="pt-4 border-t border-slate-100">
                <p className="text-[11px] text-slate-400 mb-2 font-medium">
                  {lang === 'tr' ? 'Hızlı Test PIN Kodları:' : 'Demo PIN-Schnellauswahl:'}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-1.5">
                  {employees.slice(0, 5).map(e => (
                    <button
                      key={e.id}
                      onClick={() => {
                        setPinDigits(e.pin);
                        setKioskEmp(e);
                      }}
                      className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 text-[11px] font-semibold border border-slate-200 transition"
                    >
                      {e.name.split(' ')[0]}: <span className="font-mono font-bold text-emerald-700">{e.pin}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* MODE 2: PERSONAL DASHBOARD + STAFF BOARD */}
      {trackerMode === 'personal' && (
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
      )}

    </div>
  );
};
