-- ============================================================================
-- ADO FIRMA ENTERPRISE PLATFORM — MASTER SUPABASE / POSTGRESQL SCHEMA
-- ============================================================================
-- Sürüm: 1.0 (Prod-Ready)
-- İsviçre L-GAV Gastronomi Mevzuatı & Çoklu Modül Entegrasyonu
-- 
-- Bu dosya Supabase Dashboard -> SQL Editor içerisine yapıştırılıp
-- doğrudan "RUN" edilerek tüm veritabanı altyapısı tek seferde kurulur.
-- Sıfır eski veri içerir; temiz, izole ve güvenlidir.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ----------------------------------------------------------------------------
-- 1. FİRMA PARAMETRELERİ & İSVİÇRE L-GAV YASAL ORANLARI
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS firmenparameter (
  id BOOLEAN PRIMARY KEY DEFAULT TRUE CHECK (id),
  firmenname TEXT NOT NULL DEFAULT 'ADO Firma Gastronomie',
  adresse TEXT NOT NULL DEFAULT 'Bahnhofstrasse 10, 8001 Zürich',
  kanton TEXT NOT NULL DEFAULT 'ZH',
  admin_pin TEXT NOT NULL DEFAULT '9999',
  
  -- İsviçre L-GAV Yasal Kesinti Yüzdeleri (Standardwerte)
  uvg_satz NUMERIC(6,4) NOT NULL DEFAULT 0.8514,     -- Berufsunfall (BU)
  bvg_satz NUMERIC(6,4) NOT NULL DEFAULT 7.0000,     -- Pensionskasse (BVG)
  ktg_satz NUMERIC(6,4) NOT NULL DEFAULT 0.7350,     -- Krankentaggeld (KTG)
  fak_satz NUMERIC(6,4) NOT NULL DEFAULT 0.6100,     -- Familienausgleichskasse (FAK)
  ahv_satz NUMERIC(6,4) NOT NULL DEFAULT 5.3000,     -- AHV / IV / EO
  alv1_satz NUMERIC(6,4) NOT NULL DEFAULT 1.1000,    -- Arbeitslosenversicherung (ALV)
  nbuv_satz NUMERIC(6,4) NOT NULL DEFAULT 0.8530,    -- Nichtberufsunfall (NBU)
  dreizehnter_anteil NUMERIC(6,4) NOT NULL DEFAULT 8.3300, -- 13. Monatslohn (1/12)
  ferien_satz NUMERIC(6,4) NOT NULL DEFAULT 10.6500, -- Tatil payı (25 gün = %10.65)
  
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Varsayılan parametre satırını oluştur
INSERT INTO firmenparameter (id) VALUES (TRUE) ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 2. PERSONEL / STAMMDATEN (MITARBEITER)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mitarbeiter (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pers_nr INT UNIQUE,
  name TEXT NOT NULL,
  vorname TEXT,
  nachname TEXT,
  email TEXT UNIQUE,
  password TEXT,
  pin TEXT NOT NULL UNIQUE,                          -- Kiosk & Schnell-Login PIN (örn. 1001)
  rolle TEXT NOT NULL DEFAULT 'mitarbeiter' CHECK (rolle IN ('mitarbeiter', 'schichtleiter', 'admin', 'geschaeftsfuehrer')),
  
  -- Sözleşme & Ücret (L-GAV)
  pensum INT NOT NULL DEFAULT 100,                   -- İstihdam oranı (%)
  lohnart TEXT NOT NULL DEFAULT 'stundenlohn' CHECK (lohnart IN ('stundenlohn', 'monatslohn')),
  stundenlohn NUMERIC(10,2) NOT NULL DEFAULT 24.50,
  monatslohn NUMERIC(10,2) DEFAULT 0,
  soll_stunden_woche NUMERIC(5,2) NOT NULL DEFAULT 42.00,
  
  -- İsviçre Resmi Bilgileri
  ahv_nummer TEXT,                                   -- 756.xxxx.xxxx.xx
  iban TEXT,                                         -- CHxx xxxx xxxx xxxx x
  bank_name TEXT,
  geburtstag DATE,
  eintrittsdatum DATE DEFAULT CURRENT_DATE,
  austrittsdatum DATE,
  
  -- İzin & Tatil Hakları
  urlaubsanspruch_tage NUMERIC(5,2) NOT NULL DEFAULT 25.00,
  urlaub_bezogen_tage NUMERIC(5,2) NOT NULL DEFAULT 0.00,
  
  -- Sistem & Profil
  avatar TEXT,
  telefon TEXT,
  notiz TEXT,
  aktiv BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mitarbeiter_pin ON mitarbeiter(pin);
CREATE INDEX IF NOT EXISTS idx_mitarbeiter_aktiv ON mitarbeiter(aktiv);

-- ----------------------------------------------------------------------------
-- 3. DİJİTAL STEMPELUHR (ZEITERFASSUNG / GİRİŞ-ÇIKIŞ)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS stempelungen (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ma_id UUID NOT NULL REFERENCES mitarbeiter(id) ON DELETE CASCADE,
  datum DATE NOT NULL DEFAULT CURRENT_DATE,
  start_zeit TIMESTAMPTZ NOT NULL,
  ende_zeit TIMESTAMPTZ,
  pausen_minuten INT NOT NULL DEFAULT 0,
  netto_arbeitszeit_minuten INT GENERATED ALWAYS AS (
    CASE 
      WHEN ende_zeit IS NOT NULL 
      THEN GREATEST(0, EXTRACT(EPOCH FROM (ende_zeit - start_zeit))/60 - pausen_minuten)::INT
      ELSE NULL 
    END
  ) STORED,
  standort TEXT DEFAULT 'Hauptfiliale',
  status TEXT NOT NULL DEFAULT 'working' CHECK (status IN ('working', 'break', 'completed')),
  notiz TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stempelungen_ma_datum ON stempelungen(ma_id, datum);
CREATE INDEX IF NOT EXISTS idx_stempelungen_start ON stempelungen(start_zeit);

-- ----------------------------------------------------------------------------
-- 4. VARDİYA PLANI (SCHICHTEN)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS schichten (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ma_id UUID NOT NULL REFERENCES mitarbeiter(id) ON DELETE CASCADE,
  datum DATE NOT NULL,
  typ TEXT NOT NULL DEFAULT 'Frühschicht',          -- Früh, Spät, Teildienst, Frei, Ferien, Krank
  von TEXT NOT NULL,                                 -- '06:00'
  bis TEXT NOT NULL,                                 -- '14:30'
  standort TEXT DEFAULT 'Hauptfiliale',
  status TEXT NOT NULL DEFAULT 'geplant' CHECK (status IN ('geplant', 'bestaetigt', 'abgesagt', 'sick')),
  notiz TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(ma_id, datum, von)
);

CREATE INDEX IF NOT EXISTS idx_schichten_datum ON schichten(datum);
CREATE INDEX IF NOT EXISTS idx_schichten_ma_id ON schichten(ma_id);

CREATE TABLE IF NOT EXISTS schichtplan_wochen (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  woche_montag DATE NOT NULL UNIQUE,
  veroeffentlicht BOOLEAN NOT NULL DEFAULT FALSE,
  freigegeben_von UUID REFERENCES mitarbeiter(id),
  freigegeben_am TIMESTAMPTZ
);

-- ----------------------------------------------------------------------------
-- 5. HASTALIK RAPORLARI & İZİN TALEPLERİ (SICK LEAVE & VACATION)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS krankmeldungen (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ma_id UUID NOT NULL REFERENCES mitarbeiter(id) ON DELETE CASCADE,
  start_datum DATE NOT NULL,
  end_datum DATE NOT NULL,
  grund TEXT,
  arztzeugnis BOOLEAN NOT NULL DEFAULT FALSE,        -- Rapor var mı?
  attest_datei_url TEXT,                             -- Rapor PDF/Fotoğraf linki
  status TEXT NOT NULL DEFAULT 'gemeldet' CHECK (status IN ('gemeldet', 'in_pruefung', 'genehmigt', 'abgelehnt')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS abwesenheiten (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ma_id UUID NOT NULL REFERENCES mitarbeiter(id) ON DELETE CASCADE,
  typ TEXT NOT NULL CHECK (typ IN ('ferien', 'frei', 'militaer', 'weiterbildung', 'unbezahlt')),
  start_datum DATE NOT NULL,
  end_datum DATE NOT NULL,
  tage NUMERIC(4,1) NOT NULL DEFAULT 1.0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  notiz TEXT,
  genehmigt_von UUID REFERENCES mitarbeiter(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 6. AYLIK BORDRO & MAAŞ KİLİTLERİ (LOHNABRECHNUNGEN & SALDO)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS lohnabrechnungen (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mitarbeiter_id UUID NOT NULL REFERENCES mitarbeiter(id) ON DELETE CASCADE,
  jahr INT NOT NULL,
  monat INT NOT NULL CHECK (monat BETWEEN 1 AND 12),
  periode_text TEXT GENERATED ALWAYS AS (jahr || '-' || LPAD(monat::TEXT, 2, '0')) STORED,
  
  -- Saat İcmali (L-GAV)
  soll_stunden NUMERIC(7,2) NOT NULL DEFAULT 0.00,
  ist_stunden NUMERIC(7,2) NOT NULL DEFAULT 0.00,
  ueberstunden_saldo NUMERIC(7,2) NOT NULL DEFAULT 0.00,
  
  -- Parasal Değerler (CHF)
  grundlohn_betrag NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  bruttolohn NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  abzuege_total NUMERIC(10,2) NOT NULL DEFAULT 0.00,  -- AHV + ALV + BVG + UVG + KTG
  nettolohn NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  auszahlungsbetrag NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  
  status TEXT NOT NULL DEFAULT 'entwurf' CHECK (status IN ('entwurf', 'freigegeben', 'ausbezahlt')),
  pdf_url TEXT,
  notiz TEXT,
  abgeschlossen_am TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (mitarbeiter_id, jahr, monat)
);

CREATE INDEX IF NOT EXISTS idx_lohnabrechnungen_periode ON lohnabrechnungen(jahr, monat);

CREATE TABLE IF NOT EXISTS lohnabrechnung_positionen (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  abrechnung_id UUID NOT NULL REFERENCES lohnabrechnungen(id) ON DELETE CASCADE,
  code INT NOT NULL,                                 -- 1000: Grundlohn, 6014: UVG, 9900: AHV, vb.
  bezeichnung TEXT NOT NULL,
  menge NUMERIC(10,2),                               -- Çalışılan saat veya adet
  ansatz NUMERIC(10,2),                              -- Saatlik ücret veya birim fiyat
  anteil_prozent NUMERIC(8,4),                       -- Kesinti yüzdesi (örn: 5.3000)
  total NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  reihenfolge INT NOT NULL DEFAULT 0
);

-- Yıllık Devreden İzin ve Saat Bakiyesi
CREATE TABLE IF NOT EXISTS urlaub_zeit_saldo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mitarbeiter_id UUID NOT NULL REFERENCES mitarbeiter(id) ON DELETE CASCADE,
  jahr INT NOT NULL,
  urlaub_vortrag NUMERIC(6,2) DEFAULT 0.00,          -- Geçen yıldan devreden tatil
  urlaub_bezogen NUMERIC(6,2) DEFAULT 0.00,
  zeit_vortrag NUMERIC(8,2) DEFAULT 0.00,            -- Geçen yıldan devreden fazla mesai saati
  zeit_saldo NUMERIC(8,2) DEFAULT 0.00,              -- Güncel fazla mesai bakiyesi
  UNIQUE (mitarbeiter_id, jahr)
);

-- ----------------------------------------------------------------------------
-- 7. TEDARİKÇİLER & FATURALAR (LIEFERANTEN & KREDITOREN)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS lieferanten (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  kategorie TEXT NOT NULL DEFAULT 'Lebensmittel',     -- Bäckerei, Fleisch, Getränke, Verpackung
  kontakt_person TEXT,
  telefon TEXT,
  email TEXT,
  adresse TEXT,
  iban TEXT,
  kundennummer TEXT,
  liefertage TEXT,                                   -- 'Mo, Di, Do, Fr'
  bestellfrist TEXT,                                 -- 'Bis 16:00 Uhr'
  min_bestellwert NUMERIC(10,2) DEFAULT 0.00,
  aktiv BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rechnungen (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lieferant_name TEXT NOT NULL,
  rechnungsnummer TEXT NOT NULL,
  rechnungsdatum DATE NOT NULL DEFAULT CURRENT_DATE,
  faelligkeitsdatum DATE NOT NULL,
  betrag NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  waehrung TEXT NOT NULL DEFAULT 'CHF',
  mwst_satz NUMERIC(5,2) DEFAULT 2.60,               -- Gıda: %2.6, Standart: %8.1
  mwst_betrag NUMERIC(10,2) DEFAULT 0.00,
  status TEXT NOT NULL DEFAULT 'offen' CHECK (status IN ('offen', 'bezahlt', 'in_pruefung', 'storniert')),
  bezahlt_am DATE,
  scan_datei_url TEXT,                               -- OCR ile yüklenen fatura görseli
  kategorie TEXT DEFAULT 'Warenaufwand',
  notiz TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rechnungen_status ON rechnungen(status);
CREATE INDEX IF NOT EXISTS idx_rechnungen_faelligkeit ON rechnungen(faelligkeitsdatum);

CREATE TABLE IF NOT EXISTS bestellungen (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lieferant_name TEXT NOT NULL,
  bestelldatum DATE NOT NULL DEFAULT CURRENT_DATE,
  lieferdatum DATE,
  status TEXT NOT NULL DEFAULT 'bestellt' CHECK (status IN ('entwurf', 'bestellt', 'geliefert', 'storniert')),
  total_betrag NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  positionen JSONB NOT NULL DEFAULT '[]'::JSONB,
  notizen TEXT,
  erstellt_von UUID REFERENCES mitarbeiter(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 8. HACCP HİJYEN & SOĞUTUCU SICAKLIK KONTROLÜ
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS haccp_checklisten (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titel TEXT NOT NULL,
  bereich TEXT NOT NULL,                             -- 'Küche', 'Verkauf', 'Lager'
  intervall TEXT NOT NULL DEFAULT 'taeglich',        -- taeglich, woechentlich, monatlich
  done BOOLEAN NOT NULL DEFAULT FALSE,
  datum DATE NOT NULL DEFAULT CURRENT_DATE,
  erledigt_am TIMESTAMPTZ,
  erledigt_von TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS temperatur_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location TEXT NOT NULL,                            -- 'Kühlhaus 1', 'Tiefkühler'
  min_temp NUMERIC(4,1) NOT NULL,
  max_temp NUMERIC(4,1) NOT NULL,
  current_temp NUMERIC(4,1) NOT NULL,
  checked_by TEXT,
  checked_at TEXT,                                   -- '14:30'
  datum DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'ok' CHECK (status IN ('ok', 'warning', 'critical')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 9. DİJİTAL DUYURU PANOSU (COMPANY BULLETIN BOARD)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bulletins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titel TEXT NOT NULL,
  text TEXT NOT NULL,
  dringend BOOLEAN NOT NULL DEFAULT FALSE,
  ersteller TEXT NOT NULL DEFAULT 'Geschäftsleitung',
  datum DATE NOT NULL DEFAULT CURRENT_DATE,
  gueltig_bis DATE,
  views INT NOT NULL DEFAULT 1,
  aktiv BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 10. GÜVENLİ BAŞLANGIÇ VERİLERİ (SEED DATA — SIFIR ESKİ VERİ)
-- ----------------------------------------------------------------------------

-- Varsayılan Admin Kullanıcısı (PIN: 9999)
INSERT INTO mitarbeiter (
  pers_nr, name, vorname, nachname, email, pin, rolle, pensum, 
  lohnart, stundenlohn, soll_stunden_woche, ahv_nummer, iban, aktiv
) VALUES (
  101, 'Geschäftsleitung', 'Admin', 'Ado', 'admin@ado-firma.ch', '9999', 'admin', 100,
  'monatslohn', 38.50, 42.00, '756.9999.9999.99', 'CH99 0000 0000 0000 0000 0', TRUE
) ON CONFLICT (pin) DO NOTHING;

-- İsviçre Gastronomi Standart Tedarikçileri
INSERT INTO lieferanten (name, kategorie, bestellfrist, min_bestellwert, liefertage) VALUES
('Transgourmet / Prodega', 'Grosshandel & Frischware', 'Bis 17:00 Uhr', 350.00, 'Mo, Di, Mi, Do, Fr, Sa'),
('Pistor AG', 'Bäckerei & Gastro-Bedarf', 'Bis 15:30 Uhr', 400.00, 'Di, Do, Sa'),
('Metzgerei Keller & Söhne', 'Frischfleisch & Charcuterie', 'Bis 18:00 Uhr', 150.00, 'Mo, Di, Mi, Do, Fr, Sa'),
('Hiestand Schweiz AG', 'Tiefkühlbackwaren', 'Bis 16:00 Uhr', 250.00, 'Mo, Mi, Fr'),
('Coca-Cola HBC Schweiz', 'Getränke & Sirup', 'Bis 12:00 Uhr', 200.00, 'Di, Fr')
ON CONFLICT DO NOTHING;

-- Varsayılan HACCP Soğutucu Tanımları
INSERT INTO temperatur_logs (location, min_temp, max_temp, current_temp, checked_by, checked_at, datum, status) VALUES
('Kühlhaus Küche (Gemüse/Mopro)', 1.0, 5.0, 3.2, 'Admin Ado', '07:30', CURRENT_DATE, 'ok'),
('Tiefkühler Backstube', -22.0, -18.0, -19.4, 'Admin Ado', '07:30', CURRENT_DATE, 'ok'),
('Kühlvitrine Verkauf Theke', 2.0, 6.0, 4.1, 'Admin Ado', '07:30', CURRENT_DATE, 'ok')
ON CONFLICT DO NOTHING;

-- Varsayılan İlk Karşılama Duyurusu
INSERT INTO bulletins (titel, text, dringend, ersteller, datum) VALUES
('Willkommen auf der ADO Enterprise Plattform', 'Das System ist nun online und mit der zentralen Datenbank verbunden. Zeiterfassung und Schichtpläne sind aktiv.', TRUE, 'Geschäftsleitung', CURRENT_DATE)
ON CONFLICT DO NOTHING;

-- ----------------------------------------------------------------------------
-- 11. ERIŞIM YETKILERI (KIOSK & TABLET IÇIN RLS DEVRE DIŞI / AÇIK ERIŞIM)
-- ----------------------------------------------------------------------------
ALTER TABLE firmenparameter DISABLE ROW LEVEL SECURITY;
ALTER TABLE mitarbeiter DISABLE ROW LEVEL SECURITY;
ALTER TABLE stempelungen DISABLE ROW LEVEL SECURITY;
ALTER TABLE schichten DISABLE ROW LEVEL SECURITY;
ALTER TABLE schichtplan_wochen DISABLE ROW LEVEL SECURITY;
ALTER TABLE krankmeldungen DISABLE ROW LEVEL SECURITY;
ALTER TABLE abwesenheiten DISABLE ROW LEVEL SECURITY;
ALTER TABLE lohnabrechnungen DISABLE ROW LEVEL SECURITY;
ALTER TABLE lohnabrechnung_positionen DISABLE ROW LEVEL SECURITY;
ALTER TABLE urlaub_zeit_saldo DISABLE ROW LEVEL SECURITY;
ALTER TABLE lieferanten DISABLE ROW LEVEL SECURITY;
ALTER TABLE rechnungen DISABLE ROW LEVEL SECURITY;
ALTER TABLE bestellungen DISABLE ROW LEVEL SECURITY;
ALTER TABLE haccp_checklisten DISABLE ROW LEVEL SECURITY;
ALTER TABLE temperatur_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE bulletins DISABLE ROW LEVEL SECURITY;

-- ============================================================================
-- KURULUM TAMAMLANDI!
-- ============================================================================

