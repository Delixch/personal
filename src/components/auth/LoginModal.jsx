import React, { useState } from 'react';
import { KeyRound, Mail, X, ShieldCheck, Check, AlertCircle, Hash, Sparkles, Building2 } from 'lucide-react';
import { StorageService } from '../../services/storage';

export const LoginModal = ({ isOpen, onClose, onLoginSuccess, lang }) => {
  if (!isOpen) return null;

  const [authMethod, setAuthMethod] = useState('pin');
  const [pin, setPin] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const employees = StorageService.getEmployees();

  const handleEmailLogin = (e) => {
    e.preventDefault();
    setError('');

    const res = StorageService.login(email, password);
    if (res.success) {
      onLoginSuccess(res.user);
      onClose();
    } else {
      setError(
        lang === 'tr'
          ? 'E-posta veya şifre hatalı! (Demo şifreleri: admin veya 1234)'
          : 'Ungültige Anmeldedaten! (Demo-Passwort: admin oder 1234)'
      );
    }
  };

  const handlePinLogin = (e) => {
    e.preventDefault();
    setError('');

    const res = StorageService.loginWithPin(pin);
    if (res.success) {
      onLoginSuccess(res.user);
      onClose();
    } else {
      setError(
        lang === 'tr'
          ? 'PIN hatalı! (Demo PIN: 1001 - 1006 / Admin: 9999)'
          : 'Ungültige PIN! (Demo: 1001-1006 / Admin: 9999)'
      );
    }
  };

  const handleQuickUserLogin = (emp) => {
    StorageService.setCurrentUser(emp);
    onLoginSuccess(emp);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs modal-backdrop">
      <div className="w-full max-w-md rounded-3xl bg-surface p-6 relative border border-line text-ink modal-container shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-subhead transition hover:text-ink"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ANİMASYONLU ADO MANAGEMENT LOGOSU - GİRİŞ MODAL BAŞLIĞI */}
        <div className="flex items-center gap-3 mb-5 select-none pb-4 border-b border-line/60">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl icon-box font-black shrink-0 transition-all duration-300 hover:scale-105 hover:border-brand/60 hover:shadow-[0_0_20px_rgba(255,90,31,0.5)] animate-icon-float">
            <Building2 className="w-5 h-5 text-brand hover:rotate-6 transition-transform duration-300" />
            
            {/* Canlı Turuncu/Altın Nabız Atan Nokta */}
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 z-10">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff5522] opacity-90"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-gradient-to-r from-orange-500 to-amber-400 ring-2 ring-black/70 shadow-[0_0_10px_#ff5522]"></span>
            </span>
          </div>

          <div className="relative">
            <div className="flex items-center gap-2 relative group/logo">
              {/* Arkadaki Süzülen Neon Işık Hüzmesi */}
              <div className="absolute -inset-3 bg-gradient-to-r from-brand/60 via-amber-500/30 to-brand/40 rounded-2xl animate-logo-glow pointer-events-none"></div>
              
              <span className="relative font-extrabold text-lg sm:text-xl tracking-tight text-ink font-sans flex items-center gap-1.5 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                <span className="text-white font-black tracking-wider">ADO</span>
                <span className="animate-text-shimmer font-black tracking-widest text-transparent">MANAGEMENT</span>
              </span>
            </div>
            <p className="text-[11px] text-ink-muted flex items-center gap-1.5 relative z-10 mt-0.5 font-medium tracking-wide">
              <KeyRound className="w-3.5 h-3.5 text-brand shrink-0" />
              <span>{lang === 'tr' ? 'Personel & Yönetici Giriş Portalı' : 'Mitarbeiter & Chef Login-Portal'}</span>
            </p>
          </div>
        </div>

        <div className="flex card-inner p-1 rounded-2xl mb-4 border border-line">
          <button
            type="button"
            onClick={() => {
              setAuthMethod('pin');
              setError('');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              authMethod === 'pin'
                ? 'btn-brand font-black'
                : 'text-subhead '
            }`}
          >
            <Hash className="w-3.5 h-3.5" />
            <span>{lang === 'tr' ? '🔢 4-Haneli PIN (Önerilen)' : '🔢 PIN-Code (Schnell)'}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMethod('email');
              setError('');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              authMethod === 'email'
                ? 'btn-brand font-black'
                : 'text-subhead '
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>{lang === 'tr' ? '✉️ E-posta & Şifre' : '✉️ E-Mail & Passwort'}</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-2xl card-inner border border-brand-border flex items-center gap-2 text-brand text-xs font-bold">
            <AlertCircle className="w-4 h-4 shrink-0 icon-brand" />
            <span>{error}</span>
          </div>
        )}

        {authMethod === 'pin' ? (
          <form onSubmit={handlePinLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-subhead mb-1 text-left">
                {lang === 'tr' ? '4 Haneli Çalışan PIN Kodunuz:' : 'Ihr 4-stelliger Mitarbeiter-PIN:'}
              </label>
              <input
                type="password"
                maxLength={4}
                autoFocus
                required
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                className="w-full text-center text-3xl font-mono font-black tracking-widest py-3 rounded-2xl card-inner border border-line text-ink focus:outline-none focus:border-brand transition"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl btn-brand font-black text-xs transition"
            >
              {lang === 'tr' ? 'PIN ile Giriş Yap' : 'Mit PIN anmelden'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleEmailLogin} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-subhead mb-1">
                {lang === 'tr' ? 'E-posta Adresi' : 'E-Mail Adresse'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-subhead absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@firma.ch"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl card-inner border border-line text-ink text-xs focus:outline-none focus:border-brand transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-subhead mb-1">
                {lang === 'tr' ? 'Şifre' : 'Passwort'}
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-subhead absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl card-inner border border-line text-ink text-xs focus:outline-none focus:border-brand transition"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl btn-brand font-black text-xs transition mt-2"
            >
              {lang === 'tr' ? 'Giriş Yap' : 'Anmelden'}
            </button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-line-soft">
          <p className="text-[11px] font-bold text-subhead uppercase tracking-wider mb-2.5 text-left">
            {lang === 'tr' ? 'Tek Tıkla Hızlı Test Girişi' : 'Direkte Schnell-Auswahl:'}
          </p>

          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
            {employees.map((emp) => (
              <button
                key={emp.id}
                type="button"
                onClick={() => handleQuickSelect(emp)}
                className="p-2 rounded-lg border border-line card-inner text-left flex items-center gap-2.5 transition text-xs"
              >
                <img
                  src={emp.avatar}
                  alt={emp.name}
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-line"
                />
                <div className="truncate">
                  <div className="font-bold text-ink truncate text-[11px]">
                    {emp.name.split(' ')[0]} {emp.role === 'admin' && '👑'}
                  </div>
                  <div className="text-[10px] text-brand font-mono font-bold">
                    PIN: {emp.pin}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
