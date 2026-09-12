export const SEED_DEPARTMENTS = [
  { id: 'kuche', name: 'Küche (Mutfak)', icon: 'ChefHat', color: 'emerald' },
  { id: 'service', name: 'Service (Servis)', icon: 'UtensilsCrossed', color: 'blue' },
  { id: 'bar', name: 'Bar & Lounge', icon: 'Wine', color: 'purple' },
  { id: 'lager', name: 'Lager & Logistik (Depo)', icon: 'Boxes', color: 'amber' },
  { id: 'reinigung', name: 'Reinigung & Hygiene (Temizlik)', icon: 'Sparkles', color: 'rose' }
];

export const SEED_SUPPLIERS = [
  {
    id: 'sup-prodega',
    name: 'Prodega CC Dietikon (Transgourmet)',
    category: 'Grosshandel & C&C (Toptan Grossmarkt)',
    contactPerson: 'Marco Bellini / Kundendienst',
    phone: '+41 44 809 11 00',
    email: 'dietikon@prodega.ch',
    whatsapp: '+41798091100',
    deliveryDays: ['Montag', 'Mittwoch', 'Freitag'],
    rating: 4.9,
    address: 'Industriestrasse 18, 8305 Dietlikon',
    notes: 'Hauptlieferant Trockensortiment, Molkerei, Öle & Gastro-Grossgebinde',
    catalog: [
      { id: 'prd-1', name: 'Olivenöl Extra Vergine 5L Kanister', price: 64.00, unit: 'Kanister' },
      { id: 'prd-2', name: 'Basmati Reis Premium 20kg Sack', price: 42.50, unit: 'Sack' },
      { id: 'prd-3', name: 'Pasta Penne Rigate Barilla 5kg', price: 14.20, unit: 'Packung' },
      { id: 'prd-4', name: 'Mozzarella di Bufala DOP (1kg)', price: 19.80, unit: 'kg' },
      { id: 'prd-5', name: 'Parmigiano Reggiano 24M (kg)', price: 34.00, unit: 'kg' },
      { id: 'prd-6', name: 'Bratbutter Gastro 5kg Eimer', price: 46.00, unit: 'Eimer' },
      { id: 'prd-7', name: 'Frittieröl Gastro Sun 10L Kanister', price: 38.50, unit: 'Kanister' }
    ]
  },
  {
    id: 'sup-hiestand',
    name: 'HIESTAND Schweiz AG',
    category: 'Tiefkühl-Backwaren & Gipfeli (Dondurulmuş Hamur)',
    contactPerson: 'Beat Brunner (Gastro-Beratung)',
    phone: '+41 44 738 41 11',
    email: 'order.ch@hiestand.ch',
    whatsapp: '+41797384111',
    deliveryDays: ['Dienstag', 'Donnerstag', 'Samstag früh'],
    rating: 5.0,
    address: 'Würzbrunnenstrasse 2, 8952 Schlieren',
    notes: 'Premium Schweizer Buttergipfeli, Laugengebäck & Baguettes tiefgekühlt',
    catalog: [
      { id: 'hie-1', name: 'Buttergipfel CH Teigling 70g (120 Stk)', price: 89.00, unit: 'Karton' },
      { id: 'hie-2', name: 'Laugengipfel Premium 80g (100 Stk)', price: 82.50, unit: 'Karton' },
      { id: 'hie-3', name: 'Pain au Chocolat Butter 75g (90 Stk)', price: 76.00, unit: 'Karton' },
      { id: 'hie-4', name: 'Baguette Parisienne vorgebacken (30 Stk)', price: 44.00, unit: 'Karton' },
      { id: 'hie-5', name: 'Rustico Bürli gemischt 90g (80 Stk)', price: 58.00, unit: 'Karton' },
      { id: 'hie-6', name: 'Vanille-Plunder mit Himbeeren (60 Stk)', price: 68.00, unit: 'Karton' }
    ]
  },
  {
    id: 'sup-pistor',
    name: 'Pistor AG Bäckerei- & Gastrobedarf',
    category: 'Bäckereirohstoffe & Konditorei (Fırın & Pastacılık)',
    contactPerson: 'Kundenbetreuung Ostschweiz / Zürich',
    phone: '+41 41 289 89 89',
    email: 'bestellung@pistor.ch',
    whatsapp: '+41792898989',
    deliveryDays: ['Montag', 'Mittwoch', 'Freitag'],
    rating: 4.9,
    address: 'Hasenmoosstrasse 31, 6023 Rothenburg',
    notes: 'Zucker, Spezialmehle, Kuvertüre, Backfette & Bäckereiverpackungen',
    catalog: [
      { id: 'pis-1', name: 'Kristallzucker Schweizer Fein 25kg Sack', price: 32.50, unit: 'Sack' },
      { id: 'pis-2', name: 'Pistor Bäckermargarine Gold 10kg Block', price: 42.00, unit: 'Karton' },
      { id: 'pis-3', name: 'Felchlin Kuvertüre Maracaibo 65% (5kg Drops)', price: 86.00, unit: 'Packung' },
      { id: 'pis-4', name: 'Vollei pasteurisiert CH 10L Bag-in-Box', price: 48.00, unit: 'Box' },
      { id: 'pis-5', name: 'Vanillecreme Pulver Kaltcreme 5kg', price: 36.50, unit: 'Eimer' },
      { id: 'pis-6', name: 'Bäckerseidenpapier 50x75cm (10kg)', price: 38.00, unit: 'Pack' }
    ]
  },
  {
    id: 'sup-meyerhans',
    name: 'MEYERHANS MÜHLEN AG',
    category: 'Mühlen & Getreidemehle (Un Fabrikası / Değirmen)',
    contactPerson: 'Lukas Meyerhans',
    phone: '+41 52 723 34 34',
    email: 'muehle@meyerhans.ch',
    whatsapp: '+41797233434',
    deliveryDays: ['Montag', 'Donnerstag'],
    rating: 5.0,
    address: 'Rheinstrasse 18, 8500 Frauenfeld',
    notes: 'Aylık sözleşmeli un sevkiyatı (Dauervertrag). Schweizer Qualitätsmehle IP-Suisse',
    catalog: [
      { id: 'mey-1', name: 'Weissmehl Type 550 Schweizer IP-Suisse 25kg', price: 28.50, unit: 'Sack' },
      { id: 'mey-2', name: 'Halbweissmehl Type 720 Schweiz 25kg', price: 29.00, unit: 'Sack' },
      { id: 'mey-3', name: 'Ruchmehl dunkel Type 1100 25kg', price: 29.80, unit: 'Sack' },
      { id: 'mey-4', name: 'Dinkelmehl hell Urdinkel 25kg', price: 42.00, unit: 'Sack' },
      { id: 'mey-5', name: 'Roggenmehl Type 1150 25kg', price: 34.00, unit: 'Sack' },
      { id: 'mey-6', name: 'Hartweizengriess fein (Semola) 25kg', price: 36.50, unit: 'Sack' }
    ]
  },
  {
    id: 'sup-swissbaeck',
    name: 'SwissBäck & Daroz Fladen (Inh. Akinci)',
    category: 'Fladenbrot, Lavaş & Pide (Lavaş & Fırın Ürünleri)',
    contactPerson: 'Ali Akinci',
    phone: '+41 44 830 55 60',
    email: 'order@swissbaeck.ch',
    whatsapp: '+41789901122',
    deliveryDays: ['Täglich (Mo-Sa frühmorgens)'],
    rating: 4.9,
    address: 'Industrie West, 8304 Wallisellen',
    notes: 'Taze günlük lavaş, kebap ekmeği, Ramazan pidesi ve susamlı somun',
    catalog: [
      { id: 'swb-1', name: 'Dürüm Lavaş Teiglinge 30cm (100er)', price: 38.00, unit: 'Karton' },
      { id: 'swb-2', name: 'Pidebrot frisch mit Sesam (50 Stk)', price: 42.50, unit: 'Kiste' },
      { id: 'swb-3', name: 'Daroz Fladenbrot 40cm traditionell (30 Stk)', price: 36.00, unit: 'Packung' },
      { id: 'swb-4', name: 'Tombik Döner Brot 16cm gebacken (60 Stk)', price: 39.00, unit: 'Karton' }
    ]
  },
  {
    id: 'sup-coca-cola',
    name: 'COCA-COLA HBC SCHWEIZ AG',
    category: 'Getränke, Mineral & Softdrinks (İçecekler)',
    contactPerson: 'Gastro-Service Zürich',
    phone: '+41 44 835 91 11',
    email: 'gastro.orders@coca-cola.ch',
    whatsapp: '+41798359111',
    deliveryDays: ['Dienstag', 'Freitag'],
    rating: 4.8,
    address: 'Stationsstrasse 33, 8306 Brüttisellen',
    notes: 'Gastro Glasflaschen & Harassen. Leergut-Gutschrift direkt auf Rechnung',
    catalog: [
      { id: 'cok-1', name: 'Coca-Cola Original Gastro Glas (24x33cl)', price: 22.50, unit: 'Harass' },
      { id: 'cok-2', name: 'Coca-Cola Zero Gastro Glas (24x33cl)', price: 22.50, unit: 'Harass' },
      { id: 'cok-3', name: 'Valser Prickelnd mit Kohlensäure (24x33cl)', price: 17.80, unit: 'Harass' },
      { id: 'cok-4', name: 'Valser Silence ohne Kohlensäure (24x33cl)', price: 17.80, unit: 'Harass' },
      { id: 'cok-5', name: 'Fanta Orange Gastro Glas (24x33cl)', price: 22.50, unit: 'Harass' },
      { id: 'cok-6', name: 'Sprite Gastro Glas (24x33cl)', price: 22.50, unit: 'Harass' },
      { id: 'cok-7', name: 'Fusetea Lemon & Peach Glas (24x33cl)', price: 24.00, unit: 'Harass' }
    ]
  },
  {
    id: 'sup-agrano',
    name: 'Agrano AG Bäckereizutaten',
    category: 'Backhefe, Sauerteig & Aromen (Maya & Katkılar)',
    contactPerson: 'Reto Schmid',
    phone: '+41 61 487 72 72',
    email: 'bestellung@agrano.ch',
    whatsapp: '+41794877272',
    deliveryDays: ['Mittwoch'],
    rating: 4.9,
    address: 'Ringstrasse 19, 4123 Allschwil',
    notes: 'Frischhefe Würfel 500g, Bio-Sauerteig & Bäckermalz',
    catalog: [
      { id: 'agr-1', name: 'Backhefe frisch Schweizer Würfel 500g (12er Block)', price: 24.00, unit: 'Karton' },
      { id: 'agr-2', name: 'Bio Weizensauerteig flüssig 5kg Kanister', price: 34.50, unit: 'Kanister' },
      { id: 'agr-3', name: 'Backmalz aktiv flüssig 10kg Eimer', price: 46.00, unit: 'Eimer' },
      { id: 'agr-4', name: 'Glanza Glanzstreiche für Gipfeli 5L', price: 29.50, unit: 'Kanister' }
    ]
  },
  {
    id: 'sup-aligro',
    name: 'Aligro Grossmarkt Schlieren',
    category: 'Fleisch, Fisch, Gastro C&C (Et, Balık & Taze Gıda)',
    contactPerson: 'Kundendienst Schlieren',
    phone: '+41 44 738 22 22',
    email: 'info@aligro.ch',
    whatsapp: '+41797382222',
    deliveryDays: ['Montag', 'Mittwoch', 'Freitag'],
    rating: 4.8,
    address: 'Bernstrasse 38, 8952 Schlieren',
    notes: 'Frische Fleischwaren, Geflügel, Schweizer Käse & Gemüse',
    catalog: [
      { id: 'ali-1', name: 'Pouletbrust Schweiz Gastro 5kg Vakuum', price: 62.50, unit: 'Packung' },
      { id: 'ali-2', name: 'Rindshackfleisch CH 5kg Vakuum', price: 54.00, unit: 'Packung' },
      { id: 'ali-3', name: 'Emmentaler AOP mild Block ca. 3kg', price: 48.00, unit: 'Block' },
      { id: 'ali-4', name: 'Gruyère AOP 12M Block ca. 3kg', price: 56.00, unit: 'Block' }
    ]
  },
  {
    id: 'sup-gemuese',
    name: 'Frische Paradies / Yeşil Vadi',
    category: 'Obst & Gemüse (Taze Meyve-Sebze)',
    contactPerson: 'Ali Vural',
    phone: '+41 44 322 15 80',
    email: 'order@frische-gemuese.ch',
    whatsapp: '+41785551234',
    deliveryDays: ['Täglich (Mo-Sa morgens)'],
    rating: 5.0,
    address: 'Engrosmarkt Aargauerstrasse 1, 8048 Zürich',
    notes: 'Tägliche Morgenlieferung direkt vom Grossmarkt um 06:30 Uhr',
    catalog: [
      { id: 'gem-1', name: 'Strauchtomaten CH Kl. 1 (kg)', price: 4.80, unit: 'kg' },
      { id: 'gem-2', name: 'Salatgurken Schweiz (Stk)', price: 1.40, unit: 'Stück' },
      { id: 'gem-3', name: 'Rucola gewaschen 1kg Kiste', price: 14.50, unit: 'Kiste' },
      { id: 'gem-4', name: 'Kartoffeln Bintje festkochend 25kg', price: 28.00, unit: 'Sack' },
      { id: 'gem-5', name: 'Zwiebeln Gelb Schweiz 10kg', price: 16.00, unit: 'Sack' }
    ]
  },
  {
    id: 'sup-cleancare',
    name: 'HygieneProfi & CleanCare AG',
    category: 'Hygiene, HACCP & Verpackung (Temizlik & Sarf)',
    contactPerson: 'Ursula Graf',
    phone: '+41 44 905 60 70',
    email: 'service@cleancare.ch',
    whatsapp: '+41768882233',
    deliveryDays: ['Mittwoch'],
    rating: 4.8,
    address: 'Gewerbestrasse 7, 8600 Dübendorf',
    notes: 'HACCP-zertifizierte Desinfektionsmittel & Gastro-Papierwaren',
    catalog: [
      { id: 'cln-1', name: 'Gastro Geschirrspülmittel Konzentrat 10L', price: 48.00, unit: 'Kanister' },
      { id: 'cln-2', name: 'Küchenrollen 3-lagig reissfest (32 Rollen)', price: 34.50, unit: 'Pack' },
      { id: 'cln-3', name: 'Flächendesinfektion HACCP 5L Kanister', price: 39.00, unit: 'Kanister' },
      { id: 'cln-4', name: 'Einweghandschuhe Nitril Schwarz (100er Box)', price: 12.50, unit: 'Box' }
    ]
  }
];

