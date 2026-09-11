import React, { useState } from 'react';
import {
  Database,
  Download,
  Upload,
  RefreshCw,
  Server,
  HardDrive,
  CheckCircle2,
  AlertTriangle,
  FileJson,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { StorageService } from '../../services/storage';

export const DatabaseManager = ({ lang, currentUser }) => {
  const [dbState, setDbState] = useState({
    suppliersCount: StorageService.getSuppliers().length,
    employeesCount: StorageService.getEmployees().length,
    shiftsCount: StorageService.getShifts().length,
    invoicesCount: StorageService.getInvoices().length,
    timeLogsCount: StorageService.getTimeLogs().length
  });

  const [importStatus, setImportStatus] = useState('');

  const handleExportBackup = () => {
    const jsonStr = StorageService.exportDatabaseJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ADO_Firma_Datenbank_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.6 }
    });
  };

  const handleImportBackup = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = StorageService.importDatabaseJSON(event.target.result);
      if (result.success) {
        setImportStatus(lang === 'tr' ? 'Veritabanı başarıyla geri yüklendi!' : 'Datenbank erfolgreich wiederhergestellt!');
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setImportStatus(`Fehler: ${result.error}`);
      }
    };
    reader.readAsText(file);
  };

  const handleResetDefaults = () => {
    if (window.confirm(lang === 'tr' ? 'Tüm veriler varsayılan demo ayarlarına sıfırlansın mı?' : 'Wirklich auf Standard-Musterdaten zurücksetzen?')) {
      StorageService.resetToDefaults();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl glass-panel relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-semibold mb-2">
              <Database className="w-3.5 h-3.5 text-cyan-600" />
              <span>Offline-First Lokale Datenbankarchitektur</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {lang === 'tr' ? 'Yerel Veritabanı & Yedekleme Yönetimi' : 'Lokale Datenbank & Datensicherung'}
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl">
              {lang === 'tr'
                ? 'Tüm veriler tarayıcınızın yerel depolama alanında güvenle saklanır. Sayfa kapansa da silinmez. Tek tıkla JSON yedeği alabilir veya buluta aktarabilirsiniz.'
                : 'Alle Daten werden lokal, ausfallsicher und sofort abrufbar im Browser gespeichert. Export & Import per Klick.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportBackup}
              className="px-4 py-2 rounded-xl gradient-btn-emerald font-extrabold text-xs flex items-center gap-1.5 transition shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>{lang === 'tr' ? 'Veritabanı Yedeği İndir (JSON)' : 'Backup herunterladen (JSON)'}</span>
            </button>
          </div>
        </div>

        {/* Database Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-4 border-t border-slate-100">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Lieferanten</p>
            <p className="text-lg font-bold text-slate-900 font-mono">{dbState.suppliersCount}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Mitarbeiter</p>
            <p className="text-lg font-bold text-slate-900 font-mono">{dbState.employeesCount}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Schichten</p>
            <p className="text-lg font-bold text-slate-900 font-mono">{dbState.shiftsCount}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Rechnungen</p>
            <p className="text-lg font-bold text-slate-900 font-mono">{dbState.invoicesCount}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center col-span-2 sm:col-span-1">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Stempelzeiten</p>
            <p className="text-lg font-bold text-slate-900 font-mono">{dbState.timeLogsCount}</p>
          </div>
        </div>
      </div>

      {/* Backup & Restore Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Restore from JSON */}
        <div className="glass-panel p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 border border-purple-200">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                {lang === 'tr' ? 'Yedekten Geri Yükle (Import)' : 'Datensicherung einlesen'}
              </h3>
              <p className="text-xs text-slate-500">
                {lang === 'tr' ? 'Daha önce indirilen JSON yedeğini yükleyin' : 'Laden Sie eine zuvor gesicherte JSON-Datei hoch'}
              </p>
            </div>
          </div>

          <label className="mt-4 block w-full p-6 rounded-2xl border-2 border-dashed border-slate-300 hover:border-purple-400 text-center cursor-pointer transition bg-slate-50">
            <FileJson className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <span className="text-xs font-semibold text-slate-800">
              JSON-Backup auswählen
            </span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
            />
          </label>

          {importStatus && (
            <p className="mt-3 text-xs text-emerald-700 text-center font-semibold">
              {importStatus}
            </p>
          )}
        </div>

        {/* Factory Reset */}
        <div className="glass-panel p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 border border-rose-200">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  {lang === 'tr' ? 'Demo Verilerini Yenile' : 'Auf Musterdaten zurücksetzen'}
                </h3>
                <p className="text-xs text-slate-500">
                  {lang === 'tr' ? 'Tüm tedarikçi, çalışan ve fatura kayıtlarını fabrika ayarlarına döndürür' : 'Setzt alle Einträge auf die initialen Demo-Datensätze zurück'}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 mt-3">
              {lang === 'tr'
                ? 'Test yaparken eklediğiniz deneme kayıtlarını temizlemek isterseniz bu seçeneği kullanabilirsiniz.'
                : 'Ideal zum schnellen Zurücksetzen nach Testläufen und Präsentationen.'}
            </p>
          </div>

          <button
            onClick={handleResetDefaults}
            className="mt-6 w-full py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 text-xs font-bold transition flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{lang === 'tr' ? 'Fabrika Ayarlarına Dön (Reset)' : 'Auf Werkseinstellungen zurücksetzen'}</span>
          </button>
        </div>

      </div>

      {/* Future Cloud Ready Card */}
      <div className="p-6 rounded-3xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 shrink-0">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900">
              {lang === 'tr' ? 'Bulut Veritabanına Geçişe 100% Hazır Mimari' : 'Bereit für Cloud-Datenbank (PostgreSQL / Supabase)'}
            </h4>
            <p className="text-xs text-slate-600">
              {lang === 'tr'
                ? 'Uygulamamız StorageService katmanı ile soyutlanmıştır. İstediğiniz an tek bir konfigürasyon ile gerçek bulut veritabanına bağlanabilir.'
                : 'Die Storage-Schicht ist modular aufgebaut und kann jederzeit nahtlos an PostgreSQL, Supabase oder Firebase angebunden werden.'}
            </p>
          </div>
        </div>

        <span className="badge badge-blue py-1 px-3 text-xs shrink-0">
          Cloud-Ready API
        </span>
      </div>

    </div>
  );
};
