export const SEED_DEPARTMENTS = [
  { id: 'kuche', name: 'Küche (Mutfak)', icon: 'ChefHat', color: 'emerald' },
  { id: 'service', name: 'Service (Servis)', icon: 'UtensilsCrossed', color: 'blue' },
  { id: 'bar', name: 'Bar & Lounge', icon: 'Wine', color: 'purple' },
  { id: 'lager', name: 'Lager & Logistik (Depo)', icon: 'Boxes', color: 'amber' },
  { id: 'reinigung', name: 'Reinigung & Hygiene (Temizlik)', icon: 'Sparkles', color: 'rose' }
];

export const SEED_SUPPLIERS = [
  {
    id: 'sup-1',
    name: 'Metzgerei Keller & Söhne',
    category: 'Metzgerei / Fleischerei (Kasap)',
    contactPerson: 'Hans Keller',
    phone: '+41 44 211 40 20',
    email: 'bestellung@metzgerei-keller.ch',
    whatsapp: '+41791234567',
    deliveryDays: ['Dienstag', 'Donnerstag', 'Samstag'],
    minOrderChf: 200,
    rating: 4.9,
    address: 'Zürich West Str. 42, 8005 Zürich',
    notes: 'Frische Schweizer Fleischwaren, Vorbestellung bis 18:00 Uhr',
    catalog: [
      { id: 'p1', name: 'Rindsfilet CH Premium (kg)', price: 68.50, unit: 'kg' },
      { id: 'p2', name: 'Kalbskotelett Schweiz (kg)', price: 48.00, unit: 'kg' },
      { id: 'p3', name: 'Pouletbrust Schweiz (kg)', price: 24.50, unit: 'kg' },
      { id: 'p4', name: 'Hackfleisch Rind/Schwein (kg)', price: 18.90, unit: 'kg' },
      { id: 'p5', name: 'Bacon Streifen geräuchert (kg)', price: 22.00, unit: 'kg' },
      { id: 'p5b', name: 'Lammkoteletts mariniert (kg)', price: 38.50, unit: 'kg' }
    ]
  },
  {
    id: 'sup-2',
    name: 'Prodega Transgourmet Zürich',
    category: 'Grosshandel & C&C (Toptan Grossmarkt)',
    contactPerson: 'Marco Bellini',
    phone: '+41 44 809 11 00',
    email: 'orders.zh@prodega.ch',
    whatsapp: '+41798765432',
    deliveryDays: ['Montag', 'Mittwoch', 'Freitag'],
    minOrderChf: 400,
    rating: 4.8,
    address: 'Industriestrasse 18, 8305 Dietlikon',
    notes: 'Grossgebinde, Trockensortiment, Molkerei & Non-Food',
    catalog: [
      { id: 'p6', name: 'Olivenöl Extra Vergine 5L Kanister', price: 64.00, unit: 'Kanister' },
      { id: 'p7', name: 'Basmati Reis Premium 20kg Sack', price: 42.50, unit: 'Sack' },
      { id: 'p8', name: 'Pasta Penne Rigate Barilla 5kg', price: 14.20, unit: 'Packung' },
      { id: 'p9', name: 'Mozzarella di Bufala DOP (1kg)', price: 19.80, unit: 'kg' },
      { id: 'p10', name: 'Parmigiano Reggiano 24M (kg)', price: 34.00, unit: 'kg' },
      { id: 'p10b', name: 'Bratbutter Gastro 5kg Eimer', price: 46.00, unit: 'Eimer' }
    ]
  },
  {
    id: 'sup-3',
    name: 'Frische Paradies / Yeşil Vadi',
    category: 'Obst & Gemüse (Taze Meyve-Sebze)',
    contactPerson: 'Ali Vural',
    phone: '+41 44 322 15 80',
    email: 'order@frische-gemuese.ch',
    whatsapp: '+41785551234',
    deliveryDays: ['Täglich (Mo-Sa)'],
    minOrderChf: 100,
    rating: 5.0,
    address: 'Engrosmarkt Aargauerstrasse 1, 8048 Zürich',
    notes: 'Tägliche Morgenlieferung direkt vom Grossmarkt um 06:30 Uhr',
    catalog: [
      { id: 'p11', name: 'Strauchtomaten CH Kl. 1 (kg)', price: 4.80, unit: 'kg' },
      { id: 'p12', name: 'Salatgurken Schweiz (Stk)', price: 1.40, unit: 'Stück' },
      { id: 'p13', name: 'Rucola & Baby-Spinat gewaschen (kg)', price: 14.50, unit: 'kg' },
      { id: 'p14', name: 'Kartoffeln Bintje festkochend 25kg', price: 28.00, unit: 'Sack' },
      { id: 'p15', name: 'Avocado Hass Ready-to-Eat (Kiste 16er)', price: 32.00, unit: 'Kiste' },
      { id: 'p15b', name: 'Zwiebeln Gelb Schweiz 10kg', price: 16.00, unit: 'Sack' }
    ]
  },
  {
    id: 'sup-4',
    name: 'Feldschlösschen Getränke AG',
    category: 'Getränke, Bier & Wein (İçecekler)',
    contactPerson: 'Stefan Meyer',
    phone: '+41 848 125 000',
    email: 'gastro@feldschloesschen.ch',
    whatsapp: '+41793339900',
    deliveryDays: ['Dienstag', 'Freitag'],
    minOrderChf: 300,
    rating: 4.7,
    address: 'Depot Oerlikon, 8050 Zürich',
    notes: 'Leergut-Rücknahme bei jeder Anlieferung',
    catalog: [
      { id: 'p16', name: 'Feldschlösschen Original Fass 20L', price: 82.00, unit: 'Fass' },
      { id: 'p17', name: 'Valser Mineralwasser mit Kohlensäure (24x0.5L)', price: 18.50, unit: 'Harass' },
      { id: 'p18', name: 'Coca Cola Original Gastro Glas (24x33cl)', price: 21.00, unit: 'Harass' },
      { id: 'p19', name: 'Primitivo di Manduria DOC (6x75cl)', price: 78.00, unit: 'Karton' }
    ]
  },
  {
    id: 'sup-5',
    name: 'Bäckerei Merz & Rustico',
    category: 'Bäckerei & Teigwaren (Fırın & Unlu Mamüller)',
    contactPerson: 'Reto Merz',
    phone: '+41 44 710 44 22',
    email: 'baeckerei@merz-gastro.ch',
    whatsapp: '+41794441122',
    deliveryDays: ['Täglich (Mo-So früh)'],
    minOrderChf: 50,
    rating: 4.9,
    address: 'Limmatquai 88, 8001 Zürich',
    notes: 'Ofenfrisch bis 07:00 Uhr morgens geliefert',
    catalog: [
      { id: 'p20', name: 'Buttergipfeli Gourmet (20 Stück)', price: 26.00, unit: 'Karton' },
      { id: 'p21', name: 'Rustico Bürli gemischt (30 Stück)', price: 32.00, unit: 'Korb' },
      { id: 'p22', name: 'Burger Buns Brioche getoastet (24 Stück)', price: 28.50, unit: 'Karton' },
      { id: 'p23', name: 'Pide & Sesam Fladenbrot frisch', price: 2.40, unit: 'Stück' }
    ]
  },
  {
    id: 'sup-6',
    name: 'HygieneProfi & CleanCare AG',
    category: 'Hygiene, HACCP & Verpackung (Temizlik & Sarf)',
    contactPerson: 'Ursula Graf',
    phone: '+41 44 905 60 70',
    email: 'service@cleancare.ch',
    whatsapp: '+41768882233',
    deliveryDays: ['Mittwoch'],
    minOrderChf: 150,
    rating: 4.8,
    address: 'Gewerbestrasse 7, 8600 Dübendorf',
    notes: 'HACCP-zertifizierte Desinfektionsmittel & Papierwaren',
    catalog: [
      { id: 'p24', name: 'Gastro Geschirrspülmittel Konzentrat 10L', price: 48.00, unit: 'Kanister' },
      { id: 'p25', name: 'Küchenrollen 3-lagig reissfest (32 Rollen)', price: 34.50, unit: 'Pack' },
      { id: 'p26', name: 'Flächendesinfektion HACCP 5L Kanister', price: 39.00, unit: 'Kanister' },
      { id: 'p27', name: 'Einweghandschuhe Nitril Schwarz (100er)', price: 12.50, unit: 'Box' }
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

