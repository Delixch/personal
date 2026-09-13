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
    const { data, error } = await supabase.from('mitarbeiter').select('*');
    if (error) throw error;
    if (data && data.length > 0) {
      // Mevcut local veriyi oku — password, department, jobTitle gibi local alanları koru
      let localList = [];
      try {
        const raw = localStorage.getItem('ado_employees_v1');
        localList = raw ? JSON.parse(raw) : [];
      } catch (_) {}

      const mapped = data.map(m => {
        // Aynı PIN veya ID'li local kaydı bul
        const local = localList.find(e => e.pin === m.pin || e.id === m.id) || {};
        return {
          ...local,                          // local alanları önce yay (password, department, jobTitle vb.)
          id:           m.id || local.id,
          name:         m.name,
          pin:          m.pin,
          role:         m.rolle || local.role || 'employee',
          hourlyRate:   Number(m.stundenlohn) || local.hourlyRate || 25,
          pensum:       m.pensum || local.pensum || 100,
          email:        m.email || local.email || '',
          phone:        m.telefon || local.phone || '',
          ahv:          m.ahv_nummer || local.ahv || '',
          iban:         m.iban || local.iban || '',
          bankName:     m.bank_name || local.bankName || 'UBS Switzerland AG',
          avatar:       m.avatar || local.avatar || '',
          contractType: m.lohnart === 'monatslohn'
                          ? 'Festanstellung 100%'
                          : `Stundenlohn (${m.pensum || 100}%)`,
          vacationTotal: Number(m.urlaubsanspruch_tage) || local.vacationTotal || 25,
          vacationUsed:  Number(m.urlaub_bezogen_tage)  || local.vacationUsed  || 0,
          joinedDate:   m.eintrittsdatum || local.joinedDate || '2024-01-01',
          status:       m.aktiv ? 'active' : 'inactive',
          // Local-only alanlar — Supabase'den gelmez, local'den korunur:
          password:     local.password || '1234',
          department:   local.department || 'staff',
          jobTitle:     local.jobTitle || m.rolle || '',
          onboardingChecks: local.onboardingChecks || {}
        };
      });
      localStorage.setItem('ado_employees_v1', JSON.stringify(mapped));
    }
  },


  pushEmployee: async (emp) => {
    if (!SyncService.isLive() || !emp.pin || !emp.email) return;
    try {
      await supabase.from('mitarbeiter').upsert({
        name: emp.name,
        pin: emp.pin,
        email: emp.email,
        password: emp.password || null,
        rolle: emp.role === 'admin' ? 'admin' : 'mitarbeiter',
        stundenlohn: emp.hourlyRate || 25,
        pensum: emp.pensum || 100,
        telefon: emp.phone || null,
        ahv_nummer: emp.ahv || null,
        iban: emp.iban || null,
        bank_name: emp.bankName || null,
        avatar: emp.avatar || null,
        lohnart: emp.contractType?.includes('Fest') ? 'monatslohn' : 'stundenlohn',
        urlaubsanspruch_tage: emp.vacationTotal || 25,
        urlaub_bezogen_tage: emp.vacationUsed || 0,
        aktiv: emp.status !== 'inactive'
      }, { onConflict: 'email' });
    } catch (err) {
      console.warn('pushEmployee error:', err);
    }
  },

  // Tüm yerel işçileri Supabase'e gönder (ilk açılışta çalışır)
  pushAllEmployees: async () => {
    if (!SyncService.isLive()) return;
    try {
      const raw = localStorage.getItem('ado_employees_v1');
      const employees = raw ? JSON.parse(raw) : [];
      for (const emp of employees) {
        if (emp.email) await SyncService.pushEmployee(emp);
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
        notes: s.notiz
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
        notiz: shift.notes || null
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
        scan_datei_url: inv.scanUrl || null
      });
    } catch (err) {
      console.warn('pushInvoice error:', err);
    }
  },

  updateInvoiceStatusInDb: async (invId, status, paidDate) => {
    if (!SyncService.isLive()) return;
    try {
      await supabase.from('rechnungen').update({
        status,
        bezahlt_am: paidDate || null
      }).eq('id', invId);
    } catch (err) {
      console.warn('updateInvoiceStatus error:', err);
    }
  },

  // TEDARİKÇİLER (LIEFERANTEN)
  syncSuppliers: async () => {
    if (!SyncService.isLive()) return;
    const { data, error } = await supabase
      .from('lieferanten')
      .select('*, lieferanten_katalog(*)')
      .eq('aktiv', true)
      .order('created_at', { ascending: true });
    if (error) throw error;
    if (data && data.length > 0) {
      // Supabase'deki eski boş/legacy kayıtları süz (slug'ı veya adresi veya kataloğu olanları al)
      const validData = data.filter(l => Boolean(l.slug) || Boolean(l.adresse) || (l.lieferanten_katalog && l.lieferanten_katalog.length > 0));

      const parseDeliveryDays = (val) => {
        if (Array.isArray(val)) return val;
        if (typeof val === 'string') {
          const cleaned = val.replace(/[\{\}\"\\`]/g, '').trim();
          if (!cleaned) return [];
          return cleaned.split(',').map(s => s.trim()).filter(Boolean);
        }
        return [];
      };

      const mapped = validData.map(l => {
        const seedSupplier = SEED_SUPPLIERS.find(s => s.id === l.slug || s.name?.toLowerCase() === l.name?.toLowerCase());
        const seedCatalog = seedSupplier?.catalog || [];

        const supabaseCatalog = (l.lieferanten_katalog || [])
                         .sort((a, b) => a.reihenfolge - b.reihenfolge)
                         .map(k => ({ id: k.id, name: k.name, price: Number(k.preis), unit: k.einheit }));

        const finalCatalog = supabaseCatalog.length > 0 ? supabaseCatalog : seedCatalog;

        return {
          id:            l.slug || String(l.id),
          name:          l.name,
          category:      l.kategorie || '',
          contactPerson: l.kontakt_person || '',
          phone:         l.telefon || '',
          whatsapp:      l.whatsapp || '',
          email:         l.email || '',
          address:       l.adresse || '',
          notes:         l.notizen || (l.bestellfrist ? `Bestellfrist: ${l.bestellfrist}` : ''),
          rating:        Number(l.rating) || 4.5,
          deliveryDays:  parseDeliveryDays(l.liefertage),
          catalog:       finalCatalog
        };
      });
      localStorage.setItem('ado_suppliers_v1', JSON.stringify(mapped));
    }
  },

  // DUYURU PANOSU (BULLETINS)
  syncBulletins: async () => {
    if (!SyncService.isLive()) return;
    const { data, error } = await supabase.from('bulletins').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    if (data && data.length > 0) {
      const mapped = data.map(b => ({
        id: b.id,
        title: b.titel,
        content: b.text,
        priority: b.dringend ? 'urgent' : 'normal',
        author: b.ersteller,
        date: b.datum,
        views: b.views || 1
      }));
      localStorage.setItem('ado_bulletins_v1', JSON.stringify(mapped));
    }
  },

  pushBulletin: async (bul) => {
    if (!SyncService.isLive()) return;
    try {
      await supabase.from('bulletins').insert({
        titel: bul.title,
        text: bul.content,
        dringend: bul.priority === 'urgent',
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
