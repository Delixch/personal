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

export const RoundClock = ({ currentTime, className = "" }) => {
  const hours = currentTime.getHours();
  const mins = currentTime.getMinutes();
  const secs = currentTime.getSeconds();

  const hourDeg = (hours % 12) * 30 + mins * 0.5;
  const minDeg = mins * 6 + secs * 0.1;
  const secDeg = secs * 6;

  const formattedHours = String(hours).padStart(2, '0');
  const formattedMins = String(mins).padStart(2, '0');
  const formattedSecs = String(secs).padStart(2, '0');

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      {/* Sleek Circular Swiss Analog Clock Face */}
      <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-b from-[#241715] to-[#140c0b] border-2 border-brand/40 shadow-[0_0_30px_rgba(249,115,22,0.25)] flex items-center justify-center group hover:border-brand transition-all duration-300">
        
        {/* Outer Ring Ticks */}
        <div className="absolute inset-1.5 rounded-full border border-brand/20" />
        
        {/* Cardinal Hour Numbers */}
        <span className="absolute top-2 text-[10px] font-mono font-black text-brand">12</span>
        <span className="absolute right-2 text-[10px] font-mono font-black text-ink-muted">3</span>
        <span className="absolute bottom-2 text-[10px] font-mono font-black text-ink-muted">6</span>
        <span className="absolute left-2 text-[10px] font-mono font-black text-ink-muted">9</span>

        {/* Center Pivot Point */}
        <div className="w-3 h-3 rounded-full bg-brand z-30 shadow-[0_0_10px_#f97316]" />

        {/* Hour Hand */}
        <div
          className="absolute top-1/2 left-1/2 w-1.5 h-7 bg-ink rounded-full origin-bottom z-10 transition-transform duration-300"
          style={{
            transform: `translate(-50%, -100%) rotate(${hourDeg}deg)`,
          }}
        />

        {/* Minute Hand */}
        <div
          className="absolute top-1/2 left-1/2 w-1 h-10 bg-slate-300 rounded-full origin-bottom z-20 transition-transform duration-300"
          style={{
            transform: `translate(-50%, -100%) rotate(${minDeg}deg)`,
          }}
        />

        {/* Second Hand (Glowing Neon Orange) */}
        <div
          className="absolute top-1/2 left-1/2 w-0.5 h-11 bg-brand rounded-full origin-bottom z-25 transition-transform duration-100 shadow-[0_0_8px_#f97316]"
          style={{
            transform: `translate(-50%, -100%) rotate(${secDeg}deg)`,
          }}
        />
      </div>

      {/* Digital Time Display Below */}
      <div className="font-mono text-sm sm:text-base font-black tracking-widest text-ink px-4 py-1.5 rounded-full bg-subtle border border-brand/30 flex items-center justify-center gap-1 shadow-sm">
        <Clock className="w-3.5 h-3.5 text-brand" />
        <span>{formattedHours}:{formattedMins}</span>
        <span className="text-brand text-xs font-bold animate-pulse">:{formattedSecs}</span>
      </div>
    </div>
  );
};

