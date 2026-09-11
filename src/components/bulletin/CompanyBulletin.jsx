import React, { useState } from 'react';
import {
  Megaphone,
  Pin,
  Plus,
  Eye,
  Calendar,
  User,
  AlertCircle,
  Tag,
  MessageSquare,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { formatDate } from '../../utils/formatters';

export const CompanyBulletin = ({ lang, currentUser }) => {
  const [bulletins, setBulletins] = useState(() => StorageService.getBulletins());
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('info'); // 'urgent' | 'info' | 'rule' | 'event'
  const [isPinned, setIsPinned] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');

  const isAdmin = currentUser?.role === 'admin';

  const handleAddBulletin = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newBul = StorageService.addBulletin({
      title: title.trim(),
      titleTr: title.trim(),
      content: content.trim(),
      contentTr: content.trim(),
      category,
      author: currentUser?.name || 'Geschäftsleitung',
      pinned: isPinned
    });

    setBulletins(StorageService.getBulletins());
    setTitle('');
    setContent('');
    setShowAddModal(false);
  };

  const filteredBulletins = bulletins
    .filter(b => filterCategory === 'all' || b.category === filterCategory)
    .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  const getCategoryBadge = (cat) => {
    switch (cat) {
      case 'urgent':
        return <span className="badge badge-rose text-[10px]">🚨 {lang === 'tr' ? 'ACİL / DRINGEND' : 'DRINGEND'}</span>;
      case 'rule':
        return <span className="badge badge-amber text-[10px]">📋 {lang === 'tr' ? 'KURAL & TALİMAT' : 'REGEL & VORSCHRIFT'}</span>;
      case 'event':
        return <span className="badge badge-purple text-[10px]">🎉 {lang === 'tr' ? 'ETKİNLİK' : 'EVENT'}</span>;
      default:
        return <span className="badge badge-blue text-[10px]">ℹ️ {lang === 'tr' ? 'BİLGİ' : 'INFORMATION'}</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl glass-panel relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 border border-violet-200 text-violet-800 text-xs font-semibold mb-2">
              <Megaphone className="w-3.5 h-3.5 text-violet-600" />
              <span>{lang === 'tr' ? 'Şirket İçi İletişim & Dijital Pano' : 'Digitales Schwarzes Brett & Team-Aushang'}</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {lang === 'tr' ? 'Şirket Duyuru Panosu & Notlar' : 'Schwarzes Brett & Bekanntmachungen'}
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl">
              {lang === 'tr'
                ? 'Patron ve yönetimin tüm ekibe doğrudan duyurduğu önemli talimatlar, çalışma kuralları ve etkinlik bildirimleri.'
                : 'Zentrale Plattform für interne Mitteilungen, Arbeitsanweisungen, Hygienehinweise und Schicht-Updates.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2.5 rounded-2xl gradient-btn-purple text-white text-xs font-extrabold flex items-center gap-2 shadow-sm transition"
              >
                <Plus className="w-4 h-4" />
                <span>{lang === 'tr' ? 'Yeni Duyuru Yayınla' : 'Neue Mitteilung verfassen'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 mt-6 border-t border-slate-100 pt-4">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              filterCategory === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {lang === 'tr' ? 'Tümü' : 'Alle Bekanntmachungen'} ({bulletins.length})
          </button>
          <button
            onClick={() => setFilterCategory('urgent')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              filterCategory === 'urgent'
                ? 'bg-rose-600 text-white'
                : 'bg-rose-50 border border-rose-200 text-rose-800 hover:bg-rose-100'
            }`}
          >
            🚨 {lang === 'tr' ? 'Acil Duyurular' : 'Dringend'}
          </button>
          <button
            onClick={() => setFilterCategory('rule')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              filterCategory === 'rule'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100'
            }`}
          >
            📋 {lang === 'tr' ? 'Kurallar & Talimatlar' : 'Regeln'}
          </button>
          <button
            onClick={() => setFilterCategory('info')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              filterCategory === 'info'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-50 border border-blue-200 text-blue-800 hover:bg-blue-100'
            }`}
          >
            ℹ️ {lang === 'tr' ? 'Genel Bilgi' : 'Infos'}
          </button>
        </div>
      </div>

      {/* Bulletin Cards Feed */}
      <div className="space-y-4">
        {filteredBulletins.map((item) => {
          return (
            <div
              key={item.id}
              className={`p-6 rounded-3xl bg-white border transition shadow-xs relative overflow-hidden ${
                item.pinned ? 'border-violet-300 ring-2 ring-violet-100' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {item.pinned && (
                <div className="absolute top-4 right-4 flex items-center gap-1 text-[11px] font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded-md border border-violet-200">
                  <Pin className="w-3 h-3 fill-violet-700" />
                  <span>{lang === 'tr' ? 'Sabitlenmiş' : 'Angepinnt'}</span>
                </div>
              )}

              <div className="flex items-center gap-2.5 mb-3">
                {getCategoryBadge(item.category)}
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-500 flex items-center gap-1 font-semibold">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(item.date)}
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-600 flex items-center gap-1 font-bold">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  {item.author}
                </span>
              </div>

              <h2 className="text-lg font-black text-slate-900 mb-2">
                {lang === 'tr' ? item.titleTr || item.title : item.title}
              </h2>

              <p className="text-xs leading-relaxed text-slate-700 whitespace-pre-line mb-4">
                {lang === 'tr' ? item.contentTr || item.content : item.content}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{item.views || 10} {lang === 'tr' ? 'çalışan gördü' : 'Aufrufe'}</span>
                </span>
                <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{lang === 'tr' ? 'Resmi Şirket Duyurusu' : 'Offizielle Mitteilung'}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-xl border border-slate-200">
            <h3 className="font-bold text-base text-slate-900 mb-1">
              {lang === 'tr' ? 'Yeni Duyuru Yayınla' : 'Neue Team-Mitteilung'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {lang === 'tr' ? 'Bu duyuru tüm personelin panosunda görüntülenecektir.' : 'Erscheint auf allen Mitarbeiter-Dashboards.'}
            </p>

            <form onSubmit={handleAddBulletin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'tr' ? 'Başlık' : 'Titel der Mitteilung'}
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="z.B. Neue Öffnungszeiten am Feiertag..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'tr' ? 'Kategori' : 'Kategorie'}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-violet-500"
                >
                  <option value="info">ℹ️ Information (Genel Bilgi)</option>
                  <option value="urgent">🚨 Dringend (Acil Duyuru)</option>
                  <option value="rule">📋 Regel / Vorschrift (Kural)</option>
                  <option value="event">🎉 Event / Anlass (Etkinlik)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'tr' ? 'Duyuru Metni' : 'Nachricht / Inhalt'}
                </label>
                <textarea
                  required
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Inhalt der Bekanntmachung hier eingeben..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pinNotice"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500 border-slate-300"
                />
                <label htmlFor="pinNotice" className="text-xs font-medium text-slate-700 cursor-pointer">
                  {lang === 'tr' ? 'Panonun en üstüne sabitle (Angepinnt)' : 'Ganz oben anpinnen'}
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold hover:bg-slate-200 transition"
                >
                  {lang === 'tr' ? 'İptal' : 'Abbrechen'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl gradient-btn-purple text-white text-xs font-bold transition"
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
