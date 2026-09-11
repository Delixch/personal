import React, { useState } from 'react';
import {
  ReceiptText,
  Download,
  Printer,
  TrendingUp,
  CreditCard,
  DollarSign,
  PieChart,
  Percent,
  Calendar,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const AccountingDashboard = ({ lang, currentUser }) => {
  const invoices = StorageService.getInvoices();
  const employees = StorageService.getEmployees();
  const timeLogs = StorageService.getTimeLogs();

  const [selectedMonth, setSelectedMonth] = useState('2026-09');

  const totalInvoiceSpend = invoices.reduce((sum, i) => sum + i.totalAmount, 0);
  const totalTaxAmount = invoices.reduce((sum, i) => sum + (i.taxAmount || 0), 0);
  const totalPendingInvoices = invoices
    .filter(i => i.status === 'pending')
    .reduce((sum, i) => sum + i.totalAmount, 0);

  const estimatedPayroll = employees.reduce((sum, e) => {
    const multiplier = e.contractType?.includes('100%') ? 160 : e.contractType?.includes('80%') ? 128 : 80;
    return sum + (e.hourlyRate * multiplier);
  }, 0);

  const categorySpend = invoices.reduce((acc, inv) => {
    acc[inv.category] = (acc[inv.category] || 0) + inv.totalAmount;
    return acc;
  }, {});

  const handleExportCSV = () => {
    const headers = ['Beleg-Nr', 'Lieferant', 'Kategorie', 'Rechnungsdatum', 'Faelligkeit', 'Netto', 'MwSt-Satz', 'MwSt-Betrag', 'Brutto-CHF', 'Status'];
    const rows = invoices.map(i => [
      i.invoiceNumber,
      `"${i.supplierName}"`,
      `"${i.category}"`,
      i.date,
      i.dueDate,
      (i.subtotal || i.totalAmount * 0.95).toFixed(2),
      `${i.taxRate}%`,
      (i.taxAmount || 0).toFixed(2),
      i.totalAmount.toFixed(2),
      i.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(';'), ...rows.map(e => e.join(';'))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ADO_Monatsbuchhaltung_${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl glass-panel relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-2">
              <ReceiptText className="w-3.5 h-3.5 text-emerald-600" />
              <span>Automatisierte Buchhaltung & Finanzsteuerung</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {lang === 'tr' ? 'Aylık Muhasebe & Finansal Raporlama' : 'Monatsbuchhaltung & Finanzübersicht'}
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl">
              {lang === 'tr'
                ? 'Giderlerin, KDV oranlarının (MwSt %2.6 & %8.1) ve personel maliyetlerinin tek ekranda analizi.'
                : 'Zentrale Einkaufs- und Kostenanalyse für Treuhand & Steuerdeklaration (Schweiz / Europa).'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 rounded-xl gradient-btn-emerald font-bold text-xs flex items-center gap-2 transition shadow-sm"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>{lang === 'tr' ? 'Excel / CSV İndir' : 'Treuhand CSV Export'}</span>
            </button>
            <button
              onClick={() => window.print()}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm transition"
              title="Drucken / PDF"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4 Financial KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
              <span>{lang === 'tr' ? 'Toplam Fatura Gideri' : 'Wareneinkauf Total'}</span>
              <CreditCard className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-xl font-black font-mono text-slate-900">
              {formatCurrency(totalInvoiceSpend)}
            </p>
            <span className="text-[10px] text-emerald-700 font-semibold">100% Belege verbucht</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
              <span>{lang === 'tr' ? 'Offene Verbindlichkeiten' : 'Offene Rechnungen'}</span>
              <Calendar className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-xl font-black font-mono text-amber-700">
              {formatCurrency(totalPendingInvoices)}
            </p>
            <span className="text-[10px] text-slate-500">Zur Zahlung fällig</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
              <span>{lang === 'tr' ? 'Tahmini Personel Maaşları' : 'Geschätzte Lohnkosten'}</span>
              <DollarSign className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-xl font-black font-mono text-slate-900">
              {formatCurrency(estimatedPayroll)}
            </p>
            <span className="text-[10px] text-slate-500">{employees.length} Mitarbeiter angestellt</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
              <span>{lang === 'tr' ? 'KDV / MwSt Vorsteuer' : 'MwSt Rückforderung'}</span>
              <Percent className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-xl font-black font-mono text-purple-800">
              {formatCurrency(totalTaxAmount)}
            </p>
            <span className="text-[10px] text-slate-500">Vorsteuerabzug</span>
          </div>
        </div>
      </div>

      {/* Spend Distribution by Category */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-panel p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-emerald-600" />
            <span>{lang === 'tr' ? 'Tedarikçi Kategori Dağılımı' : 'Ausgaben nach Warengruppe'}</span>
          </h3>

          <div className="space-y-3">
            {Object.entries(categorySpend).map(([cat, amount]) => {
              const pct = totalInvoiceSpend > 0 ? (amount / totalInvoiceSpend) * 100 : 0;
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-700 truncate pr-2">{cat}</span>
                    <span className="font-mono font-bold text-slate-900 shrink-0">
                      {formatCurrency(amount)} ({pct.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bookkeeping Table */}
        <div className="lg:col-span-2 glass-panel p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ReceiptText className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'tr' ? 'Aylık Fatura Listesi' : 'Monatliches Belegjournal'}</span>
            </h3>
            <span className="text-xs text-slate-500">
              Monat: 09 / 2026
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="border-b border-slate-100 text-[11px] text-slate-400">
                <tr>
                  <th className="pb-2">Datum</th>
                  <th className="pb-2">Lieferant</th>
                  <th className="pb-2">Beleg-Nr</th>
                  <th className="pb-2">MwSt</th>
                  <th className="pb-2 text-right">Betrag CHF</th>
                  <th className="pb-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50">
                    <td className="py-2.5 font-mono">{formatDate(inv.date)}</td>
                    <td className="py-2.5 font-semibold text-slate-900">{inv.supplierName}</td>
                    <td className="py-2.5 font-mono text-slate-500">{inv.invoiceNumber}</td>
                    <td className="py-2.5 font-mono text-[11px]">{inv.taxRate}%</td>
                    <td className="py-2.5 font-mono font-bold text-right text-emerald-700">
                      {formatCurrency(inv.totalAmount)}
                    </td>
                    <td className="py-2.5 text-right">
                      <span className={`badge ${inv.status === 'paid' ? 'badge-emerald' : 'badge-amber'} text-[9px] py-0 px-1.5`}>
                        {inv.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
};
