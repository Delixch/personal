import React, { useState } from 'react';
import {
  Truck,
  Phone,
  Mail,
  MessageSquare,
  Clock,
  MapPin,
  ShoppingBag,
  Plus,
  Minus,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { TRANSLATIONS } from '../../utils/translations';
import { formatCurrency } from '../../utils/formatters';

export const SupplierManagement = ({ lang, currentUser }) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.de;
  const [suppliers] = useState(StorageService.getSuppliers());
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [selectedSupplierForOrder, setSelectedSupplierForOrder] = useState(null);
  const [orderQuantities, setOrderQuantities] = useState({});
  const [orderNotes, setOrderNotes] = useState('');
  const [orderSentSuccess, setOrderSentSuccess] = useState(false);

  const categories = [
    { id: 'all',        label: lang === 'tr' ? 'Tümü' : 'Alle' },
    { id: 'metzgerei',  label: 'Metzgerei' },
    { id: 'grosshandel',label: 'Grosshandel' },
    { id: 'gemuese',    label: 'Gemüse & Früchte' },
    { id: 'getraenke',  label: 'Getränke' },
    { id: 'baeckerei',  label: 'Bäckerei' },
    { id: 'hygiene',    label: 'Hygiene' }
  ];

  const filteredSuppliers = suppliers.filter(s => {
    if (selectedCategory === 'all') return true;
    const cat = s.category.toLowerCase();
    if (selectedCategory === 'metzgerei')   return cat.includes('metzgerei') || cat.includes('fleisch');
    if (selectedCategory === 'grosshandel') return cat.includes('grosshandel') || s.name.includes('Prodega');
    if (selectedCategory === 'gemuese')     return cat.includes('gemüse') || cat.includes('obst') || cat.includes('früchte');
    if (selectedCategory === 'getraenke')   return cat.includes('getränke') || cat.includes('bier') || cat.includes('wein');
    if (selectedCategory === 'baeckerei')   return cat.includes('bäckerei') || cat.includes('backwaren');
    if (selectedCategory === 'hygiene')     return cat.includes('hygiene') || cat.includes('reinigung');
    return true;
  });

  const handleOpenOrderModal = (supplier, e) => {
    if (e) e.stopPropagation();
    setSelectedSupplierForOrder(supplier);
    setOrderQuantities({});
    setOrderNotes('');
    setOrderSentSuccess(false);
  };

  const handleQtyChange = (itemId, delta) => {
    setOrderQuantities(prev => {
      const current = prev[itemId] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [itemId]: next };
    });
  };

  const calculateOrderTotal = (supplier) => {
    if (!supplier || !supplier.catalog) return 0;
    return supplier.catalog.reduce((sum, item) => {
      const qty = orderQuantities[item.id] || 0;
      return sum + (item.price * qty);
    }, 0);
  };

  const handleSubmitOrder = (supplier) => {
    const total = calculateOrderTotal(supplier);
    const orderItems = supplier.catalog
      .filter(item => (orderQuantities[item.id] || 0) > 0)
      .map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        unit: item.unit,
        quantity: orderQuantities[item.id]
      }));

    if (orderItems.length === 0) {
      alert(lang === 'tr' ? 'Lütfen en az 1 ürün seçin!' : 'Bitte wählen Sie mindestens 1 Artikel aus!');
      return;
    }

    StorageService.addOrder({
      supplierId: supplier.id,
      supplierName: supplier.name,
      date: new Date().toISOString().split('T')[0],
      deliveryDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      status: 'bestellt',
      totalAmount: total,
      items: orderItems,
      notes: orderNotes
    });

    setOrderSentSuccess(true);
    setTimeout(() => {
      setSelectedSupplierForOrder(null);
      setOrderSentSuccess(false);
    }, 1600);
  };

  const handleWhatsApp = (supplier, e) => {
    if (e) e.stopPropagation();
    const phone = supplier.whatsapp?.replace(/[^0-9]/g, '') || '';
    window.open(`https://wa.me/${phone}`, '_blank');
  };

  const handleCall = (supplier, e) => {
    if (e) e.stopPropagation();
    window.open(`tel:${supplier.phone}`, '_blank');
  };

  const handleEmail = (supplier, e) => {
    if (e) e.stopPropagation();
    window.open(`mailto:${supplier.email}`, '_blank');
  };

  return (
    <div className="space-y-5">

      <div className="p-6 sm:p-8 rounded-3xl bg-surface text-ink border border-line relative overflow-hidden mb-6 card-inner">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="page-title text-ink">
              {t.supplierTitle}
            </h1>
            <p className="text-subhead text-ink-soft max-w-xl leading-relaxed mt-1">
              {lang === 'tr'
                ? `${suppliers.length} tedarikçi — sipariş vermek için firmaya tıklayın`
                : `${suppliers.length} Lieferanten — Klicken zum Aufgeben einer Bestellung`}
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5 shrink-0">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                  selectedCategory === cat.id
                    ? 'btn-brand font-black'
                    : 'card-inner border-line text-ink'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSuppliers.map((supplier) => (
          <div
            key={supplier.id}
            onClick={(e) => handleOpenOrderModal(supplier, e)}
            className="bg-surface border border-line rounded-2xl p-5 flex flex-col gap-4 transition cursor-pointer group relative card-inner"
          >
            
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-ink-muted">
                {supplier.category}
              </span>
              <h3 className="font-extrabold text-base text-ink mt-0.5 leading-snug group- transition">
                {supplier.name}
              </h3>
              <p className="text-xs text-subhead mt-1 flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-ink-muted shrink-0" />
                {supplier.address}
              </p>
            </div>

            <div className="flex items-start gap-2 card-inner border border-line-soft rounded-xl p-3">
              <Clock className="w-3.5 h-3.5 text-brand icon-brand shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-ink-muted block mb-0.5">
                  {lang === 'tr' ? 'Teslimat Günleri' : 'Liefertage'}
                </span>
                <span className="text-xs font-semibold text-ink">
                  {(supplier.deliveryDays || []).join(' · ')}
                </span>
              </div>
            </div>

            <button
              onClick={(e) => handleOpenOrderModal(supplier, e)}
              className="w-full py-2.5 rounded-xl btn-brand font-black text-xs flex items-center justify-center gap-2 transition"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{lang === 'tr' ? 'Sipariş Ver (Bestellung aufgeben)' : 'Bestellung aufgeben'}</span>
            </button>

            <div className="flex gap-2 mt-auto pt-2 border-t border-line-soft">
              {supplier.whatsapp && (
                <button
                  onClick={(e) => handleWhatsApp(supplier, e)}
                  className="flex-1 py-2 rounded-xl card-inner text-ink font-bold text-xs flex items-center justify-center gap-1.5 border border-line"
                  title="WhatsApp"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span className="text-body-sm">WhatsApp</span>
                </button>
              )}
              <button
                onClick={(e) => handleCall(supplier, e)}
                className="py-2 px-3 rounded-xl border border-line bg-surface icon-brand text-ink transition card-inner"
                title={supplier.phone}
              >
                <Phone className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => handleEmail(supplier, e)}
                className="py-2 px-3 rounded-xl border border-line bg-surface icon-brand text-ink transition card-inner"
                title={supplier.email}
              >
                <Mail className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedSupplierForOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs modal-backdrop">
          <div className="w-full max-w-2xl max-h-[90vh] rounded-3xl bg-surface border border-line p-6 overflow-y-auto space-y-5 relative modal-container text-ink shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]">

            <div className="flex items-start justify-between border-b border-line pb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl icon-box flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-ink-muted">
                    {selectedSupplierForOrder.category}
                  </span>
                  <h2 className="text-lg font-black text-ink leading-tight">
                    {selectedSupplierForOrder.name}
                  </h2>
                  <p className="text-xs text-subhead mt-0.5">
                    {lang === 'tr' ? 'Yeni Sipariş Listesi (Bestellung aufgeben)' : 'Neue Bestellung aufgeben'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSupplierForOrder(null)}
                className="p-2 rounded-xl card-inner text-ink transition border border-line"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {orderSentSuccess ? (
              <div className="p-6 rounded-2xl bg-surface border border-line text-center space-y-3 card-inner">
                <CheckCircle2 className="w-12 h-12 text-ink mx-auto" />
                <h3 className="text-base font-black text-ink">
                  {lang === 'tr' ? 'Siparişiniz Başarıyla Oluşturuldu!' : 'Bestellung erfolgreich übermittelt!'}
                </h3>
                <p className="text-xs text-subhead max-w-md mx-auto">
                  {lang === 'tr'
                    ? `Sipariş tutarı ${formatCurrency(calculateOrderTotal(selectedSupplierForOrder))} olarak kaydedildi ve bildirim iletildi.`
                    : `Bestellwert ${formatCurrency(calculateOrderTotal(selectedSupplierForOrder))} wurde gespeichert.`}
                </p>
              </div>
            ) : (
              <>
                
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl card-inner border border-line text-xs">
                  <div className="flex flex-col gap-1.5 w-full">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-ink shrink-0" />
                      <span>
                        <strong>{lang === 'tr' ? 'Teslimat Günleri:' : 'Liefertage:'}</strong>{' '}
                        {selectedSupplierForOrder.deliveryDays?.length 
                          ? selectedSupplierForOrder.deliveryDays.join(', ') 
                          : <span className="text-ink-muted italic">{lang === 'tr' ? 'Belirtilmedi' : 'Nicht angegeben'}</span>}
                      </span>
                    </div>
                    {(selectedSupplierForOrder.contactPerson || selectedSupplierForOrder.phone || selectedSupplierForOrder.email) && (
                      <div className="flex items-center gap-2 pt-1.5 border-t border-line-soft/50 text-ink-soft">
                        <span className="truncate">
                          {selectedSupplierForOrder.contactPerson && `${selectedSupplierForOrder.contactPerson}`}
                          {selectedSupplierForOrder.contactPerson && selectedSupplierForOrder.phone && ' • '}
                          {selectedSupplierForOrder.phone}
                          {(selectedSupplierForOrder.contactPerson || selectedSupplierForOrder.phone) && selectedSupplierForOrder.email && ' • '}
                          {selectedSupplierForOrder.email}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2.5">
                  <h3 className="text-xs font-black uppercase tracking-wider text-ink-muted px-1">
                    {lang === 'tr' ? 'Ürün Kataloğu & Miktar Seçimi' : 'Artikelkatalog & Mengen'}
                  </h3>

                  <div className="space-y-2">
                    {selectedSupplierForOrder.catalog && selectedSupplierForOrder.catalog.length > 0 ? (
                      selectedSupplierForOrder.catalog.map((item) => {
                        const qty = orderQuantities[item.id] || 0;
                        return (
                          <div
                            key={item.id}
                            className={`p-3.5 rounded-2xl border transition flex items-center justify-between gap-3 card-inner ${
                              qty > 0 ? 'border-brand' : ''
                            }`}
                          >
                            <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-ink truncate">{item.name}</p>
                            <p className="text-[11px] text-subhead mt-0.5">
                              CHF {item.price.toFixed(2)} / {item.unit}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => handleQtyChange(item.id, -1)}
                              className="w-8 h-8 rounded-xl card-inner text-ink font-bold flex items-center justify-center border border-line"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-8 text-center text-xs font-black text-ink">
                              {qty}
                            </span>
                            <button
                              onClick={() => handleQtyChange(item.id, 1)}
                              className="w-8 h-8 rounded-xl card-inner text-ink font-bold flex items-center justify-center border border-line"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="w-20 text-right shrink-0">
                            <span className="text-xs font-extrabold text-ink">
                              CHF {(item.price * qty).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-4 rounded-2xl border border-line-soft bg-surface text-center text-ink-soft text-xs card-inner">
                      {lang === 'tr' 
                        ? 'Bu tedarikçi için ürün kataloğu henüz eklenmedi. Sadece serbest metin olarak sipariş notu bırakabilirsiniz.' 
                        : 'Für diesen Lieferanten ist noch kein Katalog hinterlegt. Sie können stattdessen die Bestellnotiz verwenden.'}
                    </div>
                  )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-ink block">
                    {lang === 'tr' ? 'Sipariş Notu / Teslimat Talimatı:' : 'Bestellnotiz & Lieferanweisung:'}
                  </label>
                  <textarea
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder={lang === 'tr' ? 'Örn: Saat 07:00 öncesi teslim edilsin, vakum ambalaj...' : 'z.B. Lieferung bis 07:00 Uhr, Rampe 2...'}
                    rows={2}
                    className="w-full p-3 rounded-2xl card-inner border border-line text-xs text-ink placeholder:text-ink-muted focus:outline-none"
                  />
                </div>

                <div className="pt-3 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] text-subhead block">
                      {lang === 'tr' ? 'Toplam Sipariş Tutarı:' : 'Gesamtsumme Bestellung:'}
                    </span>
                    <span className="text-xl font-black text-ink">
                      CHF {calculateOrderTotal(selectedSupplierForOrder).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 w-full sm:w-auto">
                    <button
                      onClick={() => setSelectedSupplierForOrder(null)}
                      className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl card-inner text-ink text-xs font-bold border border-line"
                    >
                      {lang === 'tr' ? 'İptal' : 'Abbrechen'}
                    </button>
                    <button
                      onClick={() => handleSubmitOrder(selectedSupplierForOrder)}
                      className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl btn-brand text-xs font-black flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>{lang === 'tr' ? 'Siparişi Ver (Bestellen)' : 'Bestellung aufgeben'}</span>
                    </button>
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