export const SEED_EMPLOYEES = [
  {
    id: 'emp-admin',
    name: 'ADO Chef / Geschäftsführer',
    email: 'admin@firma.ch',
    password: 'admin',
    pin: '9999',
    role: 'admin',
    department: 'all',
    jobTitle: 'Geschäftsführer & Inhaber',
    hourlyRate: 55.00,
    phone: '+41 79 999 88 77',
    ahv: '756.1111.2222.33',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    vacationTotal: 30,
    vacationUsed: 5,
    joinedDate: '2022-01-01',
    contractType: 'Unbefristet',
    status: 'active'
  },
  {
    id: 'emp-1',
    name: 'Canan Yılmaz',
    email: 'canan@firma.ch',
    password: '1234',
    pin: '1001',
    role: 'employee',
    department: 'kuche',
    jobTitle: 'Chefköchin (Mutfak Şefi)',
    hourlyRate: 36.50,
    phone: '+41 79 111 22 33',
    ahv: '756.9284.1029.83',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    vacationTotal: 25,
    vacationUsed: 10,
    joinedDate: '2023-03-15',
    contractType: 'Festanstellung 100%',
    status: 'active'
  },
  {
    id: 'emp-2',
    name: 'Mehmet Demir',
    email: 'mehmet@firma.ch',
    password: '1234',
    pin: '1002',
    role: 'employee',
    department: 'service',
    jobTitle: 'Serviceleiter & Sommelier',
    hourlyRate: 32.00,
    phone: '+41 79 222 33 44',
    ahv: '756.4912.8392.11',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    vacationTotal: 25,
    vacationUsed: 8,
    joinedDate: '2023-06-01',
    contractType: 'Festanstellung 100%',
    status: 'active'
  },
  {
    id: 'emp-3',
    name: 'Sarah Schmid',
    email: 'sarah@firma.ch',
    password: '1234',
    pin: '1003',
    role: 'employee',
    department: 'bar',
    jobTitle: 'Head Bartender & Barista',
    hourlyRate: 29.50,
    phone: '+41 78 333 44 55',
    ahv: '756.8831.2910.42',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    vacationTotal: 20,
    vacationUsed: 5,
    joinedDate: '2023-09-01',
    contractType: 'Teilzeit 80%',
    status: 'active'
  },
  {
    id: 'emp-4',
    name: 'Ali Kaya',
    email: 'ali@firma.ch',
    password: '1234',
    pin: '1004',
    role: 'employee',
    department: 'kuche',
    jobTitle: 'Beikoch & Grillmeister',
    hourlyRate: 29.00,
    phone: '+41 76 444 55 66',
    ahv: '756.1294.5510.98',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    vacationTotal: 25,
    vacationUsed: 12,
    joinedDate: '2023-11-15',
    contractType: 'Festanstellung 100%',
    status: 'active'
  },
  {
    id: 'emp-5',
    name: 'David Keller',
    email: 'david@firma.ch',
    password: '1234',
    pin: '1005',
    role: 'employee',
    department: 'lager',
    jobTitle: 'Lagerleiter & Wareneingang',
    hourlyRate: 27.50,
    phone: '+41 79 555 66 77',
    ahv: '756.7721.4019.23',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    vacationTotal: 15,
    vacationUsed: 3,
    joinedDate: '2024-02-01',
    contractType: 'Teilzeit 60%',
    status: 'active'
  },
  {
    id: 'emp-6',
    name: 'Fatma Öztürk',
    email: 'fatma@firma.ch',
    password: '1234',
    pin: '1006',
    role: 'employee',
    department: 'reinigung',
    jobTitle: 'Hygienemanagerin & Housekeeping',
    hourlyRate: 26.00,
    phone: '+41 78 666 77 88',
    ahv: '756.3319.8271.60',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    vacationTotal: 15,
    vacationUsed: 4,
    joinedDate: '2024-01-10',
    contractType: 'Teilzeit 50%',
    status: 'active'
  }
];

