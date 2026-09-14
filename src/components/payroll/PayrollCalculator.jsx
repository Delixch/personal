import React, { useState } from 'react';
import {
  Calculator,
  Download,
  Users,
  Clock,
  Coins,
  FileSpreadsheet,
  TrendingUp,
  Percent,
  Calendar,
  AlertCircle,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { formatCurrency, formatDate, calculateHoursWorked } from '../../utils/formatters';

export const PayrollCalculator = ({ lang, currentUser }) => {
  const [employees, setEmployees] = useState(() => StorageService.getEmployees());
  const [timeLogs, setTimeLogs] = useState(() => StorageService.getTimeLogs());
  const [selectedMonth, setSelectedMonth] = useState('2026-09');
  const [selectedEmpId, setSelectedEmpId] = useState(null);

  const months = [
    { value: '2026-09', label: 'September 2026' },
    { value: '2026-08', label: 'August 2026' },
    { value: '2026-07', label: 'Juli 2026' }
  ];

  const activeEmployeesForMonth = employees.filter(emp => {
    const joined = emp.joinedDate || '2024-01-01';
    const [year, month] = selectedMonth.split('-').map(Number);
    const lastDayOfMonth = new Date(year, month, 0).getDate();
    const monthEndStr = `${selectedMonth}-${String(lastDayOfMonth).padStart(2, '0')}`;
    
    if (joined > monthEndStr) return false;
    if (emp.austrittsdatum && emp.austrittsdatum < `${selectedMonth}-01`) return false;
    return true;
  });

  const getEmployeeStats = (emp) => {
    const empLogs = timeLogs.filter(
      l => l.employeeId === emp.id && l.date.startsWith(selectedMonth) && l.clockOut
    );

    let totalWorkedMinutes = 0;
    empLogs.forEach(l => {
      const [hIn, mIn] = l.clockIn.split(':').map(Number);
      const [hOut, mOut] = l.clockOut.split(':').map(Number);
      let diff = (hOut * 60 + mOut) - (hIn * 60 + mIn);
      if (diff < 0) diff += 24 * 60;
      const net = Math.max(0, diff - (l.breakMinutes || 0));
      totalWorkedMinutes += net;
    });

    const workedHours = +(totalWorkedMinutes / 60).toFixed(1);

    let contractPercentage = 100;
    if (emp.contractType?.includes('80%')) contractPercentage = 80;
    else if (emp.contractType?.includes('60%')) contractPercentage = 60;
    else if (emp.contractType?.includes('50%')) contractPercentage = 50;

    const baselineMockHours = emp.role === 'admin' ? 180 : Math.round(182 * (contractPercentage / 100) * 0.95);
    const effectiveHours = workedHours > 0 ? workedHours : baselineMockHours;
    const targetHours = Math.round(182 * (contractPercentage / 100));
    const overtime = +(effectiveHours - targetHours).toFixed(1);

    const grossBase = +(effectiveHours * emp.hourlyRate).toFixed(2);

    const socialDeductions = +(grossBase * 0.115).toFixed(2);
    const netSalary = +(grossBase - socialDeductions).toFixed(2);

    return {
      workedHours: effectiveHours,
      targetHours,
      overtime,
      contractPercentage,
      grossBase,
      socialDeductions,
      netSalary
    };
  };

  const totalGrossPayroll = activeEmployeesForMonth.reduce((sum, e) => sum + getEmployeeStats(e).grossBase, 0);
  const totalHoursWorked = activeEmployeesForMonth.reduce((sum, e) => sum + getEmployeeStats(e).workedHours, 0);

  const exportTreuhandCSV = () => {
    const headers = [
      'Personalnummer',
      'Name',
      'Eintrittsdatum',
      'AHV-Nummer',
      'Abteilung',
      'Pensum',
      'Stundenlohn_CHF',
      'Sollstunden',
      'Iststunden',
      'Ueberstunden',
      'Bruttolohn_CHF',
      'Sozialabzuege_11.5%_CHF',
      'Nettolohn_CHF'
    ];

    const rows = activeEmployeesForMonth.map(emp => {
      const stats = getEmployeeStats(emp);
      return [
        emp.id,
        `"${emp.name}"`,
        emp.joinedDate || '2024-01-01',
        emp.ahv || '756.0000.0000.00',
        emp.department || 'kuche',
        `${stats.contractPercentage}%`,
        emp.hourlyRate.toFixed(2),
        stats.targetHours,
        stats.workedHours,
        stats.overtime,
        stats.grossBase.toFixed(2),
        stats.socialDeductions.toFixed(2),
        stats.netSalary.toFixed(2)
      ].join(';');
    });

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Treuhand_Lohnjournal_${selectedMonth}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">

      <div className="p-5 rounded-3xl bg-surface text-ink border border-line relative overflow-hidden mb-6 card-inner">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="page-title text-ink">
              {lang === 'tr' ? 'Maaş & Çalışma Saati Hesaplayıcı' : 'Lohn- & Stundenabrechnung'}
            </h1>
            <p className="text-subhead text-ink-soft max-w-2xl leading-relaxed mt-1">
              {lang === 'tr'
                ? 'Çalışılan saatler, fazla mesai bakiyeleri (Überstunden), İsviçre AHV/ALV kesinti simülatörü ve muhasebeci (Treuhand) için tek tıkla CSV çıktısı.'
                : 'Monatliche Arbeitszeitauswertung, Überstundensaldo, Schweizer Sozialabzüge (AHV/ALV/BVG) und Treuhand-Export.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 md:ml-auto">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3.5 py-2 rounded-md card-inner border border-line text-ink text-xs font-bold focus:outline-none focus:border-brand cursor-pointer"
            >
              {months.map(m => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>

            <button
              onClick={exportTreuhandCSV}
              className="px-3.5 py-2 rounded-md btn-brand font-black text-xs flex items-center gap-2 transition cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 shrink-0" />
              <span>{lang === 'tr' ? 'Treuhand CSV İndir' : 'Treuhand CSV Export'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl card-inner border border-line">
          <div className="flex items-center justify-between text-ink-soft mb-2">
            <span className="text-xs font-semibold">{lang === 'tr' ? 'Toplam Brüt Bordro' : 'Gesamte Bruttolohnsumme'}</span>
            <Coins className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="font-mono text-2xl font-black text-ink">
            {formatCurrency(totalGrossPayroll)}
          </div>
          <p className="text-[11px] text-ink-soft mt-1">
            {activeEmployeesForMonth.length} {lang === 'tr' ? 'Mitarbeiter için hesaplandı' : 'Mitarbeiter erfasst'}
          </p>
        </div>

        <div className="p-5 rounded-3xl card-inner border border-line">
          <div className="flex items-center justify-between text-ink-soft mb-2">
            <span className="text-xs font-semibold">{lang === 'tr' ? 'Toplam Çalışılan Saat' : 'Geleistete Arbeitsstunden'}</span>
            <Clock className="w-4 h-4 text-ink" />
          </div>
          <div className="font-mono text-2xl font-black text-ink">
            {totalHoursWorked.toFixed(1)} Std
          </div>
          <p className="text-[11px] text-ink font-semibold mt-1">
            Ø {(activeEmployeesForMonth.length > 0 ? totalHoursWorked / activeEmployeesForMonth.length : 0).toFixed(1)} Std / Person
          </p>
        </div>

        <div className="p-5 rounded-3xl card-inner border border-line">
          <div className="flex items-center justify-between text-ink-soft mb-2">
            <span className="text-xs font-semibold">{lang === 'tr' ? 'Sozialabzüge (~11.5%)' : 'Sozialabzüge (AHV/ALV/BVG)'}</span>
            <Percent className="w-4 h-4 text-brand" />
          </div>
          <div className="font-mono text-2xl font-black text-ink">
            {formatCurrency(totalGrossPayroll * 0.115)}
          </div>
          <p className="text-[11px] text-ink-soft mt-1">
            {lang === 'tr' ? 'Yasal işçi kesintisi tahmini' : 'Gesetzlicher Arbeitnehmerbeitrag'}
          </p>
        </div>
      </div>

      <div className="p-6 rounded-3xl card-inner border border-line overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-ink flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600" />
            <span>{lang === 'tr' ? 'Personel Bazında Saat ve Hak Ediş Tablosu' : 'Mitarbeiter-Stunden & Lohnübersicht'}</span>
          </h2>
          <span className="badge badge-indigo text-xs">
            {selectedMonth}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-ink-soft">
            <thead className="border-b border-line text-[11px] text-ink-muted">
              <tr>
                <th className="pb-3">Mitarbeiter</th>
                <th className="pb-3">Pensum</th>
                <th className="pb-3">Stundenlohn</th>
                <th className="pb-3">Soll-Std</th>
                <th className="pb-3">Ist-Std</th>
                <th className="pb-3">Saldo / Überstunden</th>
                <th className="pb-3">Bruttolohn</th>
                <th className="pb-3">Netto (ca.)</th>
                <th className="pb-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {activeEmployeesForMonth.map((emp) => {
                const stats = getEmployeeStats(emp);
                const isPositiveOvertime = stats.overtime >= 0;

                return (
                  <tr key={emp.id} className="transition">
                    <td className="py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={emp.avatar}
                          alt={emp.name}
                          className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-ink text-xs">{emp.name}</p>
                          <p className="text-[10px] text-ink-muted">{emp.jobTitle}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 font-semibold text-ink-soft">
                      {stats.contractPercentage}%
                    </td>

                    <td className="py-3.5 font-mono font-bold text-ink">
                      CHF {emp.hourlyRate.toFixed(2)}
                    </td>

                    <td className="py-3.5 font-mono font-bold text-emerald-400">
                      {stats.targetHours} h
                    </td>

                    <td className="py-3.5 font-mono font-bold text-ink">
                      {stats.workedHours} h
                    </td>

                    <td className="py-3.5 font-mono font-bold">
                      <span
                        className={`inline-flex items-center justify-center px-3.5 py-1 rounded-xl text-xs font-black tracking-wide min-w-[68px] ${
                          stats.overtime === 0
                            ? 'saldo-badge-success'
                            : 'saldo-badge-danger'
                        }`}
                      >
                        {stats.overtime > 0 ? `+${stats.overtime}` : stats.overtime} h
                      </span>
                    </td>

                    <td className="py-3.5 font-mono font-extrabold text-ink">
                      {formatCurrency(stats.grossBase)}
                    </td>

                    <td className="py-3.5 font-mono font-extrabold text-ink">
                      {formatCurrency(stats.netSalary)}
                    </td>

                    <td className="py-3.5 text-right">
                      <span className="badge badge-emerald text-[10px] py-0.5 px-2">
                        Bereit
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
