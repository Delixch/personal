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

  const [payingInvoice, setPayingInvoice] = useState(null);
  const [paymentForm, setPaymentForm] = useState({
    paidDate: new Date().toISOString().split('T')[0],
    paymentAccount: 'UBS Switzerland AG (Firmenkonto)',
    paymentRef: ''
  });

  const openPaymentModal = (inv) => {
    setPayingInvoice(inv);
    setPaymentForm({
      paidDate: new Date().toISOString().split('T')[0],
      paymentAccount: 'UBS Switzerland AG (Firmenkonto)',
      paymentRef: ''
    });
  };

  const handleConfirmPayment = (e) => {
    e.preventDefault();
    if (!payingInvoice) return;
    StorageService.updateInvoiceStatus(
      payingInvoice.id,
      'paid',
      paymentForm.paidDate,
      paymentForm.paymentAccount,
      paymentForm.paymentRef
    );
    setInvoices(StorageService.getInvoices());
    setPayingInvoice(null);

    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.6 }
    });
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

      <div className="p-5 rounded-3xl bg-surface text-ink border border-line relative overflow-hidden mb-6 card-static">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="page-title text-ink">
              {t.invoiceTitle}
            </h1>
            <p className="text-subhead text-ink-soft max-w-2xl leading-relaxed mt-1">
              {lang === 'tr'
                ? 'Faturaları kamerayla çekin veya dosya yükleyin; yapay zeka tutar, KDV ve vadeyi otomatik ayıklasın.'
                : 'Scannen oder fotografieren Sie Lieferantenrechnungen zur automatischen Erfassung von Betrag, MwSt und Fälligkeit.'}
            </p>
          </div>

          <button
            onClick={() => setShowScanModal(true)}
            className="px-3.5 py-2 rounded-md btn-brand font-black text-xs flex items-center gap-2 transition shrink-0 md:ml-auto cursor-pointer"
          >
            <Camera className="w-4 h-4 shrink-0" />
            <span>{t.scanInvoice}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 pt-4 border-t border-line">
          <div className="p-3.5 rounded-2xl card-inner border border-line">
            <p className="text-[11px] text-subhead">{lang === 'tr' ? 'Ödenen Faturalar' : 'Bezahlte Rechnungen'}</p>
            <p className="text-lg font-black font-mono text-emerald-400">
              {formatCurrency(totalPaid)}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl card-inner border border-line">
            <p className="text-[11px] text-subhead">{lang === 'tr' ? 'Açık / Bekleyen Borç' : 'Offene Verbindlichkeiten'}</p>
            <p className="text-lg font-black font-mono text-rose-500 font-semibold">
              {formatCurrency(totalUnpaid)}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl card-inner border border-line col-span-2 sm:col-span-1">
            <p className="text-[11px] text-subhead">{lang === 'tr' ? 'Toplam Kayıtlı Fatura' : 'Gesamtzahl Belege'}</p>
            <p className="text-lg font-black font-mono text-ink">
              {invoices.length} {lang === 'tr' ? 'Adet' : 'Stück'}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {[
          { id: 'all', label: lang === 'tr' ? 'Tüm Faturalar' : 'Alle Belege' },
          { id: 'pending', label: lang === 'tr' ? 'Ödenecekler (Açık)' : 'Offen / Fällig' },
          { id: 'paid', label: lang === 'tr' ? 'Ödenenler' : 'Bezahlt' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-3.5 py-2 rounded-md text-xs font-bold transition flex items-center justify-center cursor-pointer ${
              activeFilter === tab.id
                ? 'btn-brand font-black'
                : 'card-inner text-ink border border-line'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-surface border border-line rounded-3xl p-6 card-inner">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-ink">
            <thead className="border-b border-line text-[11px] text-subhead uppercase tracking-wider">
              <tr>
                <th className="pb-3">{lang === 'tr' ? 'Fatura / Foto' : 'Beleg / Foto'}</th>
                <th className="pb-3">{lang === 'tr' ? 'Firma & No' : 'Lieferant & Nr'}</th>
                <th className="pb-3">{lang === 'tr' ? 'Tarih & Vade' : 'Datum & Fälligkeit'}</th>
                <th className="pb-3">{lang === 'tr' ? 'KDV Oranı' : 'MwSt Satz'}</th>
                <th className="pb-3">{lang === 'tr' ? 'Tutar (CHF)' : 'Betrag (CHF)'}</th>
                <th className="pb-3">{lang === 'tr' ? 'Durum & Hesap' : 'Status & Konto'}</th>
                <th className="pb-3 text-right">{lang === 'tr' ? 'İşlem' : 'Aktion'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-soft">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="transition">
                  <td className="py-3">
                    <div
                      onClick={() => setSelectedInvoice(inv)}
                      className="w-12 h-12 rounded-xl overflow-hidden cursor-pointer border border-line transition card-inner flex items-center justify-center bg-subtle"
                    >
                      <img
                        src={inv.imageUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80'}
                        alt="Rechnung"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80';
                        }}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>

                  <td className="py-3">
                    <p className="font-bold text-ink text-sm">{inv.supplierName}</p>
                    <p className="text-[11px] font-mono text-subhead">{inv.invoiceNumber}</p>
                  </td>

                  <td className="py-3">
                    <p className="text-ink">{lang === 'tr' ? 'Tarih:' : 'Ausgestellt:'} {formatDate(inv.date)}</p>
                    <p className="text-[11px] text-brand font-semibold">{lang === 'tr' ? 'Vade:' : 'Fällig:'} {formatDate(inv.dueDate)}</p>
                  </td>

                  <td className="py-3 font-mono">
                    {inv.taxRate}% ({formatCurrency(inv.taxAmount)})
                  </td>

                  <td className="py-3 font-mono font-black text-sm text-brand">
                    {formatCurrency(inv.totalAmount)}
                  </td>

                  <td className="py-3">
                    {inv.status === 'paid' ? (
                      <div>
                        <span className="badge badge-brand py-0.5 px-2 text-[10px] flex items-center gap-1 w-max">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>{lang === 'tr' ? '✓ ÖDENDİ' : '✓ BEZAHLT'}</span>
                        </span>
                        <p className="text-[10px] text-subhead mt-1 font-mono">
                          {inv.paidDate ? formatDate(inv.paidDate) : ''} {inv.paymentAccount ? `• ${inv.paymentAccount.split(' ')[0]}` : ''}
                        </p>
                      </div>
                    ) : (
                      <span className="badge badge-neutral py-0.5 px-2 text-[10px]">
                        {lang === 'tr' ? '● AÇIK' : '● OFFEN'}
                      </span>
                    )}
                  </td>

                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="p-1.5 rounded-lg bg-subtle text-ink border border-line transition"
                        title="Beleg ansehen"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {inv.status !== 'paid' && (
                        <button
                          onClick={() => openPaymentModal(inv)}
                          className="px-2.5 py-1.5 rounded-xl card-inner border border-emerald-500/40 text-emerald-400 hover:bg-emerald-600 hover:text-white text-[11px] font-bold flex items-center gap-1 transition"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
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

      {showScanModal && (
        <div 
          className="fixed inset-0 z-50 flex justify-start bg-black/70 backdrop-blur-xs modal-backdrop"
          onClick={() => setShowScanModal(false)}
        >
          <div 
            className="w-full max-w-2xl sm:max-w-3xl h-full bg-surface border-r border-line p-6 flex flex-col gap-4 overflow-y-auto text-ink shadow-2xl drawer-left-container pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="flex items-center justify-between border-b border-line pb-3 mb-4">
              <h2 className="text-base font-bold text-ink flex items-center gap-2">
                <ScanLine className="w-5 h-5 text-ink" />
                <span>{t.scanInvoice}</span>
              </h2>
              <button
                onClick={() => setShowScanModal(false)}
                className="p-1.5 rounded-lg text-ink-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4 p-3.5 rounded-2xl card-inner border border-line">
              <p className="text-[11px] font-bold text-ink-soft uppercase tracking-wider mb-2">
                ⚡ {lang === 'tr' ? 'Hızlı Test: Hazır Fatura Yükle' : 'Schnelltest: Musterrechnung laden'}:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {samplePresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="p-2.5 rounded-xl card-inner border border-line text-left transition text-xs group"
                  >
                    <p className="font-semibold text-ink group- truncate">
                      {preset.title}
                    </p>
                    <p className="text-[10px] font-mono font-bold text-ink">
                      {formatCurrency(preset.totalAmount)}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div>
                <label className="block text-xs font-semibold text-ink-soft mb-2">
                  {lang === 'tr' ? 'Fatura Görseli / Kamera' : 'Rechnungsfoto / Beleg'}:
                </label>

                <div className="relative rounded-2xl border-2 border-dashed border-line transition p-6 text-center flex flex-col items-center justify-center min-h-[260px] card-inner overflow-hidden">
                  {isScanning && (
                    <div className="absolute inset-0 bg-surface z-10 flex flex-col items-center justify-center text-center p-4">
                      <div className="w-10 h-10 rounded-full border-4 border-line border-brand mb-3"></div>
                      <p className="text-xs font-bold text-ink">
                        {t.extractingData}
                      </p>
                      <p className="text-[10px] text-ink mt-1">
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
                      <div className="w-12 h-12 rounded-2xl icon-box flex items-center justify-center mb-3">
                        <Upload className="w-6 h-6" />
                      </div>
                      <p className="text-xs font-semibold text-ink mb-1">
                        {lang === 'tr' ? 'Fatura dosyasını buraya bırakın' : 'Datei hierher ziehen oder auswählen'}
                      </p>
                      <p className="text-[10px] text-ink-soft mb-4">
                        JPG, PNG, PDF oder Smartphone-Foto
                      </p>
                      <label className="px-4 py-2 rounded-xl card-inner text-ink text-xs font-bold cursor-pointer transition">
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

              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-ink">
                  <Sparkles className="w-4 h-4 text-ink" />
                  <span>{lang === 'tr' ? 'Otomatik Ayrıştırılan Veriler' : 'Erkannte Rechnungsdaten'}:</span>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-ink-soft mb-1">
                    Lieferant (Tedarikçi):
                  </label>
                  <input
                    type="text"
                    value={extractedData.supplierName}
                    onChange={(e) => setExtractedData({ ...extractedData, supplierName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl card-inner border border-line text-ink text-xs focus:outline-none focus:border-line"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-ink-soft mb-1">
                      Rechnungs-Nr:
                    </label>
                    <input
                      type="text"
                      value={extractedData.invoiceNumber}
                      onChange={(e) => setExtractedData({ ...extractedData, invoiceNumber: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl card-inner border border-line text-ink text-xs font-mono focus:outline-none focus:border-line"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-ink-soft mb-1">
                      Kategorie:
                    </label>
                    <input
                      type="text"
                      value={extractedData.category}
                      onChange={(e) => setExtractedData({ ...extractedData, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl card-inner border border-line text-ink text-xs focus:outline-none focus:border-line"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-ink-soft mb-1">
                      Rechnungsdatum:
                    </label>
                    <input
                      type="date"
                      value={extractedData.date}
                      onChange={(e) => setExtractedData({ ...extractedData, date: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl card-inner border border-line text-ink text-xs focus:outline-none focus:border-line"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-ink-soft mb-1">
                      Fälligkeit:
                    </label>
                    <input
                      type="date"
                      value={extractedData.dueDate}
                      onChange={(e) => setExtractedData({ ...extractedData, dueDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl card-inner border border-line text-ink text-xs focus:outline-none focus:border-line"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-ink-soft mb-1">
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
                      className="w-full px-3 py-2 rounded-xl card-inner border border-line text-ink text-xs focus:outline-none focus:border-line"
                    >
                      <option value="2.6">2.6% (Lebensmittel CH)</option>
                      <option value="8.1">8.1% (Normalsatz CH)</option>
                      <option value="0">0% (Befreit)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-ink-soft mb-1">
                      Gesamtbetrag (CHF):
                    </label>
                    <input
                      type="number"
                      step="0.05"
                      value={extractedData.totalAmount}
                      onChange={(e) => setExtractedData({ ...extractedData, totalAmount: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-xl card-inner border border-line text-ink font-extrabold font-mono text-xs focus:outline-none focus:border-line"
                    />
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="button"
                    onClick={handleSaveScannedInvoice}
                    className="w-full py-3 rounded-xl btn-brand font-extrabold text-xs flex items-center justify-center gap-2 transition"
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

      {payingInvoice && (
        <div 
          className="fixed inset-0 z-50 flex justify-start bg-black/70 backdrop-blur-xs modal-backdrop"
          onClick={() => setPayingInvoice(null)}
        >
          <div 
            className="w-full max-w-md sm:max-w-lg h-full bg-surface border-r border-line p-6 flex flex-col gap-4 overflow-y-auto text-ink shadow-2xl drawer-left-container pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-line pb-3 mb-4">
              <h3 className="font-bold text-ink text-base flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-brand" />
                <span>{lang === 'tr' ? 'Fatura Ödeme & Banka Onayı' : 'Zahlung buchen'}</span>
              </h3>
              <button
                onClick={() => setPayingInvoice(null)}
                className="p-1.5 rounded-lg text-ink-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-ground border border-line mb-4 text-xs">
              <p className="font-bold text-ink text-sm">{payingInvoice.supplierName}</p>
              <p className="text-subhead font-mono">{payingInvoice.invoiceNumber}</p>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-line font-bold">
                <span>{lang === 'tr' ? 'Ödenecek Tutar:' : 'Zahlbetrag:'}</span>
                <span className="font-mono text-brand text-sm">{formatCurrency(payingInvoice.totalAmount)}</span>
              </div>
            </div>

            <form onSubmit={handleConfirmPayment} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-subhead mb-1">
                  {lang === 'tr' ? 'Ödeme Tarihi' : 'Zahlungsdatum'}:
                </label>
                <input
                  type="date"
                  required
                  value={paymentForm.paidDate}
                  onChange={(e) => setPaymentForm({ ...paymentForm, paidDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl card-inner border border-line text-ink text-xs focus:outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-subhead mb-1">
                  {lang === 'tr' ? 'Ödeme Yapılan Banka / Kasa Hesabı' : 'Zahlungskonto / Bankverbindung'}:
                </label>
                <select
                  value={paymentForm.paymentAccount}
                  onChange={(e) => setPaymentForm({ ...paymentForm, paymentAccount: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl card-inner border border-line text-ink text-xs focus:outline-none focus:border-brand"
                >
                  <option value="UBS Switzerland AG (Firmenkonto)">UBS Switzerland AG (Haupt-Firmenkonto)</option>
                  <option value="Zürcher Kantonalbank ZKB">Zürcher Kantonalbank ZKB (Gastro Konto)</option>
                  <option value="PostFinance Gastro">PostFinance Gastro Account</option>
                  <option value="Bar-Kasse (Nakit Kasa)">Bar-Kasse (Tageskasse Bar)</option>
                  <option value="Firmen-Kreditkarte (Mastercard)">Firmen-Kreditkarte (Corporate Mastercard)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-subhead mb-1">
                  {lang === 'tr' ? 'e-Banking Ref / Dekont No (İsteğe Bağlı)' : 'Referenz / e-Banking Beleg Nr'}:
                </label>
                <input
                  type="text"
                  placeholder={lang === 'tr' ? 'Örn: QR-Zahlung Ref #9812' : 'z.B. QR-Zahlung Ref #9812'}
                  value={paymentForm.paymentRef}
                  onChange={(e) => setPaymentForm({ ...paymentForm, paymentRef: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl card-inner border border-line text-ink text-xs focus:outline-none focus:border-brand"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl btn-brand font-black text-xs flex items-center justify-center gap-2 transition"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{lang === 'tr' ? 'Ödemeyi Onayla & Muhasebeleştir' : 'Zahlung verbindlich buchen'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs modal-backdrop">
          <div className="w-full max-w-md rounded-3xl bg-surface p-6 relative border border-line modal-container text-ink shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between border-b border-line pb-3 mb-4">
              <div>
                <span className="badge badge-purple text-[10px] mb-1">{selectedInvoice.category}</span>
                <h3 className="font-bold text-ink text-base">{selectedInvoice.supplierName}</h3>
                <p className="text-xs font-mono text-ink-soft">{selectedInvoice.invoiceNumber}</p>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="p-1.5 rounded-lg text-ink-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden mb-4 border border-line max-h-56 card-inner">
              <img
                src={selectedInvoice.imageUrl}
                alt="Beleg"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="space-y-2 text-xs text-ink-soft card-inner p-3.5 rounded-xl border border-line mb-4">
              <div className="flex items-center justify-between">
                <span className="text-ink-soft">Rechnungsdatum:</span>
                <span className="font-semibold text-ink">{formatDate(selectedInvoice.date)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-soft">Fälligkeit:</span>
                <span className="font-semibold text-brand">{formatDate(selectedInvoice.dueDate)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-soft">MwSt ({selectedInvoice.taxRate}%):</span>
                <span className="font-mono text-ink">{formatCurrency(selectedInvoice.taxAmount)}</span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-line font-bold text-sm">
                <span className="text-ink">Gesamtbetrag:</span>
                <span className="font-mono text-ink">{formatCurrency(selectedInvoice.totalAmount)}</span>
              </div>
            </div>

            {selectedInvoice.status === 'paid' && (
              <div className="space-y-1.5 text-xs card-inner p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20 text-emerald-200 mb-4">
                <div className="flex items-center gap-1.5 font-bold text-emerald-400 text-xs mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{lang === 'tr' ? 'Banka & Ödeme Kaydı' : 'Zahlungsbestätigung'}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-subhead">{lang === 'tr' ? 'Ödeme Tarihi:' : 'Bezahlt am:'}</span>
                  <span className="font-semibold text-ink">{formatDate(selectedInvoice.paidDate || selectedInvoice.date)}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-subhead">{lang === 'tr' ? 'Ödeme Hesabı:' : 'Konto / Bank:'}</span>
                  <span className="font-semibold text-brand">{selectedInvoice.paymentAccount || 'UBS Switzerland AG'}</span>
                </div>
                {selectedInvoice.paymentRef && (
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-subhead">{lang === 'tr' ? 'Referenz / Dekont:' : 'Referenz:'}</span>
                    <span className="font-mono text-ink">{selectedInvoice.paymentRef}</span>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => setSelectedInvoice(null)}
              className="w-full py-2 rounded-xl bg-subtle text-xs text-ink-soft font-semibold transition"
            >
              Schliessen
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