export const SHIFT_TYPES = {
  FRUEH: {
    id: 'frueh',
    name: 'Frühschicht (Sabah Vardiyası)',
    start: '08:00',
    end: '16:30',
    breakMins: 30,
    netHours: 8.0,
    badgeColor: 'emerald'
  },
  SPAET: {
    id: 'spaet',
    name: 'Spätschicht (Akşam Vardiyası)',
    start: '16:00',
    end: '00:30',
    breakMins: 30,
    netHours: 8.0,
    badgeColor: 'blue'
  },
  GANZTAG: {
    id: 'ganztag',
    name: 'Ganztags / Zimmerstunde (Bölünmüş Gün)',
    start: '10:00',
    end: '22:30',
    breakMins: 150,
    netHours: 10.0,
    badgeColor: 'purple'
  }
};

export const SICK_REASONS = [
  'Grippaler Infekt / Stark erkältet (Soğuk Algınlığı / Grip)',
  'Fieber & Schüttelfrost (Yüksek Ateş)',
  'Magen-Darm-Infektion (Mide & Bağırsak Rahatsızlığı)',
  'Arbeitsunfall / Verletzung (İş Kazası / Yaralanma)',
  'Akuter Zahnarzt- / Notfalltermin (Acil Diş / Doktor Randevusu)',
  'Migräne / Chronische Beschwerden (Migren / Kronik Ağrı)',
  'Sonstiges / Ärztliche Krankschreibung liegt vor (Diğer / Raporlu)'
];

