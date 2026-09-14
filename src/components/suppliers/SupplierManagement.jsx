import React, { useState, useEffect } from 'react';
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
  AlertCircle,
  Pencil,
  Trash2,
  Save,
  UserPlus,
  Building2
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { SyncService } from '../../services/syncService';
import { TRANSLATIONS, translateDay } from '../../utils/translations';
import { formatCurrency } from '../../utils/formatters';

const EMPTY_SUPPLIER = {
  name: '', category: '', contactPerson: '', phone: '', whatsapp: '',
  email: '', address: '', notes: '', rating: 4.5, deliveryDays: [], catalog: []
};

export const SupplierManagement = ({ lang, currentUser }) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.de;
  const isAdmin = currentUser?.role === 'admin';
  const [suppliers, setSuppliers] = useState(StorageService.getSuppliers());
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [selectedSupplierForOrder, setSelectedSupplierForOrder] = useState(null);
  const [orderQuantities, setOrderQuantities] = useState({});
  const [orderNotes, setOrderNotes] = useState('');
  const [orderSentSuccess, setOrderSentSuccess] = useState(false);

  // Admin CRUD state
  const [showEditModal, setShowEditModal]   = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [deleteConfirm, setDeleteConfirm]   = useState(null); // supplier to delete
  const [deliveryDayInput, setDeliveryDayInput] = useState('');
  const [newCatalogItem, setNewCatalogItem] = useState({ name: '', price: '', unit: 'Stück' });
  const [editModalTab, setEditModalTab]     = useState('info'); // 'info' | 'catalog'

  // Listen for Supabase background sync database updates and initial sync
  useEffect(() => {
    const initSuppliers = async () => {
      if (SyncService.isLive()) {
        await SyncService.syncSuppliers();
      }
      setSuppliers(StorageService.getSuppliers());
    };
    initSuppliers();

    const handleDbUpdate = () => {
      const updatedList = StorageService.getSuppliers();
      setSuppliers(updatedList);
    };

    window.addEventListener('ado_db_update', handleDbUpdate);
    return () => window.removeEventListener('ado_db_update', handleDbUpdate);
  }, []);

  const categories = [
    { id: 'all',        label: lang === 'tr' ? 'Tümü' : 'Alle' },
    { id: 'metzgerei',  label: lang === 'tr' ? 'Kasap & Et' : 'Metzgerei' },
    { id: 'grosshandel',label: lang === 'tr' ? 'Toptan Grossmarket' : 'Grosshandel' },
    { id: 'gemuese',    label: lang === 'tr' ? 'Sebze & Meyve' : 'Gemüse & Früchte' },
    { id: 'getraenke',  label: lang === 'tr' ? 'İçecekler' : 'Getränke' },
    { id: 'baeckerei',  label: lang === 'tr' ? 'Fırın & Unlu Mamüller' : 'Bäckerei' },
    { id: 'hygiene',    label: lang === 'tr' ? 'Temizlik & Hijyen' : 'Hygiene' }
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
    const orderItems = (supplier.catalog || [])
      .filter(item => (orderQuantities[item.id] || 0) > 0)
      .map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        unit: item.unit,
        quantity: orderQuantities[item.id]
      }));

    if (orderItems.length === 0 && !orderNotes?.trim()) {
      alert(lang === 'tr' ? 'Lütfen en az 1 ürün seçin veya sipariş notu girin!' : 'Bitte wählen Sie mindestens 1 Artikel aus oder geben Sie eine Notiz ein!');
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

    // WhatsApp / Mail Yönlendirmesi
    let rawPhone = (supplier.whatsapp || supplier.phone || '').replace(/[^0-9]/g, '');
    if (rawPhone.startsWith('0')) {
      rawPhone = '41' + rawPhone.slice(1);
    }

    let msg = `*BESTELLUNG / SİPARİŞ*\n`;
    msg += `*Tedarikçi / Lieferant:* ${supplier.name}\n`;
    msg += `*Tarih / Datum:* ${new Date().toLocaleDateString('de-CH')}\n\n`;
    
    if (orderItems.length > 0) {
      msg += `*Ürünler / Artikel:*\n`;
      orderItems.forEach(item => {
        msg += `• ${item.quantity}x ${item.name} (${item.unit || 'stk'}) - CHF ${(item.price * item.quantity).toFixed(2)}\n`;
      });
      msg += `\n*Toplam Tutar / Gesamt:* CHF ${total.toFixed(2)}\n`;
    }
    
    if (orderNotes?.trim()) {
      msg += `\n*Sipariş Notu / Notiz:*\n${orderNotes.trim()}\n`;
    }

    if (rawPhone) {
      const waUrl = `https://wa.me/${rawPhone}?text=${encodeURIComponent(msg)}`;
      window.open(waUrl, '_blank');
    } else if (supplier.email) {
      const mailUrl = `mailto:${supplier.email}?subject=${encodeURIComponent(`Sipariş / Bestellung - ${supplier.name}`)}&body=${encodeURIComponent(msg)}`;
      window.open(mailUrl, '_blank');
    }

    setOrderSentSuccess(true);
    setTimeout(() => {
      setSelectedSupplierForOrder(null);
      setOrderSentSuccess(false);
      setOrderQuantities({});
      setOrderNotes('');
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

  // ── Admin CRUD ──────────────────────────────────────────────
  const openAddModal = () => {
    setEditingSupplier({ ...EMPTY_SUPPLIER, id: `sup-${Date.now()}` });
    setDeliveryDayInput('');
    setEditModalTab('info');
    setShowEditModal(true);
  };

  const openEditModal = (supplier, e) => {
    if (e) e.stopPropagation();
    setEditingSupplier({ ...supplier });
    setDeliveryDayInput('');
    setEditModalTab('info');
    setShowEditModal(true);
  };

  const handleSaveSupplier = async () => {
    if (!editingSupplier?.name?.trim()) return;
    StorageService.saveSupplier(editingSupplier);
    if (SyncService.isLive()) {
      await SyncService.syncSuppliers();
    }
    setSuppliers(StorageService.getSuppliers());
    setShowEditModal(false);
    setEditingSupplier(null);
  };

  const handleDeleteSupplier = (supplier) => {
    StorageService.deleteSupplier(supplier.id);
    setSuppliers(StorageService.getSuppliers());
    setDeleteConfirm(null);
  };

  const addDeliveryDay = () => {
    const day = deliveryDayInput.trim();
    if (!day) return;
    setEditingSupplier(prev => ({
      ...prev,
      deliveryDays: [...(prev.deliveryDays || []), day]
    }));
    setDeliveryDayInput('');
  };

  const removeDeliveryDay = (idx) => {
    setEditingSupplier(prev => ({
      ...prev,
      deliveryDays: prev.deliveryDays.filter((_, i) => i !== idx)
    }));
  };

  const handleAddCatalogItem = () => {
    if (!newCatalogItem.name?.trim()) return;
    const itemToAdd = {
      id: `item-${Date.now()}`,
      name: newCatalogItem.name.trim(),
      price: parseFloat(newCatalogItem.price) || 0,
      unit: newCatalogItem.unit.trim() || 'Stück'
    };
    setEditingSupplier(prev => ({
      ...prev,
      catalog: [...(prev?.catalog || []), itemToAdd]
    }));
    setNewCatalogItem({ name: '', price: '', unit: 'Stück' });
  };

  const handleRemoveCatalogItem = (index) => {
    setEditingSupplier(prev => ({
      ...prev,
      catalog: (prev?.catalog || []).filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-5">

      <div className="p-5 rounded-3xl bg-surface text-ink border border-line relative overflow-hidden mb-6 card-inner">
        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
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

          <div className="w-full md:w-fit shrink-0 md:ml-auto">
            <div className="grid grid-cols-3 gap-2">
              {isAdmin && (
                <button
                  onClick={openAddModal}
                  className="px-3.5 py-2 rounded-md btn-brand font-black text-xs flex items-center justify-center gap-1 transition text-center col-span-1 cursor-pointer"
                  title={lang === 'tr' ? 'Yeni Tedarikçi Ekle' : 'Neuer Lieferant'}
                >
                  <UserPlus className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{lang === 'tr' ? '+ Yeni' : '+ Neu'}</span>
                </button>
              )}

              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3.5 py-2 rounded-md text-xs font-bold flex items-center justify-center transition text-center cursor-pointer ${
                  !isAdmin ? 'col-span-3' : 'col-span-2'
                } ${
                  selectedCategory === 'all'
                    ? 'btn-brand font-black'
                    : 'card-inner text-ink border border-line'
                }`}
              >
                <span>{lang === 'tr' ? 'Tümü' : 'Alle'}</span>
              </button>

              {categories.filter(c => c.id !== 'all').map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-md text-xs font-bold flex items-center justify-center transition text-center truncate cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'btn-brand font-black'
                      : 'card-inner text-ink border border-line'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
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
              <span className="text-[10px] font-normal uppercase tracking-widest text-ink">
                {supplier.category}
              </span>
              <h3 className="font-normal text-base text-ink mt-0.5 leading-snug group- transition">
                {supplier.name}
              </h3>
              <p className="text-xs font-normal text-ink mt-1 flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-ink shrink-0" />
                {supplier.address}
              </p>
            </div>

            <div className="flex items-start gap-2 card-inner border border-line-soft rounded-xl p-3">
              <Clock className="w-3.5 h-3.5 text-brand icon-brand shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-normal uppercase tracking-wider text-ink block mb-0.5">
                  {lang === 'tr' ? 'Teslimat Günleri' : 'Liefertage'}
                </span>
                <span className="text-xs font-normal text-ink">
                  {(supplier.deliveryDays || []).map(day => translateDay(day, lang)).join(' · ')}
                </span>
              </div>
            </div>

            <button
              onClick={(e) => handleOpenOrderModal(supplier, e)}
              className="w-full py-2.5 rounded-xl btn-brand font-black text-xs flex items-center justify-center gap-2 transition"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{lang === 'tr' ? 'Sipariş Ver' : 'Bestellung aufgeben'}</span>
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
              {isAdmin && (
                <>
                  <button
                    onClick={(e) => openEditModal(supplier, e)}
                    className="py-2 px-3 rounded-xl border border-line bg-surface text-ink-soft hover:text-ink transition card-inner"
                    title={lang === 'tr' ? 'Düzenle' : 'Bearbeiten'}
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleteConfirm(supplier); }}
                    className="py-2 px-3 rounded-xl border border-line bg-surface text-red-400 hover:text-red-300 transition card-inner"
                    title={lang === 'tr' ? 'Sil' : 'Löschen'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedSupplierForOrder && (
        <div 
          className="fixed inset-0 z-50 flex justify-start bg-black/70 backdrop-blur-xs modal-backdrop"
          onClick={() => setSelectedSupplierForOrder(null)}
        >
          <div 
            className="w-full max-w-xl sm:max-w-2xl h-full bg-surface border-r border-line p-6 flex flex-col gap-4 overflow-y-auto text-ink shadow-2xl drawer-left-container pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="flex items-start justify-between border-b border-line pb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl icon-box flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-normal uppercase tracking-wider text-ink">
                    {selectedSupplierForOrder.category}
                  </span>
                  <h2 className="text-lg font-normal text-ink leading-tight">
                    {selectedSupplierForOrder.name}
                  </h2>
                  <p className="text-xs font-normal text-ink mt-0.5">
                    {lang === 'tr' ? 'Yeni Sipariş Listesi' : 'Neue Bestellung aufgeben'}
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
                          ? selectedSupplierForOrder.deliveryDays.map(day => translateDay(day, lang)).join(', ') 
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
                      <span>{lang === 'tr' ? 'Siparişi Ver' : 'Bestellung aufgeben'}</span>
                    </button>
                  </div>
                </div>
              </>
             )}

          </div>
        </div>
      )}

      {/* ── Admin: Tedarikçi Ekle / Düzenle Modalı ── */}
      {showEditModal && editingSupplier && (
        <div 
          className="fixed inset-0 z-50 flex justify-start bg-black/70 backdrop-blur-xs modal-backdrop"
          onClick={() => setShowEditModal(false)}
        >
          <div 
            className="w-full max-w-xl sm:max-w-2xl h-full bg-surface border-r border-line p-6 flex flex-col gap-4 overflow-y-auto text-ink shadow-2xl drawer-left-container pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <h2 className="font-black text-base text-ink">
                {editingSupplier.name ? (lang === 'tr' ? 'Tedarikçi Düzenle' : 'Lieferant bearbeiten') : (lang === 'tr' ? 'Yeni Tedarikçi' : 'Neuer Lieferant')}
              </h2>
              <button onClick={() => setShowEditModal(false)} className="p-2 rounded-xl card-inner border border-line text-ink">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* ── Modal Üst Sekme Butonları (Firma Bearbeiten / Ürün Bearbeiten) ── */}
            <div className="flex items-center gap-2 border-b border-line-soft pb-3">
              <button
                type="button"
                onClick={() => setEditModalTab('info')}
                className={`px-4 py-2.5 rounded-md text-xs font-bold transition flex items-center gap-2 ${
                  editModalTab === 'info'
                    ? 'bg-[#2e1f1c] border border-brand/50 text-brand font-black shadow-xs'
                    : 'card-inner border border-line-soft text-ink-soft hover:text-ink'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>{lang === 'tr' ? '1. Firma Bilgileri' : '1. Firma bearbeiten'}</span>
              </button>
              <button
                onClick={() => setEditModalTab('catalog')}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition ${
                  editModalTab === 'catalog'
                    ? 'btn-brand font-black'
                    : 'card-inner text-ink border border-line'
                }`}
              >
                {lang === 'tr' ? '2. Ürün Kataloğu' : '2. Produkte bearbeiten'} ({editingSupplier.catalog?.length || 0})
              </button>
            </div>

            {/* ── Tab 1: Firma Bilgileri ── */}
            {editModalTab === 'info' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-subhead mb-1">
                    {lang === 'tr' ? 'Tedarikçi Adı *' : 'Lieferant Name *'}
                  </label>
                  <input
                    type="text"
                    value={editingSupplier.name || ''}
                    onChange={(e) => setEditingSupplier({ ...editingSupplier, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-line bg-subtle text-ink text-xs focus:border-brand focus:outline-hidden"
                    placeholder="z.B. Prodega CC Dietikon"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-subhead mb-1">
                    {lang === 'tr' ? 'Kategori' : 'Kategorie'}
                  </label>
                  <input
                    type="text"
                    value={editingSupplier.category || ''}
                    onChange={(e) => setEditingSupplier({ ...editingSupplier, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-line bg-subtle text-ink text-xs focus:border-brand focus:outline-hidden"
                    placeholder="z.B. Grosshandel & C&C"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-subhead mb-1">
                      {lang === 'tr' ? 'İletişim Kişisi' : 'Ansprechpartner'}
                    </label>
                    <input
                      type="text"
                      value={editingSupplier.contactPerson || ''}
                      onChange={(e) => setEditingSupplier({ ...editingSupplier, contactPerson: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-line bg-subtle text-ink text-xs focus:border-brand focus:outline-hidden"
                      placeholder="z.B. Marco Bellini"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-subhead mb-1">
                      {lang === 'tr' ? 'Telefon' : 'Telefon'}
                    </label>
                    <input
                      type="text"
                      value={editingSupplier.phone || ''}
                      onChange={(e) => setEditingSupplier({ ...editingSupplier, phone: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-line bg-subtle text-ink text-xs focus:border-brand focus:outline-hidden"
                      placeholder="+41 44 ..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-subhead mb-1">
                      {lang === 'tr' ? 'E-posta' : 'E-Mail'}
                    </label>
                    <input
                      type="email"
                      value={editingSupplier.email || ''}
                      onChange={(e) => setEditingSupplier({ ...editingSupplier, email: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-line bg-subtle text-ink text-xs focus:border-brand focus:outline-hidden"
                      placeholder="bestellung@..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-subhead mb-1">
                      {lang === 'tr' ? 'WhatsApp No' : 'WhatsApp Numara'}
                    </label>
                    <input
                      type="text"
                      value={editingSupplier.whatsapp || ''}
                      onChange={(e) => setEditingSupplier({ ...editingSupplier, whatsapp: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-line bg-subtle text-ink text-xs focus:border-brand focus:outline-hidden"
                      placeholder="+4179..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-subhead mb-1">
                    {lang === 'tr' ? 'Adres' : 'Adresse'}
                  </label>
                  <input
                    type="text"
                    value={editingSupplier.address || ''}
                    onChange={(e) => setEditingSupplier({ ...editingSupplier, address: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-line bg-subtle text-ink text-xs focus:border-brand focus:outline-hidden"
                    placeholder="Strasse, PLZ Ort"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-subhead mb-1">
                    {lang === 'tr' ? 'Teslimat Günleri' : 'Liefertage'}
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={deliveryDayInput}
                      onChange={(e) => setDeliveryDayInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addDeliveryDay(); } }}
                      className="flex-1 p-2.5 rounded-xl border border-line bg-subtle text-ink text-xs focus:border-brand focus:outline-hidden"
                      placeholder={lang === 'tr' ? 'gün ekle e.g. Pazartesi' : 'Tag hinzufügen z.B. Montag'}
                    />
                    <button
                      onClick={addDeliveryDay}
                      className="px-3.5 py-2.5 rounded-xl btn-brand text-xs font-bold"
                    >
                      {lang === 'tr' ? 'Ekle' : 'Hinzufügen'}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(editingSupplier.deliveryDays || []).map((day, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface border border-line text-xs font-semibold">
                        {translateDay(day, lang)}
                        <button onClick={() => removeDeliveryDay(idx)} className="text-ink-muted hover:text-red-400">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Tab 2: Ürün Kataloğu Ekle / Yönet ── */}
            {editModalTab === 'catalog' && (
              <div className="space-y-4">
                <label className="text-[11px] font-black text-ink-muted uppercase tracking-wider block">
                  {lang === 'tr' ? 'Firma Ürün Kataloğu' : 'Artikelkatalog der Firma'} ({editingSupplier.catalog?.length || 0})
                </label>

                {/* Mevcut Ürün Listesi */}
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {(editingSupplier.catalog || []).length === 0 ? (
                    <p className="text-xs text-ink-muted italic p-4 card-inner border border-line-soft rounded-xl text-center">
                      {lang === 'tr' ? 'Henüz eklenmiş ürün bulunmuyor. Aşağıdaki formu kullanarak yeni ürün ekleyebilirsiniz.' : 'Noch keine Artikel hinzugefügt. Nutze das Formular unten.'}
                    </p>
                  ) : (
                    editingSupplier.catalog.map((item, idx) => (
                      <div key={item.id || idx} className="flex items-center justify-between gap-3 p-3 rounded-xl card-inner border border-line text-xs">
                        <div className="flex-1 min-w-0">
                          <span className="font-bold text-ink truncate block">{item.name}</span>
                          <span className="text-[11px] text-subhead">CHF {Number(item.price).toFixed(2)} / {item.unit}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveCatalogItem(idx)}
                          className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition"
                          title={lang === 'tr' ? 'Ürünü Sil' : 'Artikel löschen'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Yeni Ürün Ekleme Formu */}
                <div className="p-4 rounded-2xl card-inner border border-line space-y-3">
                  <span className="text-[11px] font-bold text-brand block">
                    {lang === 'tr' ? '+ Kataloğa Yeni Ürün Ekle (Neuen Artikel hinzufügen)' : '+ Neuen Artikel hinzufügen'}
                  </span>
                  <div className="space-y-3">
                    {/* Satır 1: Ürün Adı (Artikelname) - Tam Genişlik */}
                    <div>
                      <label className="text-[10px] font-bold text-ink-muted uppercase block mb-1">
                        {lang === 'tr' ? 'Ürün Adı *' : 'Artikelname *'}
                      </label>
                      <input
                        type="text"
                        placeholder={lang === 'tr' ? 'Örn: Süt 1L' : 'z.B. Milch 1L'}
                        value={newCatalogItem.name}
                        onChange={(e) => setNewCatalogItem(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl card-inner border border-line text-xs text-ink focus:outline-none focus:border-brand"
                      />
                    </div>

                    {/* Satır 2: Fiyat (daha dar) ve Birim + Ekle Butonu */}
                    <div className="grid grid-cols-12 gap-2.5">
                      <div className="col-span-4">
                        <label className="text-[10px] font-bold text-ink-muted uppercase block mb-1">
                          {lang === 'tr' ? 'Fiyat (CHF)' : 'Preis (CHF)'}
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="2.50"
                          value={newCatalogItem.price}
                          onChange={(e) => setNewCatalogItem(prev => ({ ...prev, price: e.target.value }))}
                          className="w-full px-3 py-2 rounded-xl card-inner border border-line text-xs text-ink focus:outline-none focus:border-brand"
                        />
                      </div>
                      <div className="col-span-8">
                        <label className="text-[10px] font-bold text-ink-muted uppercase block mb-1">
                          {lang === 'tr' ? 'Birim' : 'Einheit'}
                        </label>
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            placeholder={lang === 'tr' ? 'Örn: Flasche, kg' : 'z.B. Flasche, kg'}
                            value={newCatalogItem.unit}
                            onChange={(e) => setNewCatalogItem(prev => ({ ...prev, unit: e.target.value }))}
                            className="flex-1 px-3 py-2 rounded-xl card-inner border border-line text-xs text-ink focus:outline-none focus:border-brand min-w-0"
                          />
                          <button
                            type="button"
                            onClick={handleAddCatalogItem}
                            className="px-4 py-2 rounded-xl btn-brand text-white font-black text-xs shrink-0 flex items-center justify-center gap-1 shadow-md"
                          >
                            <Plus className="w-4 h-4 text-white" />
                            <span>{lang === 'tr' ? 'Ekle' : 'Hinzufügen'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-3 border-t border-line">
              <button onClick={() => setShowEditModal(false)} className="flex-1 py-2.5 rounded-xl card-inner border border-line text-xs font-bold text-ink">
                {lang === 'tr' ? 'İptal' : 'Abbrechen'}
              </button>
              <button onClick={handleSaveSupplier} className="flex-1 py-2.5 rounded-xl btn-brand font-black text-xs flex items-center justify-center gap-2">
                <Save className="w-4 h-4" />
                {lang === 'tr' ? 'Kaydet' : 'Speichern'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Admin: Silme Onayı ── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs modal-backdrop">
          <div className="w-full max-w-sm rounded-3xl bg-surface border border-line p-6 space-y-4 modal-container text-ink">
            <div className="flex items-center gap-3">
              <Trash2 className="w-5 h-5 text-red-400 shrink-0" />
              <div>
                <p className="font-black text-sm text-ink">{lang === 'tr' ? 'Tedarikçiyi Sil?' : 'Lieferant löschen?'}</p>
                <p className="text-xs text-ink-soft mt-0.5">{deleteConfirm.name}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl card-inner border border-line text-xs font-bold text-ink">
                {lang === 'tr' ? 'İptal' : 'Abbrechen'}
              </button>
              <button onClick={() => handleDeleteSupplier(deleteConfirm)} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-black text-xs flex items-center justify-center gap-1.5">
                <Trash2 className="w-3.5 h-3.5" />
                {lang === 'tr' ? 'Evet, Sil' : 'Ja, löschen'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

