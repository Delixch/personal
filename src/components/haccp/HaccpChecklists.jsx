import React, { useState } from 'react';
import {
  ShieldCheck,
  Thermometer,
  CheckCircle2,
  AlertTriangle,
  Clock,
  UserCheck,
  Sparkles,
  Download,
  Plus,
  Calendar,
  RotateCcw,
  CheckSquare,
  Square,
  Sun,
  Moon
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { StorageService } from '../../services/storage';
import { formatDate } from '../../utils/formatters';

export const HaccpChecklists = ({ lang, currentUser }) => {
  const [activeTab, setActiveTab] = useState('temp');
  const [temperatures, setTemperatures] = useState(() => StorageService.getTemperatureLogs());
  const [checklists, setChecklists] = useState(() => StorageService.getHaccpChecklists());
  const [selectedShift, setSelectedShift] = useState('morning');
  const [editingTempId, setEditingTempId] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  const handleToggleTask = (id) => {
    const updated = StorageService.toggleHaccpItem(id, currentUser?.name || 'Mitarbeiter');
    setChecklists([...updated]);

    const currentCategoryItems = updated.filter(i => i.category === selectedShift);
    const allDone = currentCategoryItems.length > 0 && currentCategoryItems.every(i => i.done);
    if (allDone) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  };

  const handleSaveTemp = (id) => {
    if (tempValue === '' || isNaN(tempValue)) return;
    const updated = StorageService.updateTemperature(id, tempValue, currentUser?.name || 'Mitarbeiter');
    setTemperatures([...updated]);
    setEditingTempId(null);
    setTempValue('');
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const updated = StorageService.addHaccpItem({
      category: selectedShift,
      title: newTaskTitle.trim(),
      titleTr: newTaskTitle.trim(),
      completedBy: null,
      time: null
    });
    setChecklists([...updated]);
    setNewTaskTitle('');
    setShowAddModal(false);
  };

  const filteredTasks = checklists.filter(c => c.category === selectedShift);
  const completedCount = filteredTasks.filter(c => c.done).length;
  const progressPercent = filteredTasks.length > 0 ? Math.round((completedCount / filteredTasks.length) * 100) : 0;

  const exportHaccpReport = () => {
    const lines = [
      `HACCP KONTROLLBERICHT - ${todayStr}`,
      `Betrieb: ADO Gastronomie & Bäckerei CH`,
      `Geprüft durch: ${currentUser?.name}`,
      `=======================================`,
      `\n1. TEMPERATURKONTROLLE:`,
      ...temperatures.map(t => `- ${t.location}: ${t.currentTemp}°C (${t.status.toUpperCase()}) | Geprüft: ${t.checkedBy || '-'} um ${t.checkedAt || '-'}`),
      `\n2. REINIGUNG & HYGIENE CHECKLISTEN:`,
      ...checklists.map(c => `- [${c.done ? 'X' : ' '}] ${c.title} (${c.done ? 'Erledigt von ' + c.completedBy + ' um ' + c.time : 'Offen'})`),
      `\nKonform mit Lebensmittelgesetz (LMG) & Verordnung EDI über Hygiene (HyV)`
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HACCP_Protokoll_${todayStr}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner — Symmetrical Executive Header Card matching Dashboard (Image 2) */}
      <div className="p-5 rounded-3xl bg-surface text-ink border border-line relative overflow-hidden mb-6 card-inner">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h1 className="page-title text-ink">
              {lang === 'tr' ? 'HACCP & Günlük Hijyen Listeleri' : 'HACCP & Tägliche Kontrolllisten'}
            </h1>
            <p className="text-subhead text-ink-soft leading-relaxed mt-1">
              {lang === 'tr'
                ? 'Kanton gıda denetimi gereksinimlerine tam uygun soğutucu sıcaklık ölçümleri, sabah açılış ve akşam kapanış görev takip sistemi.'
                : 'Lückenlose Dokumentation nach Lebensmittelrecht (HyV/LMG) für Kühlräume, Tiefkühler und tägliche Reinigungs- & Schliesskontrollen.'}
            </p>
          </div>

          <div className="w-full md:w-fit flex flex-col gap-2 shrink-0 md:items-end">
            <button
              onClick={exportHaccpReport}
              className="w-full px-3.5 py-2 rounded-md card-inner text-ink border border-line hover:border-brand font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Download className="w-4 h-4 text-brand icon-brand shrink-0" />
              <span>{lang === 'tr' ? 'HACCP Raporu İndir' : 'HACCP Protokoll Export'}</span>
            </button>

            <button
              onClick={() => setActiveTab('temp')}
              className={`w-full px-3.5 py-2 rounded-md text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                activeTab === 'temp'
                  ? 'btn-brand font-black'
                  : 'card-inner text-ink border border-line'
              }`}
            >
              <Thermometer className="w-4 h-4 shrink-0" />
              <span>{lang === 'tr' ? 'Soğuk Oda Sıcaklıkları' : 'Temperaturkontrolle'}</span>
            </button>

            <button
              onClick={() => setActiveTab('checklists')}
              className={`w-full px-3.5 py-2 rounded-md text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                activeTab === 'checklists'
                  ? 'btn-brand font-black'
                  : 'card-inner text-ink border border-line'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{lang === 'tr' ? 'Açılış & Kapanış Listeleri' : 'Tägliche Checklisten'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: TEMPERATURE LOGS */}
      {activeTab === 'temp' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {temperatures.map((item) => {
              const isEditing = editingTempId === item.id;
              const isOk = item.status === 'ok';

              return (
                <div
                  key={item.id}
                  className={`p-5 rounded-3xl card-inner border border-line transition flex flex-col justify-between ${
                    isOk ? 'border-line ' : 'border-brand-border bg-subtle'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[11px] font-extrabold whitespace-nowrap ${
                        isOk ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {isOk ? (lang === 'tr' ? '● NORMDA' : '● IN DER NORM') : (lang === 'tr' ? '⚠️ SIZINTI / LİMİT AŞIMI!' : '⚠️ GRENZWERT!')}
                      </span>
                      <span className="text-[11px] text-subhead font-mono">
                        {item.targetRange}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-ink mb-1">
                      {lang === 'tr' ? item.locationTr || item.location : item.location}
                    </h3>
                    <p className="text-[11px] text-subhead mb-4">
                      {lang === 'tr' ? 'Hedef Aralık' : 'Sollwert'}: <span className="font-semibold text-ink">{item.targetRange}</span>
                    </p>

                    {/* Current Temp Display / Input */}
                    <div className="p-4 rounded-2xl bg-surface card-inner border border-line text-center mb-4">
                      {isEditing ? (
                        <div className="flex items-center justify-center gap-2">
                          <input
                            type="number"
                            step="0.1"
                            autoFocus
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            placeholder={item.currentTemp.toString()}
                            className="w-24 px-2 py-1 text-center font-mono font-black text-xl bg-surface border border-brand rounded-lg text-ink focus:outline-none card-inner"
                          />
                          <span className="text-subhead font-bold">°C</span>
                          <button
                            onClick={() => handleSaveTemp(item.id)}
                            className="px-2 py-1 btn-brand text-white rounded-lg text-xs font-black transition"
                          >
                            OK
                          </button>
                        </div>
                      ) : (
                        <div>
                          <div className={`font-mono text-3xl font-black ${
                            isOk ? 'text-ink' : 'text-brand'
                          }`}>
                            {item.currentTemp > 0 ? `+${item.currentTemp}` : item.currentTemp}°C
                          </div>
                          <p className="text-[10px] text-subhead mt-1">
                            {lang === 'tr' ? 'Son Ölçüm' : 'Letzte Messung'}: {item.checkedAt} Uhr
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] text-subhead mb-3 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5 text-brand icon-brand" />
                        <span>{item.checkedBy || (lang === 'tr' ? 'Henüz Ölçülmedi' : 'Noch offen')}</span>
                      </span>
                      <span className="text-subhead">{item.checkedAt || '-'}</span>
                    </div>

                    {!isEditing ? (
                      <button
                        onClick={() => {
                          setEditingTempId(item.id);
                          setTempValue(item.currentTemp.toString());
                        }}
                        className="w-full py-2 rounded-xl bg-surface card-inner text-ink text-xs font-bold border border-line transition"
                      >
                        {lang === 'tr' ? 'Sıcaklık Gir / Güncelle' : 'Temperatur erfassen'}
                      </button>
                    ) : (
                      <button
                        onClick={() => setEditingTempId(null)}
                        className="w-full py-2 rounded-xl bg-surface card-inner text-subhead text-xs font-semibold transition"
                      >
                        {lang === 'tr' ? 'İptal' : 'Abbrechen'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 rounded-2xl bg-surface card-inner border border-brand-border text-brand text-xs flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-brand icon-brand shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">
                {lang === 'tr' ? 'İsviçre Gıda Yönetmeliği Kuralı:' : 'Schweizer Lebensmittelrecht (Hygiene-Vorschrift):'}
              </p>
              <p className="mt-0.5 text-subhead">
                {lang === 'tr'
                  ? 'Kühlraum sıcaklıkları günde en az iki kez (sabah açılışta ve akşam kapanışta) kayıt altına alınmalıdır. +5.0°C üzerindeki sapmalar derhal müdahaleyi gerektirir.'
                  : 'Kühlhaustemperaturen müssen mindestens zweimal täglich (Morgen und Abend) digital oder handschriftlich protokolliert werden. Überschreitungen über +5.0°C müssen unverzüglich gemeldet werden.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DAILY CHECKLISTS */}
      {activeTab === 'checklists' && (
        <div className="space-y-6">
          
          {/* Shift Selection & Progress */}
          <div className="p-5 rounded-3xl bg-surface border border-line flex flex-col md:flex-row md:items-center justify-between gap-4 card-inner">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedShift('morning')}
                className={`px-3.5 py-2 rounded-md text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  selectedShift === 'morning'
                    ? 'btn-brand font-black'
                    : 'card-inner text-ink border border-line'
                }`}
              >
                <Sun className="w-4 h-4 shrink-0 text-amber-400" />
                <span>{lang === 'tr' ? 'Sabah / Açılış Kontrolü (Frühschicht)' : 'Morgenkontrolle (Frühschicht)'}</span>
              </button>
              <button
                onClick={() => setSelectedShift('evening')}
                className={`px-3.5 py-2 rounded-md text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  selectedShift === 'evening'
                    ? 'btn-brand font-black'
                    : 'card-inner text-ink border border-line'
                }`}
              >
                <Moon className="w-4 h-4 shrink-0 text-indigo-400" />
                <span>{lang === 'tr' ? 'Akşam / Kapanış Kontrolü (Spätschicht)' : 'Abendkontrolle (Spätschicht)'}</span>
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-xs font-bold text-ink">
                  {completedCount} / {filteredTasks.length} {lang === 'tr' ? 'Tamamlandı' : 'Erledigt'}
                </span>
                <div className="w-36 h-2.5 rounded-md bg-ground border border-line overflow-hidden mt-1 p-0.5">
                  <div
                    className="h-full rounded-sm transition-all duration-300 shadow-sm"
                    style={{ width: `${progressPercent}%`, backgroundColor: '#FF5A1F' }}
                  />
                </div>
              </div>

              <button
                onClick={() => setShowAddModal(true)}
                className="px-3.5 py-2 rounded-md card-inner text-ink border border-line text-xs font-bold flex items-center gap-1.5 transition cursor-pointer hover:border-brand"
              >
                <Plus className="w-4 h-4 text-brand icon-brand shrink-0" />
                <span>{lang === 'tr' ? 'Görev Ekle' : 'Prüfpunkt hinzufügen'}</span>
              </button>
            </div>
          </div>

          {/* Checklist Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredTasks.map((item) => {
              return (
                <div
                  key={item.id}
                  onClick={() => handleToggleTask(item.id)}
                  className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 card-inner ${
                    item.done
                      ? 'bg-subtle opacity-85'
                      : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition ${
                      item.done ? 'bg-brand text-white' : 'border-2 border-line bg-ground'
                    }`}>
                      {item.done && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className={`text-xs font-bold ${
                        item.done ? 'line-through text-ink-muted' : 'text-ink'
                      }`}>
                        {lang === 'tr' ? item.titleTr || item.title : item.title}
                      </p>
                      {item.done && item.completedBy && (
                        <p className="text-[10px] text-brand font-medium mt-0.5">
                          ✓ {item.completedBy} ({item.time} Uhr)
                        </p>
                      )}
                    </div>
                  </div>

                  <span className={`text-[11px] font-extrabold whitespace-nowrap ${
                    item.done ? 'text-emerald-400' : 'text-subhead'
                  }`}>
                    {item.done ? (lang === 'tr' ? '● Yapıldı' : '● Erledigt') : (lang === 'tr' ? '○ Bekliyor' : '○ Offen')}
                  </span>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* Modal to add custom task */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-surface text-ink rounded-3xl p-6 border border-line card-inner">
            <h3 className="font-bold text-base text-ink mb-1">
              {lang === 'tr' ? 'Yeni Hijyen / Kontrol Maddesi' : 'Neuen HACCP-Prüfpunkt erfassen'}
            </h3>
            <p className="text-xs text-subhead mb-4">
              {selectedShift === 'morning' ? 'Frühschicht / Morgen' : 'Spätschicht / Abend'}
            </p>
            <form onSubmit={handleAddTask} className="space-y-4">
              <input
                type="text"
                required
                autoFocus
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder={lang === 'tr' ? 'Örn: Salata bar soğutucu temizliği...' : 'z.B. Espressomaschine entkalken...'}
                className="w-full px-3 py-2.5 rounded-xl bg-surface card-inner border border-line text-xs text-ink focus:outline-none focus:border-brand"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-surface card-inner text-subhead text-xs font-semibold transition"
                >
                  {lang === 'tr' ? 'Vazgeç' : 'Abbrechen'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl btn-brand text-white text-xs font-black transition"
                >
                  {lang === 'tr' ? 'Kaydet' : 'Hinzufügen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