export const SEED_SHIFTS = [
  // Bugün ve bu hafta için örnek vardiya kayıtları
  {
    id: 'sh-1',
    employeeId: 'emp-1',
    date: new Date().toISOString().split('T')[0],
    shiftType: 'frueh',
    department: 'kuche',
    notes: 'Mise-en-place & Mittagsmenü Vorbereitung',
    status: 'confirmed' // confirmed, sick, swapped, completed
  },
  {
    id: 'sh-2',
    employeeId: 'emp-4',
    date: new Date().toISOString().split('T')[0],
    shiftType: 'spaet',
    department: 'kuche',
    notes: 'Abendservice & Grill Station',
    status: 'confirmed'
  },
  {
    id: 'sh-3',
    employeeId: 'emp-2',
    date: new Date().toISOString().split('T')[0],
    shiftType: 'frueh',
    department: 'service',
    notes: 'Mittagsservice & Weinannahme',
    status: 'confirmed'
  },
  {
    id: 'sh-4',
    employeeId: 'emp-3',
    date: new Date().toISOString().split('T')[0],
    shiftType: 'spaet',
    department: 'bar',
    notes: 'Cocktail Abend & Abrechnung',
    status: 'confirmed'
  },
  {
    id: 'sh-5',
    employeeId: 'emp-5',
    date: new Date().toISOString().split('T')[0],
    shiftType: 'frueh',
    department: 'lager',
    notes: 'Prodega & Metzgerei Lieferkontrolle',
    status: 'confirmed'
  }
];

