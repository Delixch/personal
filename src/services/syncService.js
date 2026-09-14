import { supabase, isSupabaseConfigured } from './supabase';
import { SEED_SUPPLIERS } from './seedData';

export const SyncService = {
  isLive: () => isSupabaseConfigured && Boolean(supabase),

  // 1. TÜM VERİLERİ SUPABASE'DEN ÇEKİP YEREL DEPOYA EŞİTLEME
  syncAll: async () => {
    if (!SyncService.isLive()) return false;
    try {
      await Promise.allSettled([
        SyncService.syncEmployees(),
        SyncService.syncTimeLogs(),
        SyncService.syncShifts(),
        SyncService.syncInvoices(),
        SyncService.syncSuppliers(),
        SyncService.syncBulletins(),
        SyncService.syncTemperatures(),
        SyncService.syncSickLeaves()
      ]);
      window.dispatchEvent(new Event('ado_db_update'));
      return true;
    } catch (err) {
      console.warn('SyncAll warning:', err);
      return false;
    }
  },

  // PERSONEL SENKRONİZASYONU
  syncEmployees: async () => {
    if (!SyncService.isLive()) return;
    try {
      const { data, error } = await supabase.from('mitarbeiter').select('*');
      if (error) throw error;
      if (data && data.length > 0) {
        // Mevcut local veriyi oku — password, department, jobTitle gibi local alanları koru
        let localList = [];
        try {
          const raw = localStorage.getItem('ado_employees_v1');
          localList = raw ? JSON.parse(raw) : [];
        } catch (_) {}

        let customAvatars = {};
        try {
          const rawCustom = localStorage.getItem('ado_custom_avatars_v1');
          customAvatars = rawCustom ? JSON.parse(rawCustom) : {};
        } catch (_) {}

        let customAvatarsUpdated = false;

        const mapped = data.map(m => {
          // Aynı PIN, ID veya E-posta'lı local kaydı bul (tip uyuşmazlığını önlemek için String karşılaştırma)
          const local = localList.find(e =>
            (e.pin && m.pin && String(e.pin) === String(m.pin)) ||
            (e.id && m.id && e.id === m.id) ||
            (e.email && m.email && e.email.toLowerCase() === m.email.toLowerCase())
          ) || {};

          // Yerelde saklanan özel avatarı bul
          const customLocalAvatar = customAvatars[m.id] ||
                                    customAvatars[String(m.pin)] ||
                                    customAvatars[m.email] ||
                                    customAvatars[local.id] ||
                                    customAvatars[String(local.pin)] ||
                                    (local.avatar && local.avatar.startsWith('data:image') ? local.avatar : null);

          let avatarVal = '';
          const isUnsplashUrl = Boolean(m.avatar && m.avatar.includes('unsplash.com'));

          if (m.avatar && m.avatar.startsWith('data:image')) {
            // Supabase'de özel Base64 resim var, bunu kullan ve yerel haritaya kaydet
            avatarVal = m.avatar;
            if (m.id) customAvatars[m.id] = m.avatar;
            if (m.pin) customAvatars[String(m.pin)] = m.avatar;
            if (m.email) customAvatars[m.email] = m.avatar;
            if (local.id) customAvatars[local.id] = m.avatar;
            if (local.pin) customAvatars[String(local.pin)] = m.avatar;
            customAvatarsUpdated = true;
          } else if (customLocalAvatar) {
            // Yerelde özel avatar var -> Supabase'deki Unsplash linkinin resmi SILMESINI / EZMESINI ENGELLE!
            avatarVal = customLocalAvatar;
            if (isUnsplashUrl || !m.avatar) {
              SyncService.pushEmployee({ ...local, ...m, avatar: customLocalAvatar });
            }
          } else if (m.avatar && !isUnsplashUrl) {
            avatarVal = m.avatar;
          } else {
            avatarVal = (m.avatar && m.avatar.length > 5) ? m.avatar : (local.avatar || '');
          }

          return {
            ...local,                          // local alanları önce yay
            id:           m.id || local.id,
            name:         m.name || local.name,
            pin:          String(m.pin || local.pin || ''),
            role:         m.rolle === 'admin' ? 'admin' : (local.role || 'employee'),
            hourlyRate:   Number(m.stundenlohn) || local.hourlyRate || 25,
            pensum:       m.pensum || local.pensum || 100,
            email:        m.email || local.email || '',
            phone:        m.telefon || local.phone || '',
            ahv:          m.ahv_nummer || local.ahv || '',
            iban:         m.iban || local.iban || '',
            bankName:     m.bank_name || local.bankName || 'UBS Switzerland AG',
            avatar:       avatarVal,
            contractType: m.lohnart === 'monatslohn'
                            ? 'Festanstellung 100%'
                            : `Stundenlohn (${m.pensum || 100}%)`,
            vacationTotal: Number(m.urlaubsanspruch_tage) || local.vacationTotal || 25,
            vacationUsed:  Number(m.urlaub_bezogen_tage)  || local.vacationUsed  || 0,
            joinedDate:   m.eintrittsdatum || local.joinedDate || '2024-01-01',
            status:       m.aktiv !== false ? 'active' : 'inactive',
            password:     local.password || '1234',
            department:   m.abteilung || local.department || 'kuche',
            jobTitle:     local.jobTitle || m.rolle || '',
            onboardingChecks: local.onboardingChecks || {}
          };
        });

        if (customAvatarsUpdated) {
          localStorage.setItem('ado_custom_avatars_v1', JSON.stringify(customAvatars));
        }

        localStorage.setItem('ado_employees_v1', JSON.stringify(mapped));

        // Aktif oturum açmış kullanıcı avatarını da güncelle
        try {
          const userRaw = localStorage.getItem('ado_current_user_v1');
          if (userRaw && userRaw !== '"guest"') {
            const u = JSON.parse(userRaw);
            const found = mapped.find(m => (m.id && u.id && m.id === u.id) || (m.pin && u.pin && String(m.pin) === String(u.pin)) || (m.email && u.email && m.email.toLowerCase() === u.email.toLowerCase()));
            if (found) {
              localStorage.setItem('ado_current_user_v1', JSON.stringify({ ...u, ...found, avatar: found.avatar }));
            }
          }
        } catch (_) {}
      }
    } catch (err) {
      console.warn('syncEmployees error:', err);
    }
  },


  pushEmployee: async (emp) => {
    if (!SyncService.isLive()) return;
    try {
      let avatarToPush = emp.avatar;
      if (!avatarToPush || !avatarToPush.startsWith('data:image')) {
        let customAvatars = {};
        try {
          const rawCustom = localStorage.getItem('ado_custom_avatars_v1');
          customAvatars = rawCustom ? JSON.parse(rawCustom) : {};
        } catch (_) {}
        const custom = customAvatars[emp.id] || customAvatars[String(emp.pin)] || customAvatars[emp.email];
        if (custom) avatarToPush = custom;
      }

      const payload = {
        name: emp.name,
        pin: String(emp.pin || ''),
        email: emp.email || '',
        rolle: emp.role === 'admin' ? 'admin' : 'mitarbeiter',
        stundenlohn: emp.hourlyRate || 25,
        pensum: emp.pensum || 100,
        telefon: emp.phone || null,
        ahv_nummer: emp.ahv || null,
        iban: emp.iban || null,
        bank_name: emp.bankName || null,
        avatar: avatarToPush || null,
        lohnart: emp.contractType?.includes('Fest') ? 'monatslohn' : 'stundenlohn',
        urlaubsanspruch_tage: emp.vacationTotal || 25,
        urlaub_bezogen_tage: emp.vacationUsed || 0,
        aktiv: emp.status !== 'inactive'
      };

      if (emp.email) {
        await supabase.from('mitarbeiter').update(payload).eq('email', emp.email);
      } else if (emp.pin) {
        await supabase.from('mitarbeiter').update(payload).eq('pin', emp.pin);
      }
    } catch (err) {
      console.warn('pushEmployee catch error:', err);
    }
  },

  // Tüm yerel işçileri Supabase'e gönder (ilk açılışta çalışır)
  pushAllEmployees: async () => {
    if (!SyncService.isLive()) return;
    try {
      const raw = localStorage.getItem('ado_employees_v1');
      const employees = raw ? JSON.parse(raw) : [];
      let customAvatars = {};
      try {
        const rawCustom = localStorage.getItem('ado_custom_avatars_v1');
        customAvatars = rawCustom ? JSON.parse(rawCustom) : {};
      } catch (_) {}
      for (const emp of employees) {
        if (emp.email || emp.pin) {
          const custom = customAvatars[emp.id] || customAvatars[String(emp.pin)] || customAvatars[emp.email] || emp.avatar;
          await SyncService.pushEmployee({ ...emp, avatar: custom });
        }
      }
    } catch (err) {
      console.warn('pushAllEmployees error:', err);
    }
  },

  // GİRİŞ-ÇIKIŞ (STEMPELUHR) SENKRONİZASYONU
  syncTimeLogs: async () => {
    if (!SyncService.isLive()) return;
    const { data, error } = await supabase.from('stempelungen').select('*').order('created_at', { ascending: false }).limit(200);
    if (error) throw error;
    if (data && data.length > 0) {
      const mapped = data.map(s => {
        const inTime = s.start_zeit ? new Date(s.start_zeit).toTimeString().substring(0, 5) : '08:00';
        const outTime = s.ende_zeit ? new Date(s.ende_zeit).toTimeString().substring(0, 5) : null;
        return {
          id: s.id,
          employeeId: s.ma_id,
          date: s.datum,
          clockIn: inTime,
          clockOut: outTime,
          breakMinutes: s.pausen_minuten || 0,
          status: s.status
        };
      });
      localStorage.setItem('ado_timelogs_v1', JSON.stringify(mapped));
    }
  },

  pushClockIn: async (log, empId) => {
    if (!SyncService.isLive()) return;
    try {
      const nowIso = new Date().toISOString();
      await supabase.from('stempelungen').insert({
        ma_id: empId,
        datum: log.date,
        start_zeit: nowIso,
        status: 'working',
        pausen_minuten: 0
      });
    } catch (err) {
      console.warn('pushClockIn error:', err);
    }
  },

  pushClockOut: async (empId, outTimeStr) => {
    if (!SyncService.isLive()) return;
    try {
      const today = new Date().toISOString().split('T')[0];
      const nowIso = new Date().toISOString();
      const { data } = await supabase.from('stempelungen')
        .select('id')
        .eq('ma_id', empId)
        .eq('datum', today)
        .is('ende_zeit', null)
        .order('created_at', { ascending: false })
        .limit(1);

      if (data && data.length > 0) {
        await supabase.from('stempelungen').update({
          ende_zeit: nowIso,
          status: 'completed'
        }).eq('id', data[0].id);
      }
    } catch (err) {
      console.warn('pushClockOut error:', err);
    }
  },

  // VARDİYALAR (SCHICHTEN)
  syncShifts: async () => {
    if (!SyncService.isLive()) return;
    const { data, error } = await supabase.from('schichten').select('*');
    if (error) throw error;
    if (data && data.length > 0) {
      const mapped = data.map(s => ({
        id: s.id,
        employeeId: s.ma_id,
        date: s.datum,
        shiftType: s.typ,
        startTime: s.von,
        endTime: s.bis,
        status: s.status,
        notes: s.notiz,
        department: s.abteilung || s.department || null
      }));
      localStorage.setItem('ado_shifts_v1', JSON.stringify(mapped));
    }
  },

  pushShift: async (shift) => {
    if (!SyncService.isLive()) return;
    try {
      await supabase.from('schichten').upsert({
        ma_id: shift.employeeId,
        datum: shift.date,
        typ: shift.shiftType || 'Frühschicht',
        von: shift.startTime || '06:00',
        bis: shift.endTime || '14:30',
        status: shift.status || 'geplant',
        notiz: shift.notes || null,
        abteilung: shift.department || null
      }, { onConflict: 'ma_id,datum,von' });
    } catch (err) {
      console.warn('pushShift error:', err);
    }
  },

  // FATURALAR (RECHNUNGEN)
  syncInvoices: async () => {
    if (!SyncService.isLive()) return;
    const { data, error } = await supabase.from('rechnungen').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    if (data && data.length > 0) {
      const mapped = data.map(r => ({
        id: r.id,
        supplierName: r.lieferant_name,
        invoiceNumber: r.rechnungsnummer,
        date: r.rechnungsdatum,
        dueDate: r.faelligkeitsdatum,
        totalAmount: Number(r.betrag) || 0,
        vatRate: Number(r.mwst_satz) || 2.6,
        vatAmount: Number(r.mwst_betrag) || 0,
        status: r.status,
        paidDate: r.bezahlt_am,
        paymentAccount: r.bezahlt_von_konto || r.paymentAccount || null,
        paymentRef: r.zahlungs_referenz || r.paymentRef || null,
        scanUrl: r.scan_datei_url,
        category: r.kategorie
      }));
      localStorage.setItem('ado_invoices_v1', JSON.stringify(mapped));
    }
  },

  pushInvoice: async (inv) => {
    if (!SyncService.isLive()) return;
    try {
      await supabase.from('rechnungen').insert({
        lieferant_name: inv.supplierName || 'Unbekannt',
        rechnungsnummer: inv.invoiceNumber || `RE-${Date.now()}`,
        rechnungsdatum: inv.date || new Date().toISOString().split('T')[0],
        faelligkeitsdatum: inv.dueDate || new Date().toISOString().split('T')[0],
        betrag: inv.totalAmount || 0,
        mwst_satz: inv.vatRate || 2.6,
        mwst_betrag: inv.vatAmount || 0,
        status: inv.status || 'offen',
        kategorie: inv.category || 'Warenaufwand',
        scan_datei_url: inv.scanUrl || null,
        bezahlt_am: inv.paidDate || null,
        bezahlt_von_konto: inv.paymentAccount || null,
        zahlungs_referenz: inv.paymentRef || null
      });
    } catch (err) {
      console.warn('pushInvoice error:', err);
    }
  },

  updateInvoiceStatusInDb: async (invId, status, paidDate, paymentAccount = null, paymentRef = null) => {
    if (!SyncService.isLive()) return;
    try {
      await supabase.from('rechnungen').update({
        status,
        bezahlt_am: paidDate || null,
        bezahlt_von_konto: paymentAccount || null,
        zahlungs_referenz: paymentRef || null
      }).eq('id', invId);
    } catch (err) {
      console.warn('updateInvoiceStatus error:', err);
    }
  },

  // TEDARİKÇİLER (LIEFERANTEN)
  syncSuppliers: async () => {
    if (!SyncService.isLive()) return;
    try {
      const [suppliersRes, catalogRes] = await Promise.all([
        supabase.from('lieferanten').select('*').eq('aktiv', true).order('created_at', { ascending: true }),
        supabase.from('lieferanten_katalog').select('*').order('reihenfolge', { ascending: true })
      ]);

      if (suppliersRes.error) throw suppliersRes.error;
      if (catalogRes.error) console.error('Supabase lieferanten_katalog Error:', catalogRes.error);
      const suppliersData = suppliersRes.data || [];
      const catalogData = catalogRes.data || [];

      let localList = [];
      try {
        const raw = localStorage.getItem('ado_suppliers_v1');
        localList = raw ? JSON.parse(raw) : [];
      } catch (_) {}

      const parseDeliveryDays = (val) => {
        if (Array.isArray(val)) return val;
        if (typeof val === 'string') {
          const cleaned = val.replace(/[\{\}\"\\`]/g, '').trim();
          if (!cleaned) return [];
          return cleaned.split(',').map(s => s.trim()).filter(Boolean);
        }
        return [];
      };

      const normalizeStr = (str) => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');

      const mapped = (suppliersData || []).map(l => {
        const matchingCatalog = catalogData
          .filter(k => k.lieferant_slug === l.slug)
          .sort((a, b) => (a.reihenfolge || 0) - (b.reihenfolge || 0))
          .map(k => ({ id: k.id, name: k.name, price: Number(k.preis), unit: k.einheit }));

        const lNorm = normalizeStr(l.name);
        const local = localList.find(s => s.id === l.slug || (lNorm && normalizeStr(s.name).includes(lNorm))) || {};
        const seed = SEED_SUPPLIERS.find(s => s.id === l.slug || (lNorm && (normalizeStr(s.name).includes(lNorm) || lNorm.includes(normalizeStr(s.name))))) || {};

        const whatsappVal = (l.whatsapp !== null && l.whatsapp !== undefined)
          ? l.whatsapp
          : (local.whatsapp || seed.whatsapp || '');

        const phoneVal = (l.telefon !== null && l.telefon !== undefined)
          ? l.telefon
          : (local.phone || seed.phone || '');

        const emailVal = (l.email !== null && l.email !== undefined)
          ? l.email
          : (local.email || seed.email || '');

        const addressVal = (l.adresse !== null && l.adresse !== undefined)
          ? l.adresse
          : (local.address || seed.address || '');

        const contactVal = (l.kontakt_person !== null && l.kontakt_person !== undefined)
          ? l.kontakt_person
          : (local.contactPerson || seed.contactPerson || '');

        const mergedSupplier = {
          id:            l.slug || String(l.id),
          name:          l.name,
          category:      l.kategorie || local.category || seed.category || '',
          contactPerson: contactVal,
          phone:         phoneVal,
          whatsapp:      whatsappVal,
          email:         emailVal,
          address:       addressVal,
          notes:         l.notizen || local.notes || seed.notes || (l.bestellfrist ? `Bestellfrist: ${l.bestellfrist}` : ''),
          rating:        Number(l.rating) || local.rating || seed.rating || 4.5,
          deliveryDays:  (parseDeliveryDays(l.liefertage).length > 0 ? parseDeliveryDays(l.liefertage) : (local.deliveryDays || seed.deliveryDays || [])),
          catalog:       matchingCatalog.length > 0 ? matchingCatalog : (local.catalog || seed.catalog || [])
        };

        if (l.whatsapp === null && whatsappVal) {
          SyncService.pushSupplier(mergedSupplier);
        }

        return mergedSupplier;
      });

      // Tekrarlayan firmaları temizle (Örn: Pistor AG vs Pistor AG Bäckerei...)
      const deduplicated = [];
      const seenKeys = new Map();

      for (const sup of mapped) {
        if (!sup.name) continue;
        const norm = normalizeStr(sup.name);
        
        let matchKey = null;
        for (const k of seenKeys.keys()) {
          if (k === norm || (k.length > 4 && norm.length > 4 && (k.includes(norm) || norm.includes(k)))) {
            matchKey = k;
            break;
          }
        }

        if (matchKey) {
          const existing = seenKeys.get(matchKey);
          if ((!existing.catalog || existing.catalog.length === 0) && sup.catalog && sup.catalog.length > 0) {
            const idx = deduplicated.findIndex(s => s.id === existing.id);
            if (idx >= 0) deduplicated[idx] = sup;
            seenKeys.set(matchKey, sup);
          }
        } else {
          seenKeys.set(norm, sup);
          deduplicated.push(sup);
        }
      }

      if (deduplicated.length > 0) {
        localStorage.setItem('ado_suppliers_v1', JSON.stringify(deduplicated));
        window.dispatchEvent(new Event('ado_db_update'));
      }
    } catch (err) {
      console.warn('syncSuppliers error:', err);
    }
  },

  pushSupplier: async (sup) => {
    if (!SyncService.isLive() || !sup.name) return;
    try {
      const slug = sup.id || `sup-${Date.now()}`;
      const { error } = await supabase.from('lieferanten').upsert({
        slug: slug,
        name: sup.name,
        kategorie: sup.category || 'Lebensmittel',
        kontakt_person: sup.contactPerson || null,
        telefon: sup.phone && sup.phone.trim() ? sup.phone.trim() : null,
        whatsapp: sup.whatsapp && sup.whatsapp.trim() ? sup.whatsapp.trim() : null,
        email: sup.email && sup.email.trim() ? sup.email.trim() : null,
        adresse: sup.address && sup.address.trim() ? sup.address.trim() : null,
        liefertage: Array.isArray(sup.deliveryDays) ? sup.deliveryDays : [],
        rating: Number(sup.rating) || 4.5,
        notizen: sup.notes || null,
        aktiv: true
      }, { onConflict: 'slug' });
      if (error) console.warn('pushSupplier error:', error);

      if (Array.isArray(sup.catalog)) {
        for (let i = 0; i < sup.catalog.length; i++) {
          const catItem = sup.catalog[i];
          await supabase.from('lieferanten_katalog').upsert({
            id: catItem.id || `item-${slug}-${i}`,
            lieferant_slug: slug,
            name: catItem.name,
            preis: Number(catItem.price) || 0,
            einheit: catItem.unit || 'Stück',
            reihenfolge: i
          }, { onConflict: 'id' });
        }
      }
    } catch (err) {
      console.warn('pushSupplier error:', err);
    }
  },

  deleteSupplierInDb: async (supplierId) => {
    if (!SyncService.isLive()) return;
    try {
      await supabase.from('lieferanten').update({ aktiv: false }).eq('slug', supplierId);
    } catch (err) {
      console.warn('deleteSupplierInDb error:', err);
    }
  },

  // DUYURU PANOSU (BULLETINS)
  syncBulletins: async () => {
    if (!SyncService.isLive()) return;
    const { data, error } = await supabase.from('bulletins').select('*').order('created_at', { ascending: false });
    if (error) {
      console.warn('syncBulletins error:', error);
      return;
    }
    if (data) {
      const mapped = data.map(b => ({
        id: b.id,
        title: b.titel,
        content: b.text,
        category: b.kategorie || (b.dringend ? 'urgent' : 'info'),
        priority: b.dringend ? 'urgent' : 'normal',
        author: b.ersteller,
        date: b.datum,
        views: b.views || 1
      }));
      localStorage.setItem('ado_bulletins_v1', JSON.stringify(mapped));
      window.dispatchEvent(new Event('ado_db_update'));
    }
  },

  pushBulletin: async (bul) => {
    if (!SyncService.isLive()) return;
    try {
      await supabase.from('bulletins').insert({
        titel: bul.title,
        text: bul.content,
        kategorie: bul.category || 'info',
        dringend: bul.category === 'urgent' || bul.priority === 'urgent',
        ersteller: bul.author || 'Geschäftsleitung',
        datum: bul.date || new Date().toISOString().split('T')[0]
      });
    } catch (err) {
      console.warn('pushBulletin error:', err);
    }
  },

  // SOĞUTUCU SICAKLIK TAKİBİ (HACCP)
  syncTemperatures: async () => {
    if (!SyncService.isLive()) return;
    const { data, error } = await supabase.from('temperatur_logs').select('*');
    if (error) throw error;
    if (data && data.length > 0) {
      const mapped = data.map(t => ({
        id: t.id,
        location: t.location,
        minTemp: Number(t.min_temp),
        maxTemp: Number(t.max_temp),
        currentTemp: Number(t.current_temp),
        checkedBy: t.checked_by,
        checkedAt: t.checked_at,
        date: t.datum,
        status: t.status
      }));
      localStorage.setItem('ado_temperature_logs_v1', JSON.stringify(mapped));
    }
  },

  updateTemperatureInDb: async (id, temp, checkedBy) => {
    if (!SyncService.isLive()) return;
    try {
      await supabase.from('temperatur_logs').update({
        current_temp: Number(temp),
        checked_by: checkedBy,
        checked_at: new Date().toTimeString().substring(0, 5),
        datum: new Date().toISOString().split('T')[0]
      }).eq('id', id);
    } catch (err) {
      console.warn('updateTemperatureInDb error:', err);
    }
  },

  // HASTALIK BİLDİRİMLERİ (KRANKMELDUNGEN)
  syncSickLeaves: async () => {
    if (!SyncService.isLive()) return;
    const { data, error } = await supabase.from('krankmeldungen').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    if (data && data.length > 0) {
      const mapped = data.map(k => ({
        id: k.id,
        employeeId: k.ma_id,
        startDate: k.start_datum,
        endDate: k.end_datum,
        reason: k.grund,
        hasDoctorNote: k.arztzeugnis,
        documentUrl: k.attest_datei_url,
        status: k.status,
        createdAt: k.created_at
      }));
      localStorage.setItem('ado_sick_reports_v1', JSON.stringify(mapped));
    }
  },

  pushSickLeave: async (report) => {
    if (!SyncService.isLive()) return;
    try {
      await supabase.from('krankmeldungen').insert({
        ma_id: report.employeeId,
        start_datum: report.startDate,
        end_datum: report.endDate,
        grund: report.reason || 'Krank',
        arztzeugnis: report.hasDoctorNote === true,
        attest_datei_url: report.documentUrl || null,
        status: report.status || 'gemeldet'
      });
    } catch (err) {
      console.warn('pushSickLeave error:', err);
    }
  }
};