export const TimeTracker = ({ lang, currentUser }) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.de;
  const [timeLogs, setTimeLogs] = useState(StorageService.getTimeLogs());
  const [employees, setEmployees] = useState(StorageService.getEmployees());
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const [trackerMode, setTrackerMode] = useState('personal');

  const [pinDigits, setPinDigits] = useState('');
  const [kioskEmp, setKioskEmp] = useState(null);
  const [kioskFeedback, setKioskFeedback] = useState(null);

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

  const handlePinPress = (digit) => {
    if (kioskFeedback) setKioskFeedback(null);
    if (pinDigits.length < 4) {
      const nextPin = pinDigits + digit;
      setPinDigits(nextPin);

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

  return (
    <div className="space-y-6">

      <div className="p-6 sm:p-8 rounded-3xl bg-surface text-ink border border-line relative overflow-hidden mb-6 card-inner">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 items-center justify-between gap-6">
          {/* Left Column: Title */}
          <div className="space-y-2 text-center lg:text-left">
            <h1 className="page-title text-ink">
              {t.timeTrackerTitle}
            </h1>
            <p className="text-subhead text-ink-soft leading-relaxed mt-1">
              {lang === 'tr' ? (
                <>
                  Dokunmatik PIN terminali ile kartsız & e-postasız saniyelik giriş-çıkış.
                  <br />
                  (Kiosk mola takibi ve canlı mesai panosu)
                </>
              ) : (
                <>
                  Präzise Zeiterfassung via Touch-PIN Terminal
                  <br />
                  (Kiosk-Modus für Wand-Tablets) oder persönliche Stempeluhr.
                </>
              )}
            </p>
          </div>

          {/* Center Column: Round Clock Right in the Middle of the Card */}
          <div className="flex items-center justify-center my-2 lg:my-0">
            <RoundClock currentTime={currentTime} />
          </div>

          {/* Right Column: Mode Switchers */}
          <div className="w-full max-w-xs mx-auto lg:max-w-none lg:w-[180px] lg:ml-auto flex flex-col gap-2 shrink-0">
            <button
              onClick={() => setTrackerMode('personal')}
              className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                trackerMode === 'personal'
                  ? 'btn-brand font-black'
                  : 'card-inner text-ink-soft hover:text-ink hover:border-brand border border-line'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>{lang === 'tr' ? 'Profilim' : 'Persönlich'}</span>
            </button>

            <button
              onClick={() => setTrackerMode('kiosk')}
              className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                trackerMode === 'kiosk'
                  ? 'btn-brand font-black'
                  : 'card-inner text-ink-soft hover:text-ink hover:border-brand border border-line'
              }`}
            >
              <Tablet className="w-4 h-4" />
              <span>{lang === 'tr' ? 'Tablet PIN Terminali' : 'PIN Terminal (Kiosk)'}</span>
            </button>
          </div>
        </div>
      </div>

      {trackerMode === 'kiosk' && (
        <div className="max-w-xl mx-auto p-8 rounded-3xl bg-surface border border-line text-center card-inner">
          
          <div className="mb-6">
            <span className="badge badge-brand text-xs px-3 py-1 mb-2">
              ● WAND-TABLET STEMPELUHR
            </span>
            <h2 className="text-xl font-black text-ink">
              {lang === 'tr' ? '4 Haneli PIN Kodunuzu Tuşlayın' : 'Bitte 4-stelligen PIN eingeben'}
            </h2>
            <p className="text-xs text-subhead mt-0.5">
              {lang === 'tr'
                ? 'E-posta veya şifre gerekmez, doğrudan numpad ile damga basın.'
                : 'Keine E-Mail nötig – direkt per Touch-Keypad ein- und ausstempeln.'}
            </p>
          </div>

          {kioskFeedback && (
            <div className={`p-3 rounded-2xl mb-4 text-xs font-bold flex items-center justify-center gap-2 ${
              kioskFeedback.type === 'success'
                ? 'bg-subtle text-ink border border-line'
                : 'bg-subtle text-brand border border-brand-border'
            }`}>
              {kioskFeedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-brand icon-brand" /> : <AlertCircle className="w-4 h-4 text-brand icon-brand" />}
              <span>{kioskFeedback.message}</span>
            </div>
          )}

          {kioskEmp && !kioskFeedback ? (
            <div className="p-6 rounded-3xl card-inner border border-line mb-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <img
                  src={kioskEmp.avatar}
                  alt={kioskEmp.name}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-line"
                />
                <div className="text-left">
                  <h3 className="text-lg font-black text-ink">{kioskEmp.name}</h3>
                  <p className="text-xs text-brand font-bold">{kioskEmp.jobTitle}</p>
                </div>
              </div>

              <div className="mb-5">
                {kioskActiveLog ? (
                  <span className="badge badge-brand text-xs py-1 px-3">
                    ● AKTUELL IM DIENST (Seit {kioskActiveLog.clockIn} Uhr)
                  </span>
                ) : (
                  <span className="badge badge-neutral text-xs py-1 px-3">
                    NICHT IM DIENST (Bereit für Dienstbeginn)
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {!kioskActiveLog ? (
                  <button
                    onClick={() => handleKioskAction('in')}
                    className="col-span-full py-4 rounded-2xl btn-brand text-white text-sm font-extrabold flex items-center justify-center gap-2 -[1.02] transition"
                  >
                    <Play className="w-5 h-5 fill-white" />
                    <span>{lang === 'tr' ? '🟢 İşe Başla (Dienstbeginn)' : '🟢 Kommen (Dienstbeginn)'}</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleKioskAction('break')}
                      className="py-3.5 rounded-2xl card-inner text-ink border border-line font-bold text-xs flex items-center justify-center gap-1.5 transition"
                    >
                      <Coffee className="w-4 h-4 text-brand icon-brand" />
                      <span>{lang === 'tr' ? '☕ 30 Dk Mola' : '☕ 30m Pause'}</span>
                    </button>
                    <button
                      onClick={() => handleKioskAction('out')}
                      className="sm:col-span-2 py-3.5 rounded-2xl btn-brand font-extrabold text-xs flex items-center justify-center gap-1.5 transition"
                    >
                      <Square className="w-4 h-4 fill-white" />
                      <span>{lang === 'tr' ? '🔴 Çıkış Yap (Feierabend)' : '🔴 Gehen (Feierabend)'}</span>
                    </button>
                  </>
                )}
              </div>

              <button
                onClick={handleClearPin}
                className="mt-4 text-xs text-subhead underline font-medium"
              >
                {lang === 'tr' ? 'Vazgeç / Başka PIN' : 'Anderer Mitarbeiter / Zurück'}
              </button>
            </div>
          ) : (
            <div className="space-y-6">

              <div className="flex items-center justify-center gap-4 py-2">
                {[0, 1, 2, 3].map((idx) => {
                  const isFilled = pinDigits.length > idx;
                  return (
                    <div
                      key={idx}
                      className={`w-4 h-4 rounded-full transition-all ${
                        isFilled
                          ? 'bg-brand scale-125 ring-4 ring-brand-light'
                          : 'bg-subtle border border-line'
                      }`}
                    />
                  );
                })}
              </div>

              <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                  <button
                    key={num}
                    onClick={() => handlePinPress(num)}
                    className="h-16 rounded-2xl bg-ground active:card-inner border border-line text-ink text-2xl font-black transition"
                  >
                    {num}
                  </button>
                ))}
                
                <button
                  onClick={handleClearPin}
                  className="h-16 rounded-2xl card-inner border border-line text-brand text-xs font-bold transition flex items-center justify-center"
                >
                  C (Löschen)
                </button>
                
                <button
                  onClick={() => handlePinPress('0')}
                  className="h-16 rounded-2xl bg-ground active:card-inner border border-line text-ink text-2xl font-black transition"
                >
                  0
                </button>
                
                <button
                  onClick={() => {
                    if (pinDigits.length > 0) setPinDigits(pinDigits.slice(0, -1));
                  }}
                  className="h-16 rounded-2xl card-inner border border-line text-ink text-sm font-bold transition flex items-center justify-center"
                >
                  ⌫
                </button>
              </div>

              <div className="pt-4 border-t border-line-soft">
                <p className="text-[11px] text-subhead mb-2 font-medium">
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
                      className="px-2.5 py-1 rounded-xl card-inner text-ink text-[11px] font-semibold border border-line transition"
                    >
                      {e.name.split(' ')[0]}: <span className="font-mono font-bold text-brand">{e.pin}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {trackerMode === 'personal' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="bg-surface border border-line rounded-3xl p-6 flex flex-col justify-between card-inner">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={currentUser?.avatar}
                  alt={currentUser?.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-line"
                />
                <div>
                  <h3 className="font-bold text-base text-ink">{currentUser?.name}</h3>
                  <p className="text-xs text-brand font-semibold">{currentUser?.jobTitle}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl card-inner border border-line mb-6 text-center">
                <p className="text-xs text-subhead mb-1">
                  {lang === 'tr' ? 'Şu Anki Durum' : 'Aktueller Status'}
                </p>
                {currentLog ? (
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-extrabold mb-2">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                      </span>
                      <span>{lang === 'tr' ? 'ÇALIŞIYOR (GİRİŞ YAPILDI)' : 'EINGESTEMPELT / IM DIENST'}</span>
                    </span>
                    <p className="text-xs text-ink">
                      {lang === 'tr' ? 'Giriş Saati:' : 'Eingestempelt um:'}{' '}
                      <span className="font-mono font-bold text-ink">{currentLog.clockIn}</span>
                    </p>
                    {currentLog.breakMinutes > 0 && (
                      <p className="text-[11px] text-brand font-semibold mt-1">
                        ☕ {currentLog.breakMinutes} {lang === 'tr' ? 'dk mola düşüldü' : 'Min Pause erfasst'}
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    <span className="badge badge-neutral text-xs py-1 px-3 mb-2">
                      {lang === 'tr' ? 'GİRİŞ YAPILMADI' : 'NICHT IM DIENST'}
                    </span>
                    <p className="text-xs text-subhead">
                      {lang === 'tr' ? 'İşe başlamak için butona basın' : 'Bereit zum Einstempeln'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2.5">
              {!currentLog ? (
                <button
                  onClick={handleClockIn}
                  className="w-full py-3.5 rounded-2xl btn-brand font-extrabold text-sm flex items-center justify-center gap-2 transition"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>{t.clockIn}</span>
                </button>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={handleAddBreak}
                    className="w-full py-2.5 rounded-2xl card-inner text-ink border border-line font-bold text-xs flex items-center justify-center gap-2 transition"
                  >
                    <Coffee className="w-4 h-4 text-brand icon-brand" />
                    <span>{t.breakStart}</span>
                  </button>

                  <button
                    onClick={handleClockOut}
                    className="w-full py-3 rounded-2xl btn-brand font-extrabold text-xs flex items-center justify-center gap-2 transition"
                  >
                    <Square className="w-4 h-4 fill-white text-white" />
                    <span>{t.clockOut}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 bg-surface border border-line rounded-3xl p-6 card-inner">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-ink flex items-center gap-2">
                <Users className="w-4 h-4 text-brand icon-brand" />
                <span>{lang === 'tr' ? 'Personel Durum Panosu (Canlı)' : 'Live-Anwesenheitsliste'}</span>
              </h2>
              <span className="text-xs text-subhead">
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
                    className="p-3 rounded-2xl card-inner border border-line flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <img
                        src={emp.avatar}
                        alt={emp.name}
                        className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-line"
                      />
                      <div className="truncate">
                        <p className="text-xs font-bold text-ink truncate">{emp.name}</p>
                        <p className="text-[10px] text-subhead truncate">{emp.jobTitle}</p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      {activeLog ? (
                        <div>
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold tracking-wide">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span>{lang === 'tr' ? 'ÇALIŞIYOR' : 'IM DIENST'}</span>
                          </span>
                          <p className="text-[10px] font-mono text-subhead mt-0.5">
                            Seit {activeLog.clockIn}
                          </p>
                        </div>
                      ) : completedLog ? (
                        <div>
                          <span className="badge badge-neutral text-[9px] py-0 px-1.5">
                            FEIERABEND
                          </span>
                          <p className="text-[10px] font-mono text-subhead mt-0.5">
                            {calculateHoursWorked(completedLog.clockIn, completedLog.clockOut, completedLog.breakMinutes)} Std
                          </p>
                        </div>
                      ) : (
                        <span className="badge badge-neutral text-[9px] py-0 px-1.5">
                          ABWESEND
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-line-soft pt-4">
              <h3 className="text-xs font-bold text-ink uppercase tracking-wider mb-3">
                {lang === 'tr' ? 'Son Giriş-Çıkış Hareketleri' : 'Protokollierte Zeiterfassungen'}:
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-ink">
                  <thead className="border-b border-line text-[11px] text-subhead">
                    <tr>
                      <th className="pb-2">Mitarbeiter</th>
                      <th className="pb-2">Kommen</th>
                      <th className="pb-2">Gehen</th>
                      <th className="pb-2">Pause</th>
                      <th className="pb-2">Netto Std</th>
                      <th className="pb-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line-soft">
                    {timeLogs.slice(0, 5).map((log) => {
                      const emp = employees.find(e => e.id === log.employeeId);
                      const hours = calculateHoursWorked(log.clockIn, log.clockOut, log.breakMinutes);
                      return (
                        <tr key={log.id} className="">
                          <td className="py-2.5 font-semibold text-ink">{emp?.name || 'Mitarbeiter'}</td>
                          <td className="py-2.5 font-mono">{log.clockIn}</td>
                          <td className="py-2.5 font-mono">{log.clockOut || '-'}</td>
                          <td className="py-2.5 font-mono">{log.breakMinutes || 0} min</td>
                          <td className="py-2.5 font-mono font-bold text-brand">{hours} h</td>
                          <td className="py-2.5">
                            {log.status === 'working' ? (
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold">
                                <span className="relative flex h-1.5 w-1.5">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                                </span>
                                <span>{lang === 'tr' ? 'Devam Ediyor' : 'Laufend'}</span>
                              </span>
                            ) : (
                              <span className="badge badge-neutral py-0 px-1.5 text-[9px]">Abgeschlossen</span>
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
