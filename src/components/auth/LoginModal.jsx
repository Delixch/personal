import React, { useState } from 'react';
import { KeyRound, Mail, X, ShieldCheck, Check, AlertCircle, Hash, Sparkles } from 'lucide-react';
import { StorageService } from '../../services/storage';

export const LoginModal = ({ isOpen, onClose, onLoginSuccess, lang }) => {
  if (!isOpen) return null;

  const [authMethod, setAuthMethod] = useState('pin'); // 'pin' | 'email'
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
          ? 'Hatalı PIN! (Demo PIN: 1001-1006 veya patron için 9999)'
          : 'Ungültige PIN! (Demo: 1001-1006 oder Chef: 9999)'
      );
    }
  };

  const handleQuickSelect = (emp) => {
    onLoginSuccess(emp);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl relative border border-slate-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 mb-2 border border-emerald-200">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-slate-900">
            {lang === 'tr' ? 'Sisteme Giriş' : 'Mitarbeiter & Chef Login'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {lang === 'tr'
              ? 'PIN kodunuzla veya e-posta ile giriş yapın'
              : 'Wählen Sie Ihren Zugang per PIN oder E-Mail'}
          </p>
        </div>

        {/* Tab Switcher: PIN vs Email */}
        <div className="flex bg-slate-100 p-1 rounded-2xl mb-4 border border-slate-200">
          <button
            type="button"
            onClick={() => {
              setAuthMethod('pin');
              setError('');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              authMethod === 'pin'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Hash className="w-3.5 h-3.5 text-emerald-600" />
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
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-slate-500" />
            <span>{lang === 'tr' ? '✉️ E-posta & Şifre' : '✉️ E-Mail & Passwort'}</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-rose-800 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Method 1: PIN Form */}
        {authMethod === 'pin' ? (
          <form onSubmit={handlePinLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 text-center">
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
                className="w-full text-center text-3xl font-mono font-black tracking-widest py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500 transition"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl gradient-btn-emerald font-extrabold text-xs transition shadow-sm"
            >
              {lang === 'tr' ? 'PIN ile Giriş Yap' : 'Mit PIN anmelden'}
            </button>
          </form>
        ) : (
          /* Method 2: Email & Password Form */
          <form onSubmit={handleEmailLogin} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'tr' ? 'E-posta Adresi' : 'E-Mail Adresse'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@firma.ch"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'tr' ? 'Şifre' : 'Passwort'}
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl gradient-btn-emerald font-bold text-xs transition mt-2 shadow-sm"
            >
              {lang === 'tr' ? 'Giriş Yap' : 'Anmelden'}
            </button>
          </form>
        )}

        {/* Quick Click Persona Selector */}
        <div className="mt-6 pt-4 border-t border-slate-100">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5 text-center">
            {lang === 'tr' ? 'Tek Tıkla Hızlı Test Girişi' : 'Direkte Schnell-Auswahl:'}
          </p>

          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
            {employees.map((emp) => (
              <button
                key={emp.id}
                type="button"
                onClick={() => handleQuickSelect(emp)}
                className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 text-left flex items-center gap-2.5 transition text-xs"
              >
                <img
                  src={emp.avatar}
                  alt={emp.name}
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-200"
                />
                <div className="truncate">
                  <div className="font-bold text-slate-900 truncate text-[11px]">
                    {emp.name.split(' ')[0]} {emp.role === 'admin' && '👑'}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-mono">
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