export const SEED_INVOICES = [
  {
    id: 'inv-101',
    invoiceNumber: 'RG-2026-9042',
    supplierId: 'sup-1',
    supplierName: 'Metzgerei Keller & Söhne',
    date: '2026-09-08',
    dueDate: '2026-09-22',
    subtotal: 1342.10,
    taxRate: 2.6, // Lebensmittel MWST Schweiz
    taxAmount: 34.89,
    totalAmount: 1376.99,
    category: 'Fleisch & Geflügel',
    status: 'paid', // paid, pending, review, overdue
    paidDate: '2026-09-09',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
    items: [
      { name: 'Rindsfilet CH Premium 15kg', total: 1027.50 },
      { name: 'Pouletbrust Schweiz 14.2kg', total: 349.49 }
    ]
  },
  {
    id: 'inv-102',
    invoiceNumber: 'TG-ZH-88129',
    supplierId: 'sup-2',
    supplierName: 'Prodega Transgourmet Zürich',
    date: '2026-09-09',
    dueDate: '2026-09-23',
    subtotal: 3120.40,
    taxRate: 8.1, // Mischsteuersatz
    taxAmount: 252.75,
    totalAmount: 3373.15,
    category: 'Grosshandelswaren & Molkerei',
    status: 'pending',
    imageUrl: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=600&auto=format&fit=crop&q=80',
    items: [
      { name: 'Olivenöl 5L (4 Kanister)', total: 256.00 },
      { name: 'Mozzarella di Bufala (20kg)', total: 396.00 },
      { name: 'Trockensortiment & Diverses', total: 2721.15 }
    ]
  },
  {
    id: 'inv-103',
    invoiceNumber: 'YV-2609-012',
    supplierId: 'sup-3',
    supplierName: 'Frische Paradies / Yeşil Vadi',
    date: '2026-09-10',
    dueDate: '2026-09-17',
    subtotal: 712.50,
    taxRate: 2.6,
    taxAmount: 18.52,
    totalAmount: 731.02,
    category: 'Tagesfrisches Gemüse & Obst',
    status: 'pending',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
    items: [
      { name: 'Strauchtomaten 40kg', total: 192.00 },
      { name: 'Salatgurken 60 Stk', total: 84.00 },
      { name: 'Rucola & Spinat 12kg', total: 174.00 },
      { name: 'Kartoffeln 25kg (10 Säcke)', total: 280.00 }
    ]
  },
  {
    id: 'inv-104',
    invoiceNumber: 'FS-991204',
    supplierId: 'sup-4',
    supplierName: 'Feldschlösschen Getränke AG',
    date: '2026-09-04',
    dueDate: '2026-09-18',
    subtotal: 1880.00,
    taxRate: 8.1,
    taxAmount: 152.28,
    totalAmount: 2032.28,
    category: 'Getränke & Bier',
    status: 'paid',
    paidDate: '2026-09-06',
    imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&auto=format&fit=crop&q=80',
    items: [
      { name: 'Original Bier Fass 20L (12 Fässer)', total: 984.00 },
      { name: 'Valser Mineral 24x0.5L (20 Harassen)', total: 370.00 },
      { name: 'Softdrinks Divers (32 Harassen)', total: 678.28 }
    ]
  },
  {
    id: 'inv-105',
    invoiceNumber: 'CC-44810',
    supplierId: 'sup-6',
    supplierName: 'HygieneProfi & CleanCare AG',
    date: '2026-09-02',
    dueDate: '2026-09-16',
    subtotal: 480.00,
    taxRate: 8.1,
    taxAmount: 38.88,
    totalAmount: 518.88,
    category: 'Hygiene & Reinigung',
    status: 'paid',
    paidDate: '2026-09-05',
    imageUrl: 'https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=600&auto=format&fit=crop&q=80',
    items: [
      { name: 'Gastro Geschirrspüler 10L (3 Kanister)', total: 144.00 },
      { name: 'Küchenrollen Großpackungen (6 Packs)', total: 207.00 },
      { name: 'Nitril Handschuhe (10 Boxen)', total: 125.00 }
    ]
  }
];

