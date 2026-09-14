export const SEED_DEPARTMENTS = [
  { id: 'kuche', name: 'Küche (Mutfak)', icon: 'ChefHat', color: 'emerald' },
  { id: 'service', name: 'Service (Servis)', icon: 'UtensilsCrossed', color: 'blue' },
  { id: 'bar', name: 'Bar & Lounge', icon: 'Wine', color: 'purple' },
  { id: 'lager', name: 'Lager & Logistik (Depo)', icon: 'Boxes', color: 'amber' },
  { id: 'reinigung', name: 'Reinigung & Hygiene (Temizlik)', icon: 'Sparkles', color: 'rose' }
];

export const SEED_EMPLOYEES = [
  {
    id: 'emp-1',
    name: 'Sarah Schmid',
    role: 'Küchenchefin',
    department: 'kuche',
    email: 'sarah.schmid@ado.ch',
    phone: '+41 79 123 45 67',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    color: 'emerald',
    vacationTotal: 25,
    vacationUsed: 0,
    targetHours: 182.5,
    workDays: ['Mo', 'Di', 'Mi', 'Do', 'Fr']
  },
  {
    id: 'emp-2',
    name: 'Mehmet Demir',
    role: 'Chef de Rang',
    department: 'service',
    email: 'mehmet.demir@ado.ch',
    phone: '+41 78 234 56 78',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    color: 'blue',
    vacationTotal: 25,
    vacationUsed: 0,
    targetHours: 182.5,
    workDays: ['Di', 'Mi', 'Do', 'Fr', 'Sa']
  },
  {
    id: 'emp-3',
    name: 'Canan Yılmaz',
    role: 'Barmaid & Service',
    department: 'bar',
    email: 'canan.yilmaz@ado.ch',
    phone: '+41 76 345 67 89',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    color: 'purple',
    vacationTotal: 20,
    vacationUsed: 0,
    targetHours: 146.0,
    workDays: ['Mi', 'Do', 'Fr', 'Sa', 'So']
  },
  {
    id: 'emp-4',
    name: 'Ali Kaya',
    role: 'Sous Chef',
    department: 'kuche',
    email: 'ali.kaya@ado.ch',
    phone: '+41 79 456 78 90',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    color: 'emerald',
    vacationTotal: 25,
    vacationUsed: 0,
    targetHours: 182.5,
    workDays: ['Mo', 'Di', 'Mi', 'Fr', 'Sa']
  },
  {
    id: 'emp-5',
    name: 'David Keller',
    role: 'Logistik & Einkauf',
    department: 'lager',
    email: 'david.keller@ado.ch',
    phone: '+41 77 567 89 01',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    color: 'amber',
    vacationTotal: 25,
    vacationUsed: 0,
    targetHours: 182.5,
    workDays: ['Mo', 'Di', 'Mi', 'Do', 'Fr']
  }
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
    email: 'info@frischeparadies.ch',
    whatsapp: '+41793221580',
    deliveryDays: ['Dienstag', 'Donnerstag', 'Samstag'],
    rating: 4.7,
    address: 'Grossmarktstrasse 10, 8048 Zürich',
    notes: 'Tagesfrisches Gemüse, Kräuter, Salat & Früchte',
    catalog: [
      { id: 'gem-1', name: 'Tomaten Strauch CH 5kg Karton', price: 18.50, unit: 'Karton' },
      { id: 'gem-2', name: 'Salatgurken CH (12 Stk)', price: 14.00, unit: 'Kiste' }
    ]
  }
];

export const SEED_SHIFTS = [];

export const SEED_INVOICES = [];

export const SEED_TIME_LOGS = [];

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

export const SEED_BULLETINS = [];

export const SHIFT_TYPES = {
  frueh: { name: 'Frühschicht', label: 'Frühschicht', labelTr: 'Erken Vardiya', start: '08:00', end: '16:30', time: '08:00 - 16:30', color: 'emerald', badgeColor: 'emerald' },
  spaet: { name: 'Spätschicht', label: 'Spätschicht', labelTr: 'Gece Vardiyası', start: '16:00', end: '00:30', time: '16:00 - 00:30', color: 'blue', badgeColor: 'blue' },
  ganztag: { name: 'Ganztags / Split', label: 'Ganztagsschicht', labelTr: 'Tüm Gün Vardiyası', start: '10:00', end: '22:30', time: '10:00 - 22:30', color: 'amber', badgeColor: 'amber' },
  nacht: { name: 'Nachtschicht', label: 'Nachtschicht', labelTr: 'Gece Vardiyası', start: '22:00', end: '06:30', time: '22:00 - 06:30', color: 'purple', badgeColor: 'purple' },
  frei: { name: 'Freitag / Ruhetag', label: 'Freitag / Ruhetag', labelTr: 'İzin Günü', start: 'Frei', end: '', time: 'Frei', color: 'slate', badgeColor: 'slate' },

  FRUEH: { name: 'Frühschicht', label: 'Frühschicht', labelTr: 'Erken Vardiya', start: '08:00', end: '16:30', time: '08:00 - 16:30', color: 'emerald', badgeColor: 'emerald' },
  SPAET: { name: 'Spätschicht', label: 'Spätschicht', labelTr: 'Gece Vardiyası', start: '16:00', end: '00:30', time: '16:00 - 00:30', color: 'blue', badgeColor: 'blue' },
  GANZTAG: { name: 'Ganztags / Split', label: 'Ganztagsschicht', labelTr: 'Tüm Gün Vardiyası', start: '10:00', end: '22:30', time: '10:00 - 22:30', color: 'amber', badgeColor: 'amber' },
  NACHT: { name: 'Nachtschicht', label: 'Nachtschicht', labelTr: 'Gece Vardiyası', start: '22:00', end: '06:30', time: '22:00 - 06:30', color: 'purple', badgeColor: 'purple' },
  FREI: { name: 'Freitag / Ruhetag', label: 'Freitag / Ruhetag', labelTr: 'İzin Günü', start: 'Frei', end: '', time: 'Frei', color: 'slate', badgeColor: 'slate' }
};

export const SICK_REASONS = [
  'Grippaler Infekt / Erkältung (Grip / Soğuk Algınlığı)',
  'Fieber & Schüttelfrost (Yüksek Ateş)',
  'Magen-Darm-Infektion (Mide & Bağırsak Rahatsızlığı)',
  'Arbeitsunfall / Verletzung (İş Kazası / Yaralanma)',
  'Akuter Zahnarzt- / Notfalltermin (Acil Diş / Doktor Randevusu)',
  'Migräne / Chronische Beschwerden (Migren / Kronik Ağrı)',
  'Rückenschmerzen / Hexenschuss (Bel / Sırt Ağrısı)',
  'Sonstige Erkrankung (Diğer Rahatsızlık)'
];
