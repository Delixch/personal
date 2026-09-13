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

      <div className="p-6 sm:p-8 rounded-3xl bg-surface text-ink border border-line relative overflow-hidden mb-6 card-inner">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="page-title text-ink">
              {lang === 'tr' ? 'Yerel Veritabanı & Yedekleme Yönetimi' : 'Lokale Datenbank & Datensicherung'}
            </h1>
            <p className="text-subhead text-ink-soft max-w-2xl leading-relaxed mt-1">
              {lang === 'tr'
                ? 'Tüm veriler tarayıcınızın yerel depolama alanında güvenle saklanır. Sayfa kapansa da silinmez. Tek tıkla JSON yedeği alabilir veya buluta aktarabilirsiniz.'
                : 'Alle Daten werden lokal, ausfallsicher und sofort abrufbar im Browser gespeichert. Export & Import per Klick.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleExportBackup}
              className="px-4 py-2.5 rounded-md btn-brand font-black text-xs flex items-center gap-1.5 transition"
            >
              <Download className="w-4 h-4" />
              <span>{lang === 'tr' ? 'Veritabanı Yedeği İndir (JSON)' : 'Backup herunterladen (JSON)'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-4 border-t border-line-soft">
          <div className="p-3.5 rounded-2xl card-inner border border-line text-center">
            <p className="text-[10px] text-subhead uppercase tracking-wider font-semibold">Lieferanten</p>
            <p className="text-lg font-bold text-ink font-mono">{dbState.suppliersCount}</p>
          </div>
          <div className="p-3.5 rounded-2xl card-inner border border-line text-center">
            <p className="text-[10px] text-subhead uppercase tracking-wider font-semibold">Mitarbeiter</p>
            <p className="text-lg font-bold text-ink font-mono">{dbState.employeesCount}</p>
          </div>
          <div className="p-3.5 rounded-2xl card-inner border border-line text-center">
            <p className="text-[10px] text-subhead uppercase tracking-wider font-semibold">Schichten</p>
            <p className="text-lg font-bold text-ink font-mono">{dbState.shiftsCount}</p>
          </div>
          <div className="p-3.5 rounded-2xl card-inner border border-line text-center">
            <p className="text-[10px] text-subhead uppercase tracking-wider font-semibold">Rechnungen</p>
            <p className="text-lg font-bold text-ink font-mono">{dbState.invoicesCount}</p>
          </div>
          <div className="p-3.5 rounded-2xl card-inner border border-line text-center col-span-2 sm:col-span-1">
            <p className="text-[10px] text-subhead uppercase tracking-wider font-semibold">Stempelzeiten</p>
            <p className="text-lg font-bold text-ink font-mono">{dbState.timeLogsCount}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="p-6 rounded-3xl bg-surface border border-line card-inner">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl icon-box flex items-center justify-center shrink-0">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink">
                {lang === 'tr' ? 'Yedekten Geri Yükle (Import)' : 'Datensicherung einlesen'}
              </h3>
              <p className="text-xs text-subhead">
                {lang === 'tr' ? 'Daha önce indirilen JSON yedeğini yükleyin' : 'Laden Sie eine zuvor gesicherte JSON-Datei hoch'}
              </p>
            </div>
          </div>

          <label className="mt-4 block w-full p-6 rounded-2xl border-2 border-dashed border-line text-center cursor-pointer transition card-inner">
            <FileJson className="w-6 h-6 text-ink mx-auto mb-2" />
            <span className="text-xs font-semibold text-ink">
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
            <p className="mt-3 text-xs text-ink text-center font-semibold">
              {importStatus}
            </p>
          )}
        </div>

        <div className="p-6 rounded-3xl bg-surface border border-line flex flex-col justify-between card-inner">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl icon-box flex items-center justify-center shrink-0">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-ink">
                  {lang === 'tr' ? 'Demo Verilerini Yenile' : 'Auf Musterdaten zurücksetzen'}
                </h3>
                <p className="text-xs text-subhead">
                  {lang === 'tr' ? 'Tüm tedarikçi, çalışan ve fatura kayıtlarını fabrika ayarlarına döndürür' : 'Setzt alle Einträge auf die initialen Demo-Datensätze zurück'}
                </p>
              </div>
            </div>

            <p className="text-xs text-ink-soft mt-3">
              {lang === 'tr'
                ? 'Test yaparken eklediğiniz deneme kayıtlarını temizlemek isterseniz bu seçeneği kullanabilirsiniz.'
                : 'Ideal zum schnellen Zurücksetzen nach Testläufen und Präsentationen.'}
            </p>
          </div>

          <button
            onClick={handleResetDefaults}
            className="mt-6 w-full py-2.5 rounded-md card-inner text-ink border border-line text-xs font-bold transition flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{lang === 'tr' ? 'Fabrika Ayarlarına Dön (Reset)' : 'Auf Werkseinstellungen zurücksetzen'}</span>
          </button>
        </div>

      </div>

      <div className="p-6 rounded-3xl bg-surface border border-line flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 card-inner">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl card-inner flex items-center justify-center text-ink shrink-0">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-ink">
              {lang === 'tr' ? 'Bulut Veritabanına Geçişe 100% Hazır Mimari' : 'Bereit für Cloud-Datenbank (PostgreSQL / Supabase)'}
            </h4>
            <p className="text-xs text-ink-soft">
              {lang === 'tr'
                ? 'Uygulamamız StorageService katmanı ile soyutlanmıştır. İstediğiniz an tek bir konfigürasyon ile gerçek bulut veritabanına bağlanabilir.'
                : 'Die Storage-Schicht ist modular aufgebaut und kann jederzeit nahtlos an PostgreSQL, Supabase oder Firebase angebunden werden.'}
            </p>
          </div>
        </div>

        <span className="badge py-1 px-3 text-xs shrink-0">
          CLOUD-READY API
        </span>
      </div>

    </div>
  );
};

