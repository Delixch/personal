// Currency & Date Formatters for Swiss / European Enterprise

export const formatCurrency = (amount, currency = 'CHF') => {
  const num = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
  return `${currency} ${num.toLocaleString('de-CH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('de-CH', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (e) {
    return dateStr;
  }
};

export const formatDateTime = (dateStr) => {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    return `${d.toLocaleDateString('de-CH')} ${d.toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' })}`;
  } catch (e) {
    return dateStr;
  }
};

export const getWeekdayName = (dateStr, lang = 'de') => {
  const d = new Date(dateStr);
  if (lang === 'tr') {
    const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    return days[d.getDay()];
  }
  const days = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
  return days[d.getDay()];
};

export const calculateHoursWorked = (clockIn, clockOut, breakMins = 0) => {
  if (!clockIn) return 0;
  const [inH, inM] = clockIn.split(':').map(Number);
  const now = new Date();
  let outH = now.getHours();
  let outM = now.getMinutes();

  if (clockOut) {
    [outH, outM] = clockOut.split(':').map(Number);
  }

  let totalMinutes = (outH * 60 + outM) - (inH * 60 + inM) - breakMins;
  if (totalMinutes < 0) totalMinutes = 0;
  return Number((totalMinutes / 60).toFixed(2));
};
