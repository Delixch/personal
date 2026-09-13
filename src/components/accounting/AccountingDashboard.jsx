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

      <div className="p-6 sm:p-8 rounded-3xl bg-surface text-ink border border-line relative overflow-hidden mb-6 card-inner">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="page-title text-ink">
              {lang === 'tr' ? 'Aylık Muhasebe & Finansal Raporlama' : 'Monatsbuchhaltung & Finanzübersicht'}
            </h1>
            <p className="text-subhead text-ink-soft max-w-2xl leading-relaxed mt-1">
              {lang === 'tr'
                ? 'Giderlerin, KDV oranlarının (MwSt %2.6 & %8.1) ve personel maliyetlerinin tek ekranda analizi.'
                : 'Zentrale Einkaufs- und Kostenanalyse für Treuhand & Steuerdeklaration (Schweiz / Europa).'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 rounded-xl btn-brand font-black text-xs flex items-center gap-2 transition"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>{lang === 'tr' ? 'Excel / CSV İndir' : 'Treuhand CSV Export'}</span>
            </button>
            <button
              onClick={() => window.print()}
              className="p-2 rounded-xl border border-line bg-surface text-ink transition card-inner"
              title="Drucken / PDF"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-4 border-t border-line-soft">
          <div className="p-4 rounded-2xl card-inner border border-line">
            <div className="flex items-center justify-between text-subhead text-xs mb-1">
              <span>{lang === 'tr' ? 'Toplam Fatura Gideri' : 'Wareneinkauf Total'}</span>
              <CreditCard className="w-4 h-4 text-brand icon-brand" />
            </div>
            <p className="text-xl font-black font-mono text-ink">
              {formatCurrency(totalInvoiceSpend)}
            </p>
            <span className="text-[10px] text-brand font-semibold">100% Belege verbucht</span>
          </div>

          <div className="p-4 rounded-2xl card-inner border border-line">
            <div className="flex items-center justify-between text-subhead text-xs mb-1">
              <span>{lang === 'tr' ? 'Offene Verbindlichkeiten' : 'Offene Rechnungen'}</span>
              <Calendar className="w-4 h-4 text-rose-500" />
            </div>
            <p className="text-xl font-black font-mono text-rose-500">
              {formatCurrency(totalPendingInvoices)}
            </p>
            <span className="text-[10px] text-ink-muted">Zur Zahlung fällig</span>
          </div>

          <div className="p-4 rounded-2xl card-inner border border-line">
            <div className="flex items-center justify-between text-subhead text-xs mb-1">
              <span>{lang === 'tr' ? 'Tahmini Personel Maaşları' : 'Geschätzte Lohnkosten'}</span>
              <DollarSign className="w-4 h-4 text-brand icon-brand" />
            </div>
            <p className="text-xl font-black font-mono text-ink">
              {formatCurrency(estimatedPayroll)}
            </p>
            <span className="text-[10px] text-ink-muted">{employees.length} Mitarbeiter angestellt</span>
          </div>

          <div className="p-4 rounded-2xl card-inner border border-line">
            <div className="flex items-center justify-between text-subhead text-xs mb-1">
              <span>{lang === 'tr' ? 'KDV / MwSt Vorsteuer' : 'MwSt Rückforderung'}</span>
              <Percent className="w-4 h-4 text-ink" />
            </div>
            <p className="text-xl font-black font-mono text-ink">
              {formatCurrency(totalTaxAmount)}
            </p>
            <span className="text-[10px] text-ink-muted">Vorsteuerabzug</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-panel p-6">
          <h3 className="text-sm font-bold text-ink mb-4 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-ink" />
            <span>{lang === 'tr' ? 'Tedarikçi Kategori Dağılımı' : 'Ausgaben nach Warengruppe'}</span>
          </h3>

          <div className="space-y-3">
            {Object.entries(categorySpend).map(([cat, amount]) => {
              const pct = totalInvoiceSpend > 0 ? (amount / totalInvoiceSpend) * 100 : 0;
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-subhead truncate pr-2">{cat}</span>
                    <span className="font-mono font-bold text-ink shrink-0">
                      {formatCurrency(amount)} ({pct.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full bg-ground border border-line h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-subtle h-full rounded-full"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-2 glass-panel p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-ink flex items-center gap-2">
              <ReceiptText className="w-4 h-4 text-ink" />
              <span>{lang === 'tr' ? 'Aylık Fatura Listesi' : 'Monatliches Belegjournal'}</span>
            </h3>
            <span className="text-xs text-subhead">
              Monat: 09 / 2026
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-ink-soft">
              <thead className="border-b border-line text-[11px] text-subhead">
                <tr>
                  <th className="pb-2">Datum</th>
                  <th className="pb-2">Lieferant</th>
                  <th className="pb-2">Beleg-Nr</th>
                  <th className="pb-2">MwSt</th>
                  <th className="pb-2 text-right">Betrag CHF</th>
                  <th className="pb-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="">
                    <td className="py-2.5 font-mono">{formatDate(inv.date)}</td>
                    <td className="py-2.5 font-semibold text-ink">{inv.supplierName}</td>
                    <td className="py-2.5 font-mono text-subhead">{inv.invoiceNumber}</td>
                    <td className="py-2.5 font-mono text-[11px]">{inv.taxRate}%</td>
                    <td className="py-2.5 font-mono font-bold text-right text-ink">
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