export const SEED_TIME_LOGS = [
  {
    id: 'tl-1',
    employeeId: 'emp-1',
    date: new Date().toISOString().split('T')[0],
    clockIn: '07:55',
    clockOut: null, // Halen işte
    breakMinutes: 15,
    status: 'working'
  },
  {
    id: 'tl-2',
    employeeId: 'emp-2',
    date: new Date().toISOString().split('T')[0],
    clockIn: '08:02',
    clockOut: null,
    breakMinutes: 10,
    status: 'working'
  }
];

export const SEED_HACCP_CHECKLISTS = [
  {
    id: 'chk-1',
    category: 'morning',
    title: 'Kaffeemaschine Reinigung & Spülung',
    titleTr: 'Kahve makinesi temizliği ve durulama',
    done: true,
    completedBy: 'Sarah Schmid',
    time: '07:15',
    date: new Date().toISOString().split('T')[0]
  },
  {
    id: 'chk-2',
    category: 'morning',
    title: 'Brotregale & Theke desinfizieren',
    titleTr: 'Ekmek rafları & tezgah dezenfeksiyonu',
    done: true,
    completedBy: 'Canan Yılmaz',
    time: '06:30',
    date: new Date().toISOString().split('T')[0]
  },
  {
    id: 'chk-3',
    category: 'morning',
    title: 'Verfallsdaten & Frische prüfen (MHD)',
    titleTr: 'Son kullanma tarihi ve tazelik kontrolü',
    done: true,
    completedBy: 'Canan Yılmaz',
    time: '06:45',
    date: new Date().toISOString().split('T')[0]
  },
  {
    id: 'chk-4',
    category: 'morning',
    title: 'Handwaschstationen (Seife, Papier) auffüllen',
    titleTr: 'Lavabo sabun ve kağıt havlu tamamlama',
    done: true,
    completedBy: 'Fatma Öztürk',
    time: '07:00',
    date: new Date().toISOString().split('T')[0]
  },
  {
    id: 'chk-5',
    category: 'evening',
    title: 'Backöfen & Backbleche gründlich reinigen',
    titleTr: 'Fırın ve fırın tepsilerini temizleme',
    done: false,
    completedBy: null,
    time: null,
    date: new Date().toISOString().split('T')[0]
  },
  {
    id: 'chk-6',
    category: 'evening',
    title: 'Kühlraum- & Tiefkühltüren Dichtungen prüfen',
    titleTr: 'Soğuk oda & derin dondurucu kapak kilit kontrolü',
    done: false,
    completedBy: null,
    time: null,
    date: new Date().toISOString().split('T')[0]
  },
  {
    id: 'chk-7',
    category: 'evening',
    title: 'Mülltrennung & Container verschliessen',
    titleTr: 'Çöp ayrıştırma ve konteynerleri kilitleme',
    done: false,
    completedBy: null,
    time: null,
    date: new Date().toISOString().split('T')[0]
  },
  {
    id: 'chk-8',
    category: 'evening',
    title: 'Tageskassenabschluss & Tresorverschluss',
    titleTr: 'Günlük kasa sayımı ve çelik kasa kilidi',
    done: false,
    completedBy: null,
    time: null,
    date: new Date().toISOString().split('T')[0]
  }
];

