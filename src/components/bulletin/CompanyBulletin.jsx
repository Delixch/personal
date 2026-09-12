import React, { useState } from 'react';
import { Megaphone, Pin, Plus, Calendar, User, Eye, CheckCircle2 } from 'lucide-react';
import { SEED_BULLETINS } from '../../services/seedData';

export const CompanyBulletin = ({ lang, isAdmin }) => {
  const [bulletins, setBulletins] = useState(SEED_BULLETINS);
  const [filterCategory, setFilterCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('info');
  const [isPinned, setIsPinned] = useState(false);

  const filteredBulletins = bulletins.filter(b => {
    if (filterCategory === 'all') return true;
    return b.category === filterCategory;
  });

  const handleAddBulletin = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newBulletin = {
      id: `bulletin_${Date.now()}`,
      title,
      content,
      category,
      pinned: isPinned,
      date: new Date().toISOString().split('T')[0],
      author: 'Geschäftsleitung',
      views: 1
    };

    if (isPinned) {
      setBulletins([newBulletin, ...bulletins]);
    } else {
      setBulletins([...bulletins, newBulletin]);
    }

    setTitle('');
    setContent('');
    setIsPinned(false);
    setShowAddModal(false);
  };

  const getCategoryBadge = (cat) => {
    switch (cat) {
      case 'urgent':
        return <span className="badge badge-rose font-bold text-[10px] uppercase">🚨 Dringend</span>;
      case 'rule':
        return <span className="badge badge-amber font-bold text-[10px] uppercase">📋 Regel</span>;
      case 'event':
        return <span className="badge badge-purple font-bold text-[10px] uppercase">🎉 Event</span>;
      default:
        return <span className="badge badge-sky font-bold text-[10px] uppercase">ℹ️ Info</span>;
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
      <div className="p-6 sm:p-8 rounded-3xl bg-surface text-ink border border-line relative overflow-hidden mb-6 card-inner">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Megaphone className="w-5 h-5 text-brand" />
              <h1 className="text-xl sm:text-2xl font-black text-ink">
                {lang === 'tr' ? 'Şirket Duyuru Panosu' : 'Schwarzes Brett & Mitteilungen'}
              </h1>
            </div>
            <p className="text-subhead text-ink-soft max-w-2xl leading-relaxed mt-1">
              {lang === 'tr'
                ? 'Patron ve yönetimin tüm ekibe doğrudan duyurduğu önemli talimatlar, çalışma kuralları ve etkinlik bildirimleri.'
                : 'Zentrale Plattform für interne Mitteilungen, Arbeitsanweisungen, Hygienehinweise und Schicht-Updates.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isAdmin && (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2.5 rounded-2xl btn-brand text-white text-xs font-black flex items-center gap-2 transition"
              >
                <Plus className="w-4 h-4" />
                <span>{lang === 'tr' ? 'Yeni Duyuru Yayınla' : 'Neue Mitteilung verfassen'}</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-6 border-t border-line-soft pt-4">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              filterCategory === 'all'
                ? 'btn-brand text-white font-black'
                : 'card-inner border border-line text-ink'
            }`}
          >
            {lang === 'tr' ? 'Tümü' : 'Alle Bekanntmachungen'} ({bulletins.length})
          </button>
          <button
            onClick={() => setFilterCategory('urgent')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              filterCategory === 'urgent'
                ? 'btn-brand text-white font-black'
                : 'card-inner border border-line text-ink'
            }`}
          >
            🚨 {lang === 'tr' ? 'Acil Duyurular' : 'Dringend'}
          </button>
          <button
            onClick={() => setFilterCategory('rule')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              filterCategory === 'rule'
                ? 'btn-brand text-white font-black'
                : 'card-inner border border-line text-ink'
            }`}
          >
            📋 {lang === 'tr' ? 'Kurallar & Talimatlar' : 'Regeln'}
          </button>
          <button
            onClick={() => setFilterCategory('info')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              filterCategory === 'info'
                ? 'btn-brand text-white font-black'
                : 'card-inner border border-line text-ink'
            }`}
          >
            ℹ️ {lang === 'tr' ? 'Genel Bilgi' : 'Infos'}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredBulletins.map((item) => {
          return (
            <div
              key={item.id}
              className={`p-6 rounded-3xl card-inner border border-line transition relative overflow-hidden ${
                item.pinned ? 'border-brand ring-2 ring-brand/20' : ''
              }`}
            >
              {item.pinned && (
                <div className="absolute top-4 right-4 flex items-center gap-1 text-[11px] font-bold text-brand bg-subtle px-2 py-0.5 rounded-md border border-line-soft">
                  <Pin className="w-3 h-3 fill-brand text-brand" />
                  <span>{lang === 'tr' ? 'Sabitlenmiş' : 'Angepinnt'}</span>
                </div>
              )}

              <div className="flex items-center gap-2.5 mb-3">
                {getCategoryBadge(item.category)}
                <span className="text-xs text-ink-muted">·</span>
                <span className="text-xs text-subhead flex items-center gap-1 font-semibold">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(item.date)}
                </span>
                <span className="text-xs text-ink-muted">·</span>
                <span className="text-xs text-ink flex items-center gap-1 font-bold">
                  <User className="w-3.5 h-3.5 text-ink-muted" />
                  {item.author}
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
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{lang === 'tr' ? 'Resmi Şirket Duyurusu' : 'Offizielle Mitteilung'}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark">
          <div className="w-full max-w-lg bg-surface rounded-3xl p-6 border border-line card-inner">
            <h3 className="font-bold text-base text-ink mb-1">
              {lang === 'tr' ? 'Yeni Duyuru Yayınla' : 'Neue Team-Mitteilung'}
            </h3>
            <p className="text-xs text-subhead mb-4">
              {lang === 'tr' ? 'Bu duyuru tüm personelin panosunda görüntülenecektir.' : 'Erscheint auf allen Mitarbeiter-Dashboards.'}
            </p>

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
                  placeholder="z.B. Neue Öffnungszeiten am Feiertag..."
                  className="w-full px-3 py-2 rounded-xl card-inner border border-line text-xs text-ink focus:outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-soft mb-1">
                  {lang === 'tr' ? 'Kategori' : 'Kategorie'}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl card-inner border border-line text-xs text-ink focus:outline-none focus:border-brand"
                >
                  <option value="info">ℹ️ Information (Genel Bilgi)</option>
                  <option value="urgent">🚨 Dringend (Acil Duyuru)</option>
                  <option value="rule">📋 Regel / Vorschrift (Kural)</option>
                  <option value="event">🎉 Event / Anlass (Etkinlik)</option>
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
                  placeholder="Inhalt der Bekanntmachung hier eingeben..."
                  className="w-full px-3 py-2 rounded-xl card-inner border border-line text-xs text-ink focus:outline-none focus:border-brand"
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
                  className="px-4 py-2 rounded-xl card-inner text-ink-soft text-xs font-semibold transition"
                >
                  {lang === 'tr' ? 'İptal' : 'Abbrechen'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl btn-brand text-white text-xs font-bold transition"
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
