import React, { useState } from 'react';
import {
  ScanLine,
  Upload,
  Camera,
  CheckCircle2,
  AlertCircle,
  FileText,
  Calendar,
  DollarSign,
  Building2,
  Sparkles,
  Search,
  Filter,
  Eye,
  Check,
  X,
  CreditCard
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { StorageService } from '../../services/storage';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { TRANSLATIONS } from '../../utils/translations';

export const InvoiceScanner = ({ lang, currentUser }) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.de;
  const [invoices, setInvoices] = useState(StorageService.getInvoices());
  const [suppliers, setSuppliers] = useState(StorageService.getSuppliers());
  const [activeFilter, setActiveFilter] = useState('all');
  const [showScanModal, setShowScanModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const [isScanning, setIsScanning] = useState(false);
  const [scannedImage, setScannedImage] = useState(null);
  const [extractedData, setExtractedData] = useState({
    invoiceNumber: '',
    supplierId: 'sup-1',
    supplierName: 'Metzgerei Keller & Söhne',
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    subtotal: 850.00,
    taxRate: 2.6,
    taxAmount: 22.10,
    totalAmount: 872.10,
    category: 'Fleisch & Geflügel'
  });

  const samplePresets = [
    {
      title: 'Metzgerei Keller (Fleisch CH)',
      supplierName: 'Metzgerei Keller & Söhne',
      supplierId: 'sup-1',
      invoiceNumber: `MK-${Math.floor(1000 + Math.random() * 9000)}`,
      totalAmount: 1240.50,
      subtotal: 1209.06,
      taxRate: 2.6,
      taxAmount: 31.44,
      category: 'Fleisch & Geflügel',
      imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80'
    },
    {
      title: 'Prodega Zürich (Grosshandel)',
      supplierName: 'Prodega Transgourmet Zürich',
      supplierId: 'sup-2',
      invoiceNumber: `TG-${Math.floor(10000 + Math.random() * 90000)}`,
      totalAmount: 2840.00,
      subtotal: 2627.20,
      taxRate: 8.1,
      taxAmount: 212.80,
      category: 'Grosshandel & Trockensortiment',
      imageUrl: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=600&auto=format&fit=crop&q=80'
    },
    {
      title: 'Frische Paradies (Gemüse & Obst)',
      supplierName: 'Frische Paradies / Yeşil Vadi',
      supplierId: 'sup-3',
      invoiceNumber: `YV-${Math.floor(1000 + Math.random() * 9000)}`,
      totalAmount: 560.80,
      subtotal: 546.59,
      taxRate: 2.6,
      taxAmount: 14.21,
      category: 'Obst & Gemüse',
      imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80'
    }
  ];

  const handleApplyPreset = (preset) => {
    setIsScanning(true);
    setScannedImage(preset.imageUrl);

    setTimeout(() => {
      setExtractedData({
        ...extractedData,
        invoiceNumber: preset.invoiceNumber,
        supplierId: preset.supplierId,
        supplierName: preset.supplierName,
        totalAmount: preset.totalAmount,
        subtotal: preset.subtotal,
        taxRate: preset.taxRate,
        taxAmount: preset.taxAmount,
        category: preset.category
      });
      setIsScanning(false);
    }, 1200);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      setScannedImage(event.target.result);
      setTimeout(() => {
        setExtractedData({
          ...extractedData,
          invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
          supplierName: 'Metzgerei Keller & Söhne',
          totalAmount: 945.50,
          subtotal: 921.54,
          taxRate: 2.6,
          taxAmount: 23.96
        });
        setIsScanning(false);
      }, 1500);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveScannedInvoice = () => {
    StorageService.addInvoice({
      ...extractedData,
      status: 'pending',
      imageUrl: scannedImage || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600'
    });

    setInvoices(StorageService.getInvoices());
    setShowScanModal(false);
    setScannedImage(null);

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  const handleMarkAsPaid = (invId) => {
    const today = new Date().toISOString().split('T')[0];
    StorageService.updateInvoiceStatus(invId, 'paid', today);
    setInvoices(StorageService.getInvoices());
  };

  const filteredInvoices = invoices.filter(inv => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'pending') return inv.status === 'pending';
    if (activeFilter === 'paid') return inv.status === 'paid';
    if (activeFilter === 'overdue') return inv.status === 'overdue';
    return true;
  });

  const totalUnpaid = invoices
    .filter(i => i.status === 'pending')
    .reduce((sum, i) => sum + i.totalAmount, 0);

  const totalPaid = invoices
    .filter(i => i.status === 'paid')
    .reduce((sum, i) => sum + i.totalAmount, 0);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl glass-panel relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-800 text-xs font-semibold mb-2">
              <ScanLine className="w-3.5 h-3.5 text-purple-600" />
              <span>KI-gestützter Rechnungs-Scan & Belegerfassung</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {t.invoiceTitle}
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl">
              {lang === 'tr'
                ? 'Faturaları kamerayla çekin veya dosya yükleyin; yapay zeka tutar, KDV ve vadeyi otomatik ayıklasın.'
                : 'Scannen oder fotografieren Sie Lieferantenrechnungen zur automatischen Erfassung von Betrag, MwSt und Fälligkeit.'}
            </p>
          </div>

          <button
            onClick={() => setShowScanModal(true)}
            className="px-5 py-2.5 rounded-xl gradient-btn-emerald font-extrabold text-xs flex items-center gap-2 transition self-start md:self-auto shadow-sm"
          >
            <Camera className="w-4 h-4" />
            <span>{t.scanInvoice}</span>
          </button>
        </div>

        {/* Quick KPI Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 pt-4 border-t border-slate-100">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <p className="text-[11px] text-slate-500">{lang === 'tr' ? 'Ödenen Faturalar' : 'Bezahlte Rechnungen'}</p>
            <p className="text-lg font-black font-mono text-emerald-700">
              {formatCurrency(totalPaid)}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <p className="text-[11px] text-slate-500">{lang === 'tr' ? 'Açık / Bekleyen Borç' : 'Offene Verbindlichkeiten'}</p>
            <p className="text-lg font-black font-mono text-amber-700">
              {formatCurrency(totalUnpaid)}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 col-span-2 sm:col-span-1">
            <p className="text-[11px] text-slate-500">{lang === 'tr' ? 'Toplam Kayıtlı Fatura' : 'Gesamtzahl Belege'}</p>
            <p className="text-lg font-black font-mono text-slate-900">
              {invoices.length} {lang === 'tr' ? 'Adet' : 'Stück'}
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {[
          { id: 'all', label: lang === 'tr' ? 'Tüm Faturalar' : 'Alle Belege' },
          { id: 'pending', label: lang === 'tr' ? 'Ödenecekler (Açık)' : 'Offen / Fällig' },
          { id: 'paid', label: lang === 'tr' ? 'Ödenenler' : 'Bezahlt' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition border ${
              activeFilter === tab.id
                ? 'bg-purple-50 border-purple-300 text-purple-900 font-bold'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Invoices List */}
      <div className="glass-panel p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="border-b border-slate-100 text-[11px] text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="pb-3">Beleg / Foto</th>
                <th className="pb-3">Lieferant & Nr</th>
                <th className="pb-3">Datum & Fälligkeit</th>
                <th className="pb-3">MwSt Satz</th>
                <th className="pb-3">Betrag (CHF)</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Aktion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50 transition">
                  <td className="py-3">
                    <div
                      onClick={() => setSelectedInvoice(inv)}
                      className="w-12 h-12 rounded-xl overflow-hidden cursor-pointer border border-slate-200 hover:ring-2 ring-emerald-500 transition"
                    >
                      <img
                        src={inv.imageUrl}
                        alt="Rechnung"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>

                  <td className="py-3">
                    <p className="font-bold text-slate-900 text-sm">{inv.supplierName}</p>
                    <p className="text-[11px] font-mono text-slate-500">{inv.invoiceNumber}</p>
                  </td>

                  <td className="py-3">
                    <p className="text-slate-700">Ausgestellt: {formatDate(inv.date)}</p>
                    <p className="text-[11px] text-amber-700 font-semibold">Fällig: {formatDate(inv.dueDate)}</p>
                  </td>

                  <td className="py-3 font-mono">
                    {inv.taxRate}% ({formatCurrency(inv.taxAmount)})
                  </td>

                  <td className="py-3 font-mono font-extrabold text-sm text-emerald-700">
                    {formatCurrency(inv.totalAmount)}
                  </td>

                  <td className="py-3">
                    {inv.status === 'paid' ? (
                      <span className="badge badge-emerald py-0.5 px-2 text-[10px]">
                        ✓ BEZAHLT
                      </span>
                    ) : (
                      <span className="badge badge-amber py-0.5 px-2 text-[10px]">
                        ● OFFEN
                      </span>
                    )}
                  </td>

                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                        title="Beleg ansehen"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {inv.status !== 'paid' && (
                        <button
                          onClick={() => handleMarkAsPaid(inv.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-[11px] font-bold flex items-center gap-1 transition"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{lang === 'tr' ? 'Ödendi Yap' : 'Als bezahlt'}</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Scan Modal */}
      {showScanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-3xl rounded-3xl bg-white p-6 shadow-2xl relative border border-slate-200 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ScanLine className="w-5 h-5 text-purple-600" />
                <span>{t.scanInvoice}</span>
              </h2>
              <button
                onClick={() => setShowScanModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Presets */}
            <div className="mb-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                ⚡ {lang === 'tr' ? 'Hızlı Test: Hazır Fatura Yükle' : 'Schnelltest: Musterrechnung laden'}:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {samplePresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="p-2.5 rounded-xl bg-white hover:bg-purple-50 border border-slate-200 hover:border-purple-300 text-left transition text-xs group shadow-sm"
                  >
                    <p className="font-semibold text-slate-900 group-hover:text-purple-900 truncate">
                      {preset.title}
                    </p>
                    <p className="text-[10px] font-mono font-bold text-emerald-700">
                      {formatCurrency(preset.totalAmount)}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  {lang === 'tr' ? 'Fatura Görseli / Kamera' : 'Rechnungsfoto / Beleg'}:
                </label>

                <div className="relative rounded-2xl border-2 border-dashed border-slate-300 hover:border-purple-400 transition p-6 text-center flex flex-col items-center justify-center min-h-[260px] bg-slate-50 overflow-hidden">
                  {isScanning && (
                    <div className="absolute inset-0 bg-white/90 backdrop-blur-xs z-10 flex flex-col items-center justify-center text-center p-4">
                      <div className="w-10 h-10 rounded-full border-4 border-purple-600 border-t-transparent animate-spin mb-3"></div>
                      <p className="text-xs font-bold text-purple-900">
                        {t.extractingData}
                      </p>
                      <p className="text-[10px] text-purple-700 mt-1">
                        OCR analysiert Lieferant, MwSt und Summen
                      </p>
                    </div>
                  )}

                  {scannedImage ? (
                    <img
                      src={scannedImage}
                      alt="Scan"
                      className="w-full max-h-64 object-contain rounded-xl"
                    />
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 mb-3 border border-purple-100">
                        <Upload className="w-6 h-6" />
                      </div>
                      <p className="text-xs font-semibold text-slate-900 mb-1">
                        {lang === 'tr' ? 'Fatura dosyasını buraya bırakın' : 'Datei hierher ziehen oder auswählen'}
                      </p>
                      <p className="text-[10px] text-slate-500 mb-4">
                        JPG, PNG, PDF oder Smartphone-Foto
                      </p>
                      <label className="px-4 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 text-xs font-bold cursor-pointer transition shadow-sm">
                        <span>Datei auswählen</span>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </>
                  )}
                </div>
              </div>

              {/* Right Column: AI Extracted Fields */}
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-purple-800">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>{lang === 'tr' ? 'Otomatik Ayrıştırılan Veriler' : 'Erkannte Rechnungsdaten'}:</span>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Lieferant (Tedarikçi):
                  </label>
                  <input
                    type="text"
                    value={extractedData.supplierName}
                    onChange={(e) => setExtractedData({ ...extractedData, supplierName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Rechnungs-Nr:
                    </label>
                    <input
                      type="text"
                      value={extractedData.invoiceNumber}
                      onChange={(e) => setExtractedData({ ...extractedData, invoiceNumber: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Kategorie:
                    </label>
                    <input
                      type="text"
                      value={extractedData.category}
                      onChange={(e) => setExtractedData({ ...extractedData, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Rechnungsdatum:
                    </label>
                    <input
                      type="date"
                      value={extractedData.date}
                      onChange={(e) => setExtractedData({ ...extractedData, date: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Fälligkeit:
                    </label>
                    <input
                      type="date"
                      value={extractedData.dueDate}
                      onChange={(e) => setExtractedData({ ...extractedData, dueDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      MwSt Satz (%):
                    </label>
                    <select
                      value={extractedData.taxRate}
                      onChange={(e) => {
                        const rate = parseFloat(e.target.value);
                        const tax = Number((extractedData.subtotal * (rate / 100)).toFixed(2));
                        setExtractedData({
                          ...extractedData,
                          taxRate: rate,
                          taxAmount: tax,
                          totalAmount: Number((extractedData.subtotal + tax).toFixed(2))
                        });
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-purple-500"
                    >
                      <option value="2.6">2.6% (Lebensmittel CH)</option>
                      <option value="8.1">8.1% (Normalsatz CH)</option>
                      <option value="0">0% (Befreit)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Gesamtbetrag (CHF):
                    </label>
                    <input
                      type="number"
                      step="0.05"
                      value={extractedData.totalAmount}
                      onChange={(e) => setExtractedData({ ...extractedData, totalAmount: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-emerald-700 font-extrabold font-mono text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="button"
                    onClick={handleSaveScannedInvoice}
                    className="w-full py-3 rounded-xl gradient-btn-emerald font-extrabold text-xs flex items-center justify-center gap-2 transition shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{lang === 'tr' ? 'Faturayı Sisteme Kaydet & Muhasebeleştir' : 'Rechnung verbindlich buchen'}</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl relative border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <span className="badge badge-purple text-[10px] mb-1">{selectedInvoice.category}</span>
                <h3 className="font-bold text-slate-900 text-base">{selectedInvoice.supplierName}</h3>
                <p className="text-xs font-mono text-slate-500">{selectedInvoice.invoiceNumber}</p>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden mb-4 border border-slate-200 max-h-56 bg-slate-50">
              <img
                src={selectedInvoice.imageUrl}
                alt="Beleg"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="space-y-2 text-xs text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-200 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Rechnungsdatum:</span>
                <span className="font-semibold text-slate-900">{formatDate(selectedInvoice.date)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Fälligkeit:</span>
                <span className="font-semibold text-amber-800">{formatDate(selectedInvoice.dueDate)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">MwSt ({selectedInvoice.taxRate}%):</span>
                <span className="font-mono text-slate-800">{formatCurrency(selectedInvoice.taxAmount)}</span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-200 font-bold text-sm">
                <span className="text-slate-900">Gesamtbetrag:</span>
                <span className="font-mono text-emerald-700">{formatCurrency(selectedInvoice.totalAmount)}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedInvoice(null)}
              className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs text-slate-700 font-semibold transition"
            >
              Schliessen
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