export const SEED_TEMPERATURE_LOGS = [
  {
    id: 'temp-1',
    location: 'Kühlraum 1 (Molkerei & Fleisch)',
    locationTr: 'Soğuk Oda 1 (Süt & Et)',
    targetRange: '2.0°C - 4.0°C',
    currentTemp: 3.2,
    status: 'ok',
    checkedBy: 'Canan Yılmaz',
    checkedAt: '06:15',
    date: new Date().toISOString().split('T')[0]
  },
  {
    id: 'temp-2',
    location: 'Kühlraum 2 (Teiglinge & Bäckerei)',
    locationTr: 'Soğuk Oda 2 (Hamur & Fırın)',
    targetRange: '4.0°C - 6.0°C',
    currentTemp: 4.8,
    status: 'ok',
    checkedBy: 'Ali Kaya',
    checkedAt: '06:20',
    date: new Date().toISOString().split('T')[0]
  },
  {
    id: 'temp-3',
    location: 'Tiefkühler Hauptlager',
    locationTr: 'Derin Dondurucu Ana Depo',
    targetRange: '-18.0°C bis -22.0°C',
    currentTemp: -19.4,
    status: 'ok',
    checkedBy: 'David Keller',
    checkedAt: '07:30',
    date: new Date().toISOString().split('T')[0]
  },
  {
    id: 'temp-4',
    location: 'Kühlvitrine Verkauf / Service',
    locationTr: 'Satış & Servis Soğuk Vitrini',
    targetRange: '3.0°C - 5.0°C',
    currentTemp: 3.9,
    status: 'ok',
    checkedBy: 'Mehmet Demir',
    checkedAt: '07:50',
    date: new Date().toISOString().split('T')[0]
  }
];

