import React from 'react';
import {
  Truck,
  CalendarDays,
  Clock,
  ScanLine,
  ReceiptText,
  Users2,
  HeartPulse,
  ArrowUpRight,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Camera,
  Plus
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const OverviewDashboard = ({ lang, currentUser, onNavigate }) => {
  const suppliers = StorageService.getSuppliers();
  const employees = StorageService.getEmployees();
  const shifts = StorageService.getShifts();
  const invoices = StorageService.getInvoices();
  const timeLogs = StorageService.getTimeLogs();
  const sickReports = StorageService.getSickReports();

  const todayStr = new Date().toISOString().split('T')[0];
  const todayShifts = shifts.filter(s => s.date === todayStr);
  const activeTimeLogs = timeLogs.filter(t => t.date === todayStr && !t.clockOut);
  const unpaidInvoices = invoices.filter(i => i.status === 'pending');
  const totalUnpaid = unpaidInvoices.reduce((sum, i) => sum + i.totalAmount, 0);

  return (
    <div className="space-y-6">
      
      {/* Hero Welcome Banner - Clean Bright Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>ADO Firma · Zentrale B2B Management Plattform</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              {lang === 'tr' ? 'Merkezi Firma & İşletme Kontrol Paneli' : 'Zentrale Unternehmens- & Betriebssteuerung'}
            </h1>
            <p className="text-xs md:text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
              {lang === 'tr'
                ? 'Tedarikçi siparişleri (Metzgerei, Prodega, Sebze), 2 vardiyalı personel planlaması, giriş-çıkış saatleri, hastalık bildirimleri ve fatura tarama tek ekranda.'
                : 'Intelligenter Einkauf, automatisierte Schichtplanung (2 Schichten), Zeiterfassung und KI-gestütztes Rechnungsmanagement.'}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onNavigate('suppliers')}
              className="px-4 py-2.5 rounded-xl gradient-btn-emerald font-bold text-xs flex items-center gap-1.5 transition"
            >
              <Truck className="w-4 h-4" />
              <span>{lang === 'tr' ? 'Yeni Sipariş Ver' : 'Bestellung aufgeben'}</span>
            </button>

            <button
              onClick={() => onNavigate('invoices')}
              className="px-4 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 font-bold text-xs flex items-center gap-1.5 transition"
            >
              <Camera className="w-4 h-4 text-purple-600" />
              <span>{lang === 'tr' ? 'Fatura Tara / Yükle' : 'Rechnung scannen'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Core Pillars Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Pillar 1: Suppliers */}
        <div
          onClick={() => onNavigate('suppliers')}
          className="glass-panel glass-panel-hover p-5 cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                <Truck className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400" />
            </div>
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
              {lang === 'tr' ? 'Tedarikçiler' : 'Lieferanten & Einkauf'}
            </span>
            <h3 className="text-xl font-black text-slate-900 font-mono mt-1">
              {suppliers.length} Partner
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Metzgerei, Prodega, Sebze & Getränke
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>WhatsApp Express</span>
            <span className="badge badge-emerald py-0 px-1.5 text-[10px]">Aktiv</span>
          </div>
        </div>

        {/* Pillar 2: Shifts & Planning */}
        <div
          onClick={() => onNavigate('shifts')}
          className="glass-panel glass-panel-hover p-5 cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                <CalendarDays className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400" />
            </div>
            <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">
              {lang === 'tr' ? 'Vardiya Planı' : 'Schichtplan (2 Schichten)'}
            </span>
            <h3 className="text-xl font-black text-slate-900 font-mono mt-1">
              {todayShifts.length} {lang === 'tr' ? 'Vardiya Bugün' : 'Schichten heute'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Früh- & Spätschicht eingeteilt
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>5 Abteilungen</span>
            <span className="badge badge-blue py-0 px-1.5 text-[10px]">Synchron</span>
          </div>
        </div>

        {/* Pillar 3: Time Tracking (Stempeluhr) */}
        <div
          onClick={() => onNavigate('timeTracker')}
          className="glass-panel glass-panel-hover p-5 cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600 border border-cyan-100">
                <Clock className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400" />
            </div>
            <span className="text-[11px] font-bold text-cyan-700 uppercase tracking-wider">
              {lang === 'tr' ? 'Giriş-Çıkış (Stempeluhr)' : 'Zeiterfassung'}
            </span>
            <h3 className="text-xl font-black text-slate-900 font-mono mt-1">
              {activeTimeLogs.length} {lang === 'tr' ? 'Kişi İşte' : 'im Dienst'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {lang === 'tr' ? 'Gerçek zamanlı çalışma takibi' : 'Live-Stempeluhr aktiv'}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>Überstunden-Saldo</span>
            <span className="badge badge-emerald py-0 px-1.5 text-[10px]">Live</span>
          </div>
        </div>

        {/* Pillar 4: Invoices & Accounting */}
        <div
          onClick={() => onNavigate('invoices')}
          className="glass-panel glass-panel-hover p-5 cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 border border-purple-100">
                <ScanLine className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400" />
            </div>
            <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">
              {lang === 'tr' ? 'Fatura & Muhasebe' : 'Rechnungen & Finanzen'}
            </span>
            <h3 className="text-xl font-black text-amber-600 font-mono mt-1">
              {formatCurrency(totalUnpaid)}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {unpaidInvoices.length} {lang === 'tr' ? 'bekleyen fatura' : 'offene Belege'}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>KI-Scan & Foto</span>
            <span className="badge badge-purple py-0 px-1.5 text-[10px]">Auto-MwSt</span>
          </div>
        </div>

      </div>

      {/* Today's Roster & Fast Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Today's Shifts summary */}
        <div className="lg:col-span-2 glass-panel p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'tr' ? 'Bugünkü Vardiya Planı (2 Vardiya)' : 'Heutiger Dienstplan im Überblick'}</span>
            </h3>
            <button
              onClick={() => onNavigate('shifts')}
              className="text-xs text-emerald-700 font-semibold hover:underline"
            >
              {lang === 'tr' ? 'Tüm Haftayı Gör →' : 'Woche ansehen →'}
            </button>
          </div>

          <div className="space-y-2.5">
            {todayShifts.map((shift) => {
              const emp = employees.find(e => e.id === shift.employeeId);
              const isSick = shift.status === 'sick';

              return (
                <div
                  key={shift.id}
                  className={`p-3 rounded-2xl border flex items-center justify-between gap-3 ${
                    isSick
                      ? 'bg-rose-50 border-rose-200 text-rose-900'
                      : 'bg-slate-50 border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={emp?.avatar}
                      alt={emp?.name}
                      className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{emp?.name}</span>
                        <span className="badge badge-slate text-[10px] py-0 px-1.5">
                          {shift.department.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {shift.notes || emp?.jobTitle}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    {isSick ? (
                      <span className="badge badge-rose text-[10px] py-0 px-2 font-bold">
                        KRANK (ERSATZ NÖTIG)
                      </span>
                    ) : (
                      <span className="badge badge-blue text-[10px] py-0 px-2 font-mono font-bold">
                        {shift.shiftType === 'frueh' ? '08:00 - 16:30' : '16:00 - 00:30'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Suppliers Quick Order Widget */}
        <div className="glass-panel p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'tr' ? 'Hızlı Tedarikçiler' : 'Express-Lieferanten'}</span>
            </h3>

            <div className="space-y-2">
              {suppliers.slice(0, 4).map((sup) => (
                <div
                  key={sup.id}
                  onClick={() => onNavigate('suppliers')}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-100 hover:border-emerald-200 transition flex items-center justify-between cursor-pointer group"
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition">
                      {sup.name}
                    </h4>
                    <p className="text-[10px] text-slate-500">{sup.category}</p>
                  </div>
                  <span className="badge badge-emerald text-[9px] py-0 px-1.5">
                    Bestellen
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate('suppliers')}
            className="mt-4 w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition"
          >
            <span>{lang === 'tr' ? 'Tüm Tedarikçileri Aç' : 'Alle Lieferanten anzeigen'}</span>
          </button>
        </div>

      </div>

    </div>
  );
};
