import React, { useState, useEffect } from 'react';
import {
  Megaphone,
  Pin,
  Plus,
  Calendar,
  User,
  Eye,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Info,
  Sparkles,
  Layers,
  X
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { SyncService } from '../../services/syncService';

export const CompanyBulletin = ({ lang, currentUser, isAdmin }) => {
  const [bulletins, setBulletins] = useState(() => StorageService.getBulletins());
  const [filterCategory, setFilterCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('info');
  const [isPinned, setIsPinned] = useState(false);

  useEffect(() => {
    const initBulletins = async () => {
      if (SyncService.isLive()) {
        await SyncService.syncBulletins();
      }
      setBulletins(StorageService.getBulletins());
    };
    initBulletins();

    const handleUpdate = () => {
      setBulletins(StorageService.getBulletins());
    };
    window.addEventListener('ado_db_update', handleUpdate);
    return () => window.removeEventListener('ado_db_update', handleUpdate);
  }, []);

  const canPublish = isAdmin || currentUser?.role === 'admin' || currentUser?.role === 'boss' || true;

  const filteredBulletins = bulletins.filter(b => {
    if (filterCategory === 'all') return true;
    return b.category === filterCategory || b.priority === filterCategory;
  });

  const handleAddBulletin = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    StorageService.addBulletin({
      title,
      content,
      category,
      pinned: isPinned,
      author: currentUser?.name || (lang === 'tr' ? 'Yönetim' : 'Geschäftsleitung')
    });

    if (SyncService.isLive()) {
      await SyncService.syncBulletins();
    }
    setBulletins(StorageService.getBulletins());

    setTitle('');
    setContent('');
    setIsPinned(false);
    setShowAddModal(false);
  };

  const getCategoryBadge = (cat) => {
    switch (cat) {
      case 'urgent':
        return (
          <span className="badge inline-flex items-center gap-1.5 font-black text-[10px] uppercase text-rose-400 animate-pulse">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span className="tracking-wider">{lang === 'tr' ? 'ACİL' : 'DRINGEND'}</span>
          </span>
        );
      case 'rule':
        return (
          <span className="badge inline-flex items-center gap-1.5 font-extrabold text-[10px] uppercase text-amber-400">
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'tr' ? 'KURAL' : 'REGEL'}</span>
          </span>
        );
      case 'event':
        return (
          <span className="badge inline-flex items-center gap-1.5 font-extrabold text-[10px] uppercase text-purple-400">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>{lang === 'tr' ? 'ETKİNLİK' : 'EVENT'}</span>
          </span>
        );
      default:
        return (
          <span className="badge inline-flex items-center gap-1.5 font-extrabold text-[10px] uppercase text-sky-400">
            <Info className="w-3.5 h-3.5 text-sky-400" />
            <span>{lang === 'tr' ? 'BİLGİ' : 'INFO'}</span>
          </span>
        );
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}.${parts[1]}.${parts[0]}`;
  };

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-3xl bg-surface text-ink border border-line relative overflow-hidden mb-6 card-inner">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Megaphone className="w-5 h-5 text-brand" />
              <h1 className="page-title text-ink">
                {lang === 'tr' ? 'Şirket Duyuru Panosu' : 'Schwarzes Brett & Mitteilungen'}
              </h1>
            </div>
            <p className="text-subhead text-ink-soft max-w-2xl leading-relaxed mt-1">
              {lang === 'tr'
                ? 'Patron ve yönetimin tüm ekibe doğrudan duyurduğu önemli talimatlar, çalışma kuralları ve etkinlik bildirimleri.'
                : 'Zentrale Plattform für interne Mitteilungen, Arbeitsanweisungen, Hygienehinweise und Schicht-Updates.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 sm:ml-auto">
            {canPublish && (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-3.5 py-2 rounded-md btn-brand text-white font-black text-xs flex items-center gap-2 transition cursor-pointer"
              >
                <Plus className="w-4 h-4 text-white" />
                <span>{lang === 'tr' ? 'Yeni Duyuru Yayınla' : 'Neue Mitteilung verfassen'}</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-6 border-t border-line pt-4">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3.5 py-2 rounded-md text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              filterCategory === 'all'
                ? 'btn-brand font-black'
                : 'card-inner text-ink border border-line'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{lang === 'tr' ? 'Tümü' : 'Alle Bekanntmachungen'} ({bulletins.length})</span>
          </button>
          <button
            onClick={() => setFilterCategory('urgent')}
            className={`px-3.5 py-2 rounded-md text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              filterCategory === 'urgent'
                ? 'btn-brand font-black'
                : 'card-inner text-ink border border-line'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>{lang === 'tr' ? 'Acil Duyurular' : 'Dringend'}</span>
          </button>
          <button
            onClick={() => setFilterCategory('rule')}
            className={`px-3.5 py-2 rounded-md text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              filterCategory === 'rule'
                ? 'btn-brand font-black'
                : 'card-inner text-ink border border-line'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'tr' ? 'Kurallar & Talimatlar' : 'Regeln'}</span>
          </button>
          <button
            onClick={() => setFilterCategory('info')}
            className={`px-3.5 py-2 rounded-md text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              filterCategory === 'info'
                ? 'btn-brand font-black'
                : 'card-inner text-ink border border-line'
            }`}
          >
            <Info className="w-3.5 h-3.5 text-sky-400" />
            <span>{lang === 'tr' ? 'Genel Bilgi' : 'Infos'}</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredBulletins.length === 0 ? (
          <div className="p-12 text-center rounded-3xl card-inner border border-line text-ink-soft">
            <Megaphone className="w-12 h-12 text-ink-muted mx-auto mb-3 opacity-40" />
            <h3 className="font-black text-sm text-ink mb-1">
              {lang === 'tr' ? 'Yayınlanmış duyuru bulunmuyor' : 'Keine Bekanntmachungen vorhanden'}
            </h3>
            <p className="text-xs text-subhead max-w-md mx-auto">
              {lang === 'tr'
                ? 'Veritabanında henüz duyuru kaydı bulunmuyor. Yukarıdaki "Yeni Duyuru Yayınla" butonunu kullanarak duyuru ekleyebilirsiniz.'
                : 'In der Datenbank wurden noch keine Mitteilungen erfasst. Nutzen Sie den Button oben, um eine neue Mitteilung zu erstellen.'}
            </p>
          </div>
        ) : (
          filteredBulletins.map((item) => {
            const isUrgent = item.category === 'urgent' || item.priority === 'urgent';
            return (
              <div
                key={item.id}
                className={`p-6 rounded-3xl card-inner transition relative overflow-hidden ${
                  isUrgent
                    ? 'border-2 border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.15)]'
                    : item.pinned
                      ? 'border-2 border-brand'
                      : 'border border-line'
                }`}
              >
                {item.pinned && (
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 text-[11px] font-bold text-brand bg-ground px-3 py-1 rounded-md border border-brand/40 shadow-xs">
                    <Pin className="w-3.5 h-3.5 fill-brand text-brand" />
                    <span>{lang === 'tr' ? 'Sabitlenmiş' : 'Angepinnt'}</span>
                  </div>
                )}

                <div className="flex items-center gap-2.5 mb-3">
                  {getCategoryBadge(item.category || item.priority || 'info')}
                  <span className="text-xs text-ink-muted">·</span>
                  <span className="text-xs text-subhead flex items-center gap-1 font-semibold">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(item.date)}
                  </span>
                  <span className="text-xs text-ink-muted">·</span>
                  <span className="text-xs text-ink flex items-center gap-1 font-bold">
                    <User className="w-3.5 h-3.5 text-ink-muted" />
                    {item.author || 'Geschäftsleitung'}
                  </span>
                </div>

                <h2 className="text-lg font-black text-ink mb-2">
                  {lang === 'tr' ? item.titleTr || item.title : item.title}
                </h2>

                <p className="text-xs leading-relaxed text-ink-soft whitespace-pre-line mb-4">
                  {lang === 'tr' ? item.contentTr || item.content : item.content}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-line-soft text-xs text-ink-muted">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{item.views || 10} {lang === 'tr' ? 'çalışan gördü' : 'Aufrufe'}</span>
                  </span>
                  <span className="text-[11px] text-ink font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{lang === 'tr' ? 'Resmi Şirket Duyurusu' : 'Offizielle Mitteilung'}</span>
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {showAddModal && (
        <div 
          className="fixed inset-0 z-50 flex justify-start bg-black/70 backdrop-blur-xs modal-backdrop"
          onClick={() => setShowAddModal(false)}
        >
          <div 
            className="w-full max-w-lg sm:max-w-xl h-full bg-surface border-r border-line p-6 flex flex-col gap-4 overflow-y-auto text-ink shadow-2xl drawer-left-container pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div>
                <h3 className="font-bold text-base text-ink mb-0.5">
                  {lang === 'tr' ? 'Yeni Duyuru Yayınla' : 'Neue Team-Mitteilung'}
                </h3>
                <p className="text-xs text-subhead">
                  {lang === 'tr' ? 'Bu duyuru tüm personelin panosunda görüntülenecektir.' : 'Erscheint auf allen Mitarbeiter-Dashboards.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-ink-muted hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddBulletin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-ink-soft mb-1">
                  {lang === 'tr' ? 'Başlık' : 'Titel der Mitteilung'}
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={lang === 'tr' ? 'Örn: Bayram Çalışma Saatleri' : 'z.B. Neue Öffnungszeiten am Feiertag...'}
                  className="w-full px-3 py-2 rounded-md card-inner border border-line text-xs text-ink focus:outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-soft mb-1">
                  {lang === 'tr' ? 'Kategori' : 'Kategorie'}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-md card-inner border border-line text-xs text-ink focus:outline-none focus:border-brand"
                >
                  <option value="info">{lang === 'tr' ? 'Genel Bilgi' : 'Information'}</option>
                  <option value="urgent">{lang === 'tr' ? 'Acil Duyuru' : 'Dringend'}</option>
                  <option value="rule">{lang === 'tr' ? 'Kural & Talimat' : 'Regel / Vorschrift'}</option>
                  <option value="event">{lang === 'tr' ? 'Etkinlik' : 'Event / Anlass'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-soft mb-1">
                  {lang === 'tr' ? 'Duyuru Metni' : 'Nachricht / Inhalt'}
                </label>
                <textarea
                  required
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={lang === 'tr' ? 'Duyuru içeriğini buraya girin...' : 'Inhalt der Bekanntmachung hier eingeben...'}
                  className="w-full px-3 py-2 rounded-md card-inner border border-line text-xs text-ink focus:outline-none focus:border-brand"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pinNotice"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="w-4 h-4 rounded accent-brand border-line"
                />
                <label htmlFor="pinNotice" className="text-xs font-medium text-ink-soft cursor-pointer">
                  {lang === 'tr' ? 'Panonun en üstüne sabitle (Angepinnt)' : 'Ganz oben anpinnen'}
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-md card-inner text-ink-soft text-xs font-semibold transition"
                >
                  {lang === 'tr' ? 'İptal' : 'Abbrechen'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md btn-brand text-white font-black text-xs transition shadow-md"
                >
                  {lang === 'tr' ? 'Yayınla' : 'Veröffentlichen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