export const SEED_BULLETINS = [
  {
    id: 'bul-1',
    title: 'Kantonale Lebensmittelkontrolle (HACCP Inspektion)',
    titleTr: 'Kanton Gıda Denetimi (HACCP İncelemesi)',
    category: 'urgent',
    date: new Date().toISOString().split('T')[0],
    author: 'Geschäftsleitung / Kadir',
    content: 'Liebes Team, am kommenden Dienstag findet die jährliche Lebensmittelkontrolle statt. Bitte alle Kühlraum-Temperaturlisten und Reinigungspläne lückenlos ausfüllen.',
    contentTr: 'Değerli ekip, önümüzdeki Salı günü yıllık kanton gıda denetimi yapılacaktır. Lütfen tüm soğutucu sıcaklık listelerini ve temizlik çizelgelerini eksiksiz doldurun.',
    pinned: true,
    views: 12
  },
  {
    id: 'bul-2',
    title: 'Sonntagszuschlag & Oster-Wochenende Einsatzplan',
    titleTr: 'Pazar Mesai Zammı & Bayram Vardiya Planı',
    category: 'info',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    author: 'Geschäftsleitung / Kadir',
    content: 'Der Schichtplan für das kommende Feiertags-Wochenende ist online. Für Einsätze am Sonntag gilt der reguläre GAV-Sonntagszuschlag (+50%).',
    contentTr: 'Önümüzdeki tatil haftasonunun vardiya planı yayınlandı. Pazar günü çalışanlar için İsviçre GAV kuralı gereği %50 ek zam uygulanacaktır.',
    pinned: false,
    views: 16
  }
];

