import React, { useState } from 'react';
import {
  Truck,
  Plus,
  Phone,
  Mail,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  Copy,
  Calendar,
  X,
  FileCheck2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { StorageService } from '../../services/storage';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { TRANSLATIONS } from '../../utils/translations';

export const SupplierManagement = ({ lang, currentUser }) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.de;
  const [suppliers, setSuppliers] = useState(StorageService.getSuppliers());
  const [orders, setOrders] = useState(StorageService.getOrders());
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('suppliers');
  
  // Order Modal State
  const [orderModalSupplier, setOrderModalSupplier] = useState(null);
  const [cart, setCart] = useState({});
  const [deliveryDate, setDeliveryDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [orderNotes, setOrderNotes] = useState('');
  const [copiedNotification, setCopiedNotification] = useState(false);

  const categories = [
    { id: 'all', label: lang === 'tr' ? 'Tüm Tedarikçiler' : 'Alle Lieferanten' },
    { id: 'metzgerei', label: 'Metzgerei (Kasap)' },
    { id: 'grosshandel', label: 'Grosshandel (Prodega)' },
    { id: 'gemuese', label: 'Gemüse & Früchte' },
    { id: 'getraenke', label: 'Getränke & Wein' },
    { id: 'baeckerei', label: 'Bäckerei (Fırın)' },
    { id: 'hygiene', label: 'Hygiene & Reinigung' }
  ];

  const filteredSuppliers = suppliers.filter(s => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'metzgerei') return s.category.toLowerCase().includes('metzgerei');
    if (selectedCategory === 'grosshandel') return s.category.toLowerCase().includes('grosshandel') || s.name.includes('Prodega');
    if (selectedCategory === 'gemuese') return s.category.toLowerCase().includes('gemüse') || s.category.toLowerCase().includes('obst');
    if (selectedCategory === 'getraenke') return s.category.toLowerCase().includes('getränke') || s.category.toLowerCase().includes('bier');
    if (selectedCategory === 'baeckerei') return s.category.toLowerCase().includes('bäckerei');
    if (selectedCategory === 'hygiene') return s.category.toLowerCase().includes('hygiene');
    return true;
  });

  const openOrderModal = (supplier) => {
    setOrderModalSupplier(supplier);
    setCart({});
    setOrderNotes('');
  };

  const updateQuantity = (productId, delta) => {
    setCart(prev => {
      const current = prev[productId] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      }
      return { ...prev, [productId]: next };
    });
  };

  const calculateTotal = () => {
    if (!orderModalSupplier) return 0;
    return Object.entries(cart).reduce((sum, [pId, qty]) => {
      const prod = orderModalSupplier.catalog.find(p => p.id === pId);
      return sum + (prod ? prod.price * qty : 0);
    }, 0);
  };

  const generateOrderText = () => {
    if (!orderModalSupplier) return '';
    const itemsText = Object.entries(cart).map(([pId, qty]) => {
      const prod = orderModalSupplier.catalog.find(p => p.id === pId);
      return `- ${qty}x ${prod.name} (${formatCurrency(prod.price * qty)})`;
    }).join('\n');

    return `*BESTELLUNG: ADO Enterprise Gastronomie*\n` +
      `Lieferant: ${orderModalSupplier.name}\n` +
      `Lieferdatum gewünscht: ${deliveryDate}\n` +
      `Besteller: ${currentUser?.name || 'Betriebsleitung'}\n\n` +
      `*Artikel:*\n${itemsText}\n\n` +
      `*Gesamtwert geschätzt:* ${formatCurrency(calculateTotal())}\n` +
      (orderNotes ? `*Hinweis / Notiz:* ${orderNotes}\n\n` : '\n') +
      `Bitte um kurze Bestätigung. Vielen Dank!`;
  };

  const handleSendWhatsApp = () => {
    const text = generateOrderText();
    const phone = orderModalSupplier?.whatsapp?.replace(/[^0-9]/g, '') || '';
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleCopyText = () => {
    const text = generateOrderText();
    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 3000);
  };

  const handleSaveOrder = () => {
    const total = calculateTotal();
    if (total === 0) return;

    const items = Object.entries(cart).map(([pId, qty]) => {
      const prod = orderModalSupplier.catalog.find(p => p.id === pId);
      return {
        name: prod.name,
        quantity: qty,
        unit: prod.unit,
        price: prod.price
      };
    });

    StorageService.addOrder({
      supplierId: orderModalSupplier.id,
      supplierName: orderModalSupplier.name,
      date: new Date().toISOString().split('T')[0],
      deliveryDate,
      status: 'bestellt',
      totalAmount: total,
      items,
      notes: orderNotes
    });

    setOrders(StorageService.getOrders());
    setOrderModalSupplier(null);

    confetti({
      particleCount: 75,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  const handleToggleStatus = (orderId, newStatus) => {
    StorageService.updateOrderStatus(orderId, newStatus);
    setOrders(StorageService.getOrders());
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl glass-panel relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-2">
              <Truck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Intelligentes Lieferanten- & Bestellmanagement</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {t.supplierTitle}
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl">
              {t.supplierSubtitle}
            </p>
          </div>

          {/* Sub Navigation */}
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shrink-0">
            <button
              onClick={() => setActiveTab('suppliers')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'suppliers'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lang === 'tr' ? 'Tedarikçi Kataloğu' : 'Lieferanten-Katalog'} ({suppliers.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'orders'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{t.orderHistory}</span>
              <span className="badge badge-emerald py-0 px-1.5 text-[10px]">
                {orders.length}
              </span>
            </button>
          </div>
        </div>

        {/* Category Filters */}
        {activeTab === 'suppliers' && (
          <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content Area */}
      {activeTab === 'suppliers' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSuppliers.map((supplier) => (
            <div
              key={supplier.id}
              className="glass-panel glass-panel-hover p-5 flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="badge badge-emerald text-[11px] mb-1.5">
                      {supplier.category}
                    </span>
                    <h3 className="font-bold text-base text-slate-900 leading-snug">
                      {supplier.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg text-amber-800 text-xs font-bold">
                    ★ {supplier.rating}
                  </div>
                </div>

                <p className="text-xs text-slate-600 mb-4 line-clamp-2">
                  {supplier.notes}
                </p>

                {/* Key Info */}
                <div className="space-y-2 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      {t.deliveryDays}:
                    </span>
                    <span className="font-semibold text-slate-900">
                      {supplier.deliveryDays.join(', ')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <ShoppingBag className="w-3.5 h-3.5 text-cyan-600" />
                      {t.minOrder}:
                    </span>
                    <span className="font-semibold text-emerald-700">
                      {formatCurrency(supplier.minOrderChf)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-purple-600" />
                      {supplier.contactPerson}:
                    </span>
                    <span className="font-mono text-slate-800">
                      {supplier.phone}
                    </span>
                  </div>
                </div>

                {/* Catalog Snippet */}
                <div className="mb-4">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    {lang === 'tr' ? 'Popüler Ürünler' : 'Ausgewählte Artikel'}:
                  </div>
                  <div className="space-y-1">
                    {supplier.catalog.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between text-xs py-1 border-b border-slate-100"
                      >
                        <span className="text-slate-700 truncate pr-2">{item.name}</span>
                        <span className="font-mono font-bold text-slate-900 shrink-0">
                          {formatCurrency(item.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action */}
              <button
                onClick={() => openOrderModal(supplier)}
                className="w-full py-2.5 rounded-xl gradient-btn-emerald font-bold text-xs flex items-center justify-center gap-2 transition shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>{t.newOrder}</span>
              </button>
            </div>
          ))}
        </div>
      ) : (
        /* Orders History Tab */
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-emerald-600" />
              <span>{t.orderHistory}</span>
            </h2>
            <span className="text-xs text-slate-500">
              {orders.length} {lang === 'tr' ? 'toplam sipariş' : 'Bestellungen insgesamt'}
            </span>
          </div>

          <div className="space-y-3">
            {orders.length === 0 ? (
              <p className="text-center py-10 text-slate-400 text-xs">
                {lang === 'tr' ? 'Kayıtlı sipariş bulunmuyor.' : 'Keine Bestellungen vorhanden.'}
              </p>
            ) : (
              orders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className="font-bold text-sm text-slate-900">
                        {ord.supplierName}
                      </span>
                      <span
                        className={`badge ${
                          ord.status === 'geliefert'
                            ? 'badge-emerald'
                            : ord.status === 'reklamiert'
                            ? 'badge-rose'
                            : 'badge-blue'
                        }`}
                      >
                        {ord.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>Bestellt am: {formatDate(ord.date)}</span>
                      <span>Lieferdatum: {formatDate(ord.deliveryDate)}</span>
                    </div>

                    <div className="text-xs text-slate-700">
                      {ord.items.map(i => `${i.quantity}x ${i.name}`).join(' · ')}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end md:self-auto">
                    <div className="text-right">
                      <p className="text-xs text-slate-500">{lang === 'tr' ? 'Toplam' : 'Gesamt'}</p>
                      <p className="text-base font-extrabold font-mono text-emerald-700">
                        {formatCurrency(ord.totalAmount)}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {ord.status !== 'geliefert' && (
                        <button
                          onClick={() => handleToggleStatus(ord.id, 'geliefert')}
                          className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center gap-1 transition"
                          title="Lieferung bestätigen"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{lang === 'tr' ? 'Teslim Alındı' : 'Geliefert'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* New Order Modal */}
      {orderModalSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl relative max-h-[90vh] flex flex-col border border-slate-200">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <span className="badge badge-emerald text-[11px] mb-1">
                  {orderModalSupplier.category}
                </span>
                <h2 className="text-lg font-bold text-slate-900">
                  {t.newOrder}: {orderModalSupplier.name}
                </h2>
                <p className="text-xs text-slate-500">
                  {orderModalSupplier.address} · {orderModalSupplier.phone}
                </p>
              </div>
              <button
                onClick={() => setOrderModalSupplier(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Catalog Items Selector */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 my-2">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                {lang === 'tr' ? 'Ürün Seçimi & Miktar Belirleme' : 'Produkte auswählen & Menge festlegen'}:
              </p>

              {orderModalSupplier.catalog.map((prod) => {
                const qty = cart[prod.id] || 0;
                return (
                  <div
                    key={prod.id}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 hover:border-slate-300 transition"
                  >
                    <div>
                      <h4 className="font-semibold text-xs text-slate-900">{prod.name}</h4>
                      <p className="text-[11px] text-slate-500">
                        {formatCurrency(prod.price)} / {prod.unit}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center bg-white rounded-xl p-1 border border-slate-200 shadow-sm">
                        <button
                          type="button"
                          onClick={() => updateQuantity(prod.id, -1)}
                          className="w-7 h-7 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm transition"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-mono font-bold text-slate-900">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(prod.id, 1)}
                          className="w-7 h-7 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm transition"
                        >
                          +
                        </button>
                      </div>

                      <div className="w-20 text-right font-mono text-xs font-bold text-emerald-700">
                        {qty > 0 ? formatCurrency(prod.price * qty) : '-'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Delivery Date & Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-3 border-t border-slate-100">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'tr' ? 'İstenen Teslimat Günü' : 'Wunschlieferdatum'}:
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-emerald-600 absolute left-3 top-2.5" />
                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {lang === 'tr' ? 'Özel Not / İstek' : 'Besondere Bemerkung'}:
                </label>
                <input
                  type="text"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder={lang === 'tr' ? 'Örn: Vakumlu paket...' : 'z.B. Vakuumverpackt...'}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Total & Action Buttons */}
            <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-500">
                  {lang === 'tr' ? 'Sipariş Toplamı' : 'Bestellsumme (geschätzt)'}:
                </span>
                <p className="text-xl font-extrabold font-mono text-emerald-700">
                  {formatCurrency(calculateTotal())}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleSendWhatsApp}
                  disabled={calculateTotal() === 0}
                  className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 transition disabled:opacity-40"
                  title="Per WhatsApp senden"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                  <span>WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyText}
                  disabled={calculateTotal() === 0}
                  className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition disabled:opacity-40"
                  title="Bestelltext kopieren"
                >
                  <Copy className="w-3.5 h-3.5 text-slate-600" />
                  <span>{copiedNotification ? 'Kopiert!' : 'Kopieren'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveOrder}
                  disabled={calculateTotal() === 0}
                  className="w-full sm:w-auto px-5 py-2 rounded-xl gradient-btn-emerald font-extrabold text-xs flex items-center justify-center gap-2 transition disabled:opacity-40 shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{lang === 'tr' ? 'Siparişi Kaydet' : 'Bestellung buchen'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
