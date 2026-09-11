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
  Square
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { StorageService } from '../../services/storage';
import { formatDate } from '../../utils/formatters';

export const HaccpChecklists = ({ lang, currentUser }) => {
  const [activeTab, setActiveTab] = useState('temp'); // 'temp' | 'checklists'
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

    // Check if all in this category are now completed
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
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl glass-panel relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{lang === 'tr' ? 'İsviçre Gıda Hijyeni (HACCP / Lebensmittelkontrolle)' : 'Lebensmittelhygiene & HACCP-Kontrollen'}</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {lang === 'tr' ? 'HACCP & Günlük Hijyen Listeleri' : 'HACCP & Tägliche Kontrolllisten'}
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl">
              {lang === 'tr'
                ? 'Kanton gıda denetimi gereksinimlerine tam uygun soğutucu sıcaklık ölçümleri, sabah açılış ve akşam kapanış görev takip sistemi.'
                : 'Lückenlose Dokumentation nach Lebensmittelrecht (HyV/LMG) für Kühlräume, Tiefkühler und tägliche Reinigungs- & Schliesskontrollen.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportHaccpReport}
              className="px-4 py-2.5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-bold flex items-center gap-2 shadow-xs transition"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'tr' ? 'HACCP Raporu İndir' : 'HACCP Protokoll Export'}</span>
            </button>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex gap-2 mt-6 border-b border-slate-200/60 pb-3">
          <button
            onClick={() => setActiveTab('temp')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
              activeTab === 'temp'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Thermometer className="w-4 h-4" />
            <span>{lang === 'tr' ? 'Soğuk Oda & Dolap Sıcaklıkları' : 'Temperaturkontrolle (Kühlräume)'}</span>
          </button>
          <button
            onClick={() => setActiveTab('checklists')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
              activeTab === 'checklists'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>{lang === 'tr' ? 'Açılış & Kapanış Kontrolleri' : 'Tägliche Checklisten (Morgen / Abend)'}</span>
          </button>
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
                  className={`p-5 rounded-3xl bg-white border transition shadow-xs flex flex-col justify-between ${
                    isOk ? 'border-slate-200 hover:border-emerald-300' : 'border-rose-300 bg-rose-50/30'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`badge text-[10px] py-0.5 px-2 ${
                        isOk ? 'badge-emerald' : 'badge-rose'
                      }`}>
                        {isOk ? '● IN DER NORM' : '⚠️ GRENZWERT!'}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {item.targetRange}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900 mb-1">
                      {lang === 'tr' ? item.locationTr || item.location : item.location}
                    </h3>
                    <p className="text-[11px] text-slate-500 mb-4">
                      {lang === 'tr' ? 'Hedef Aralık' : 'Sollwert'}: <span className="font-semibold text-slate-700">{item.targetRange}</span>
                    </p>

                    {/* Current Temp Display / Input */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center mb-4">
                      {isEditing ? (
                        <div className="flex items-center justify-center gap-2">
                          <input
                            type="number"
                            step="0.1"
                            autoFocus
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            placeholder={item.currentTemp.toString()}
                            className="w-24 px-2 py-1 text-center font-mono font-black text-xl bg-white border border-emerald-400 rounded-lg text-slate-900 focus:outline-none"
                          />
                          <span className="text-slate-500 font-bold">°C</span>
                          <button
                            onClick={() => handleSaveTemp(item.id)}
                            className="px-2 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition"
                          >
                            OK
                          </button>
                        </div>
                      ) : (
                        <div>
                          <div className={`font-mono text-3xl font-black ${
                            isOk ? 'text-slate-900' : 'text-rose-600'
                          }`}>
                            {item.currentTemp > 0 ? `+${item.currentTemp}` : item.currentTemp}°C
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1">
                            {lang === 'tr' ? 'Son Ölçüm' : 'Letzte Messung'}: {item.checkedAt} Uhr
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] text-slate-600 mb-3 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{item.checkedBy || 'Noch offen'}</span>
                      </span>
                      <span className="text-slate-400">{item.checkedAt || '-'}</span>
                    </div>

                    {!isEditing ? (
                      <button
                        onClick={() => {
                          setEditingTempId(item.id);
                          setTempValue(item.currentTemp.toString());
                        }}
                        className="w-full py-2 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 text-xs font-bold transition"
                      >
                        {lang === 'tr' ? 'Sıcaklık Gir / Güncelle' : 'Temperatur erfassen'}
                      </button>
                    ) : (
                      <button
                        onClick={() => setEditingTempId(null)}
                        className="w-full py-2 rounded-xl bg-slate-100 text-slate-500 text-xs font-semibold hover:bg-slate-200 transition"
                      >
                        {lang === 'tr' ? 'İptal' : 'Abbrechen'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">
                {lang === 'tr' ? 'İsviçre Gıda Yönetmeliği Kuralı:' : 'Schweizer Lebensmittelrecht (Hygiene-Vorschrift):'}
              </p>
              <p className="mt-0.5 text-amber-800">
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
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedShift('morning')}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition ${
                  selectedShift === 'morning'
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                🌅 {lang === 'tr' ? 'Sabah / Açılış Kontrolü (Frühschicht)' : 'Morgenkontrolle (Frühschicht)'}
              </button>
              <button
                onClick={() => setSelectedShift('evening')}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition ${
                  selectedShift === 'evening'
                    ? 'bg-indigo-100 text-indigo-900 border border-indigo-300'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                🌙 {lang === 'tr' ? 'Akşam / Kapanış Kontrolü (Spätschicht)' : 'Abendkontrolle (Spätschicht)'}
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-xs font-bold text-slate-900">
                  {completedCount} / {filteredTasks.length} {lang === 'tr' ? 'Tamamlandı' : 'Erledigt'}
                </span>
                <div className="w-36 h-2 rounded-full bg-slate-100 overflow-hidden mt-1">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              <button
                onClick={() => setShowAddModal(true)}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition"
              >
                <Plus className="w-4 h-4" />
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
                  className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                    item.done
                      ? 'bg-emerald-50/40 border-emerald-200 hover:bg-emerald-50/60'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition ${
                      item.done ? 'bg-emerald-600 text-white' : 'border-2 border-slate-300 bg-white'
                    }`}>
                      {item.done && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className={`text-xs font-bold ${
                        item.done ? 'line-through text-slate-400' : 'text-slate-900'
                      }`}>
                        {lang === 'tr' ? item.titleTr || item.title : item.title}
                      </p>
                      {item.done && item.completedBy && (
                        <p className="text-[10px] text-emerald-700 font-medium mt-0.5">
                          ✓ {item.completedBy} ({item.time} Uhr)
                        </p>
                      )}
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.done ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {item.done ? (lang === 'tr' ? 'Yapıldı' : 'Erledigt') : (lang === 'tr' ? 'Bekliyor' : 'Offen')}
                  </span>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* Modal to add custom task */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-xl border border-slate-200">
            <h3 className="font-bold text-base text-slate-900 mb-1">
              {lang === 'tr' ? 'Yeni Hijyen / Kontrol Maddesi' : 'Neuen HACCP-Prüfpunkt erfassen'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
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
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold hover:bg-slate-200 transition"
                >
                  {lang === 'tr' ? 'Vazgeç' : 'Abbrechen'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition"
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
