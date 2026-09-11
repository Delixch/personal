import React, { useState } from 'react';
import { KeyRound, Mail, X, ShieldCheck, Check, AlertCircle } from 'lucide-react';
import { StorageService } from '../../services/storage';

export const LoginModal = ({ isOpen, onClose, onLoginSuccess, lang }) => {
  if (!isOpen) return null;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const employees = StorageService.getEmployees();

  const handleLogin = (e) => {
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

  const handleQuickSelect = (emp) => {
    setEmail(emp.email);
    setPassword(emp.password);
    const res = StorageService.login(emp.email, emp.password);
    if (res.success) {
      onLoginSuccess(res.user);
      onClose();
    }
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
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 mb-3 border border-emerald-200">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            {lang === 'tr' ? 'Kullanıcı Girişi' : 'Mitarbeiter & Chef Login'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {lang === 'tr'
              ? 'Kişisel e-posta ve şifrenizle giriş yapın'
              : 'Melden Sie sich mit Ihrer E-Mail und Passwort an'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-rose-800 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-3.5">
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

        {/* Quick Click Persona Selector */}
        <div className="mt-6 pt-4 border-t border-slate-100">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5 text-center">
            ⚡ {lang === 'tr' ? 'Hızlı Test Hesapları (Tek Tıkla Giriş)' : 'Schnell-Login für Demo'}
          </p>

          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
            {employees.map((emp) => (
              <button
                key={emp.id}
                type="button"
                onClick={() => handleQuickSelect(emp)}
                className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-left transition group"
              >
                <img
                  src={emp.avatar}
                  alt={emp.name}
                  className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200"
                />
                <div className="truncate">
                  <p className="text-[11px] font-bold text-slate-900 group-hover:text-emerald-700 truncate">
                    {emp.name.split(' ')[0]}
                  </p>
                  <p className="text-[9px] text-slate-500 truncate">
                    {emp.role === 'admin' ? 'Chef / Admin' : emp.department}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
