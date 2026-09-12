import React, { useState } from 'react';
import {
  HeartPulse,
  Plus,
  Calendar,
  AlertTriangle,
  Upload,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Palmtree,
  ShieldAlert,
  Camera,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { StorageService } from '../../services/storage';
import { SICK_REASONS } from '../../services/seedData';
import { formatDate } from '../../utils/formatters';
import { TRANSLATIONS } from '../../utils/translations';

export const SickLeaveManager = ({ lang, currentUser }) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.de;
  const [sickReports, setSickReports] = useState(StorageService.getSickReports());
  const [leaveRequests, setLeaveRequests] = useState(StorageService.getLeaveRequests());
  const [employees, setEmployees] = useState(StorageService.getEmployees());

  const [activeTab, setActiveTab] = useState('sick');
  const [showSickModal, setShowSickModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  const [sickData, setSickData] = useState({
    employeeId: currentUser?.id || employees[0]?.id,
    reason: SICK_REASONS[0],
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
    hasAttest: true,
    attestFileName: 'Arztzeugnis_Dr_Keller.pdf',
    notes: ''
  });

  const [leaveData, setLeaveData] = useState({
    employeeId: currentUser?.id || employees[0]?.id,
    startDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    endDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    days: 5,
    type: 'Erholungsurlaub (Yıllık Tatil)',
    notes: ''
  });

  const handleSaveSick = (e) => {
    e.preventDefault();
    const emp = employees.find(x => x.id === sickData.employeeId);
    StorageService.addSickReport({
      ...sickData,
      employeeName: emp?.name || 'Mitarbeiter'
    });

    setSickReports(StorageService.getSickReports());
    setShowSickModal(false);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  const handleSaveLeave = (e) => {
    e.preventDefault();
    const emp = employees.find(x => x.id === leaveData.employeeId);
    StorageService.addLeaveRequest({
      ...leaveData,
      employeeName: emp?.name || 'Mitarbeiter'
    });

    setLeaveRequests(StorageService.getLeaveRequests());
    setShowLeaveModal(false);
  };

  const handleLeaveDecision = (reqId, status) => {
    StorageService.updateLeaveStatus(reqId, status);
    setLeaveRequests(StorageService.getLeaveRequests());
    setEmployees(StorageService.getEmployees());
  };

  const myEmp = employees.find(e => e.id === currentUser?.id) || employees[0];
  const vacationRemaining = (myEmp?.vacationTotal || 25) - (myEmp?.vacationUsed || 0);

  return (
    <div className="space-y-6">

      <div className="p-6 sm:p-8 rounded-3xl bg-surface text-ink border border-line relative overflow-hidden mb-6 card-inner">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="page-title text-ink">
              {t.sickTitle}
            </h1>
            <p className="text-subhead text-ink-soft max-w-2xl leading-relaxed mt-1">
              {lang === 'tr'
                ? 'Hastalık bildirimleri, doktor raporları, izin talepleri ve vardiya senkronizasyonu.'
                : 'Lückenlose Dokumentation von Krankmeldungen mit Attest-Upload & Urlaubsfreigaben.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowSickModal(true)}
              className="px-4 py-2 rounded-xl card-inner text-ink border border-line text-xs font-bold flex items-center gap-1.5 transition"
            >
              <HeartPulse className="w-4 h-4 text-brand icon-brand" />
              <span>{t.reportSick}</span>
            </button>

            <button
              onClick={() => setShowLeaveModal(true)}
              className="px-4 py-2 rounded-xl btn-brand font-black text-xs flex items-center gap-1.5 transition"
            >
              <Palmtree className="w-4 h-4" />
              <span>{t.leaveRequest}</span>
            </button>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-line-soft flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl icon-box flex items-center justify-center">
              <Palmtree className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] text-subhead">
                {lang === 'tr' ? 'Tatil / İzin Bakiyesi' : 'Urlaubskonto'}: {myEmp.name}
              </p>
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="text-ink font-bold">{myEmp.vacationTotal} {lang === 'tr' ? 'gün' : 'Tage'}</span>
                <span className="text-ink-muted">|</span>
                <span className="text-brand font-semibold">{myEmp.vacationUsed} {lang === 'tr' ? 'kullanıldı' : 'bezogen'}</span>
                <span className="text-ink-muted">|</span>
                <span className="text-brand font-extrabold">{vacationRemaining} {lang === 'tr' ? 'gün kaldı' : 'Resttage'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 card-inner p-1 rounded-2xl border border-line">
            <button
              onClick={() => setActiveTab('sick')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${activeTab === 'sick'
                  ? 'btn-brand font-black'
                  : 'text-ink-soft '
                }`}
            >
              {lang === 'tr' ? 'Hastalık Bildirimleri' : 'Krankmeldungen'} ({sickReports.length})
            </button>
            <button
              onClick={() => setActiveTab('leave')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${activeTab === 'leave'
                  ? 'btn-brand font-black'
                  : 'text-ink-soft '
                }`}
            >
              {lang === 'tr' ? 'İzin Talepleri' : 'Urlaubsanträge'} ({leaveRequests.length})
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'sick' ? (
        <div className="glass-panel p-6">
          <h2 className="text-base font-bold text-ink mb-4 flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-brand" />
            <span>{lang === 'tr' ? 'Bildirilen Hastalık ve Rapor Kayıtları' : 'Erfasste Krankmeldungen & Arbeitsunfähigkeiten'}</span>
          </h2>

          {sickReports.length === 0 ? (
            <div className="text-center py-12 text-ink-muted text-xs">
              <CheckCircle2 className="w-8 h-8 text-ink mx-auto mb-2" />
              <p>{lang === 'tr' ? 'Harika! Aktif bir hastalık bildirimi bulunmuyor.' : 'Keine aktuellen Krankmeldungen verzeichnet.'}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sickReports.map((report) => (
                <div
                  key={report.id}
                  className="p-4 rounded-2xl bg-white border border-line transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-ink">{report.employeeName}</span>
                      <span className="badge badge-rose text-[10px] py-0 px-2">KRANK</span>
                      {report.hasAttest && (
                        <span className="badge badge-emerald text-[10px] py-0 px-2 flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          <span>ATTEST VORHANDEN</span>
                        </span>
                      )}
                    </div>

                    <div className="text-xs font-semibold text-brand">
                      Grund: {report.reason}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-ink-soft">
                      <span>Dauer: {formatDate(report.startDate)} bis {formatDate(report.endDate)}</span>
                      {report.notes && <span>· Notiz: {report.notes}</span>}
                    </div>
                  </div>

                  <div className="self-end md:self-auto flex items-center gap-2">
                    <div className="text-right text-[11px] text-ink-muted">
                      Gemeldet am {formatDate(report.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="glass-panel p-6">
          <h2 className="text-base font-bold text-ink mb-4 flex items-center gap-2">
            <Palmtree className="w-4 h-4 text-ink" />
            <span>{lang === 'tr' ? 'Personel İzin ve Tatil Talepleri' : 'Eingereichte Urlaubsanträge'}</span>
          </h2>

          {leaveRequests.length === 0 ? (
            <div className="text-center py-12 text-ink-muted text-xs">
              <p>{lang === 'tr' ? 'Bekleyen izin talebi yok.' : 'Keine offenen Urlaubsanträge.'}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {leaveRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-4 rounded-2xl bg-white border border-line transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-ink">{req.employeeName}</span>
                      <span className={`badge ${req.status === 'approved'
                          ? 'badge-emerald'
                          : req.status === 'rejected'
                            ? 'badge-rose'
                            : 'badge-amber'
                        } text-[10px] py-0 px-2`}>
                        {req.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="text-xs text-ink-soft">
                      {req.type} ({req.days} {lang === 'tr' ? 'İş Günü' : 'Arbeitstage'})
                    </div>

                    <div className="text-xs text-ink-soft">
                      Von {formatDate(req.startDate)} bis {formatDate(req.endDate)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-auto">
                    {req.status === 'pending' && currentUser?.role === 'admin' ? (
                      <>
                        <button
                          onClick={() => handleLeaveDecision(req.id, 'approved')}
                          className="px-3 py-1.5 rounded-xl bg-emerald-50 text-ink border border-line text-xs font-bold flex items-center gap-1 transition"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-ink" />
                          <span>Genehmigen</span>
                        </button>
                        <button
                          onClick={() => handleLeaveDecision(req.id, 'rejected')}
                          className="px-3 py-1.5 rounded-xl bg-rose-50 text-brand border border-line text-xs font-bold flex items-center gap-1 transition"
                        >
                          <XCircle className="w-3.5 h-3.5 text-brand" />
                          <span>Ablehnen</span>
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-ink-soft">
                        {req.status === 'approved' ? 'Genehmigt von Betriebsleitung' : 'Status aktualisiert'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showSickModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 relative border border-line">
            <div className="flex items-center justify-between border-b border-line pb-3 mb-4">
              <h2 className="text-base font-bold text-ink flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-brand" />
                <span>{t.reportSick} (Krankmeldung)</span>
              </h2>
              <button
                onClick={() => setShowSickModal(false)}
                className="p-1.5 rounded-lg text-ink-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSick} className="space-y-4">
              {currentUser?.role === 'admin' && (
                <div>
                  <label className="block text-xs font-semibold text-ink-soft mb-1">
                    {lang === 'tr' ? 'Hangi Çalışan Hasta?' : 'Betroffener Mitarbeiter'}:
                  </label>
                  <select
                    value={sickData.employeeId}
                    onChange={(e) => setSickData({ ...sickData, employeeId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl card-inner border border-line text-ink text-xs focus:outline-none focus:border-line"
                  >
                    {employees.map(emp => (
                      <option className="text-ink bg-white" key={emp.id} value={emp.id}>
                        {emp.name} ({emp.jobTitle})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-ink-soft mb-1">
                  {t.sickReason} (Grund):
                </label>
                <select
                  value={sickData.reason}
                  onChange={(e) => setSickData({ ...sickData, reason: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl card-inner border border-line text-ink text-xs focus:outline-none focus:border-line"
                >
                  {SICK_REASONS.map((r, i) => (
                    <option className="text-ink bg-white" key={i} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-ink-soft mb-1">
                    {lang === 'tr' ? 'Başlangıç Tarihi' : 'Erster Fehltag'}:
                  </label>
                  <input
                    type="date"
                    required
                    value={sickData.startDate}
                    onChange={(e) => setSickData({ ...sickData, startDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl card-inner border border-line text-ink text-xs focus:outline-none focus:border-line"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-soft mb-1">
                    {lang === 'tr' ? 'Bitiş / Dönüş Tarihi' : 'Voraussichtlich bis'}:
                  </label>
                  <input
                    type="date"
                    required
                    value={sickData.endDate}
                    onChange={(e) => setSickData({ ...sickData, endDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl card-inner border border-line text-ink text-xs focus:outline-none focus:border-line"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl card-inner border border-line">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-ink flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-brand" />
                    <span>{t.uploadAttest}</span>
                  </span>
                  <label className="flex items-center gap-1 text-[11px] text-ink-soft cursor-pointer font-medium">
                    <input
                      type="checkbox"
                      checked={sickData.hasAttest}
                      onChange={(e) => setSickData({ ...sickData, hasAttest: e.target.checked })}
                      className="rounded text-brand"
                    />
                    <span>Liegt vor</span>
                  </label>
                </div>

                {sickData.hasAttest && (
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex-1 px-3 py-2 rounded-xl bg-white border border-line text-xs text-ink-soft flex items-center gap-2">
                      <Camera className="w-4 h-4 text-ink" />
                      <span className="truncate font-mono">{sickData.attestFileName}</span>
                    </div>
                    <label className="px-3 py-2 rounded-xl bg-slate-200 text-xs text-ink font-semibold cursor-pointer transition">
                      <span>Durchsuchen</span>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            setSickData({
                              ...sickData,
                              attestFileName: e.target.files[0].name
                            });
                          }
                        }}
                      />
                    </label>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-soft mb-1">
                  {lang === 'tr' ? 'İlave Not' : 'Zusätzliche Mitteilung an Betriebsleitung'}:
                </label>
                <input
                  type="text"
                  value={sickData.notes}
                  onChange={(e) => setSickData({ ...sickData, notes: e.target.value })}
                  placeholder={lang === 'tr' ? 'Örn: Doktor 3 gün istirahat verdi' : 'z.B. Bettruhe verordnet, telefonisch erreichbar'}
                  className="w-full px-3 py-2 rounded-xl card-inner border border-line text-ink text-xs focus:outline-none focus:border-line"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl btn-brand text-white font-bold text-xs transition"
                >
                  {lang === 'tr' ? 'Hastalık Bildirimini Gönder' : 'Krankmeldung verbindlich absenden'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showLeaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 relative border border-line">
            <div className="flex items-center justify-between border-b border-line pb-3 mb-4">
              <h2 className="text-base font-bold text-ink flex items-center gap-2">
                <Palmtree className="w-5 h-5 text-ink" />
                <span>{t.leaveRequest}</span>
              </h2>
              <button
                onClick={() => setShowLeaveModal(false)}
                className="p-1.5 rounded-lg text-ink-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLeave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-ink-soft mb-1">
                    {lang === 'tr' ? 'İlk Gün' : 'Von'}:
                  </label>
                  <input
                    type="date"
                    required
                    value={leaveData.startDate}
                    onChange={(e) => setLeaveData({ ...leaveData, startDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl card-inner border border-line text-ink text-xs focus:outline-none focus:border-line"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-soft mb-1">
                    {lang === 'tr' ? 'Son Gün' : 'Bis'}:
                  </label>
                  <input
                    type="date"
                    required
                    value={leaveData.endDate}
                    onChange={(e) => setLeaveData({ ...leaveData, endDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl card-inner border border-line text-ink text-xs focus:outline-none focus:border-line"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-soft mb-1">
                  {lang === 'tr' ? 'İzin Türü' : 'Urlaubsart'}:
                </label>
                <select
                  value={leaveData.type}
                  onChange={(e) => setLeaveData({ ...leaveData, type: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl card-inner border border-line text-ink text-xs focus:outline-none focus:border-line"
                >
                  <option className="text-ink bg-white" value="Erholungsurlaub (Yıllık İzin)">Erholungsurlaub (Yıllık İzin)</option>
                  <option className="text-ink bg-white" value="Kompensation Überstunden (Fazla Mesai İzni)">Kompensation Überstunden (Fazla Mesai İzni)</option>
                  <option className="text-ink bg-white" value="Sonderurlaub (Özel İzin)">Sonderurlaub (Özel İzin)</option>
                  <option className="text-ink bg-white" value="Unbezahlter Urlaub (Ücretsiz İzin)">Unbezahlter Urlaub (Ücretsiz İzin)</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl btn-brand font-bold text-xs transition"
                >
                  {lang === 'tr' ? 'İzin Talebini Onaya Gönder' : 'Urlaubsantrag einreichen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
