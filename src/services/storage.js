import {
  SEED_DEPARTMENTS,
  SEED_SUPPLIERS,
  SEED_EMPLOYEES,
  SEED_SHIFTS,
  SEED_INVOICES,
  SEED_TIME_LOGS,
  SEED_HACCP_CHECKLISTS,
  SEED_TEMPERATURE_LOGS,
  SEED_BULLETINS
} from './seedData';
import { SyncService } from './syncService';

const STORAGE_KEYS = {
  SUPPLIERS: 'ado_suppliers_v1',
  ORDERS: 'ado_orders_v1',
  EMPLOYEES: 'ado_employees_v1',
  SHIFTS: 'ado_shifts_v1',
  TIME_LOGS: 'ado_timelogs_v1',
  SICK_REPORTS: 'ado_sickreports_v1',
  LEAVE_REQUESTS: 'ado_leaverequests_v1',
  INVOICES: 'ado_invoices_v1',
  CURRENT_USER: 'ado_current_user_v1',
  NOTIFICATIONS: 'ado_notifications_v1',
  APP_LANG: 'ado_app_lang_v1',
  HACCP_CHECKLISTS: 'ado_haccp_checklists_v1',
  TEMPERATURE_LOGS: 'ado_temperature_logs_v1',
  BULLETINS: 'ado_bulletins_v1',
  CUSTOM_AVATARS: 'ado_custom_avatars_v1'
};

export const initializeDatabase = () => {
  if (!localStorage.getItem(STORAGE_KEYS.SUPPLIERS)) {
    localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(SEED_SUPPLIERS));
  }
  
  const rawEmps = getStoredItem(STORAGE_KEYS.EMPLOYEES, null);
  if (!rawEmps) {
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(SEED_EMPLOYEES));
  } else {
    const cleaned = rawEmps.map(emp => ({ ...emp, vacationUsed: 0 }));
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(cleaned));
  }

  localStorage.setItem(STORAGE_KEYS.SHIFTS, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.TIME_LOGS, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.SICK_REPORTS, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.LEAVE_REQUESTS, JSON.stringify([]));

  if (!localStorage.getItem(STORAGE_KEYS.INVOICES)) {
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(SEED_INVOICES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([
      {
        id: 'ord-101',
        supplierId: 'sup-1',
        supplierName: 'Metzgerei Keller & Söhne',
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        deliveryDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        status: 'bestellt',
        totalAmount: 512.00,
        items: [
          { name: 'Rindsfilet CH Premium (kg)', quantity: 5, unit: 'kg', price: 68.50 },
          { name: 'Pouletbrust Schweiz (kg)', quantity: 7, unit: 'kg', price: 24.50 }
        ],
        notes: 'Bitte vakuumieren in 1kg Paketen'
      }
    ]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SICK_REPORTS)) {
    localStorage.setItem(STORAGE_KEYS.SICK_REPORTS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.LEAVE_REQUESTS)) {
    localStorage.setItem(STORAGE_KEYS.LEAVE_REQUESTS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([
      {
        id: 'notif-1',
        type: 'info',
        title: 'Willkommen bei ADO Enterprise',
        message: 'System ist online und einsatzbereit. Datenbank lokal synchronisiert.',
        timestamp: new Date().toISOString(),
        read: false
      }
    ]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(SEED_EMPLOYEES[0]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.APP_LANG)) {
    localStorage.setItem(STORAGE_KEYS.APP_LANG, 'de');
  }
  if (!localStorage.getItem(STORAGE_KEYS.HACCP_CHECKLISTS)) {
    localStorage.setItem(STORAGE_KEYS.HACCP_CHECKLISTS, JSON.stringify(SEED_HACCP_CHECKLISTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.TEMPERATURE_LOGS)) {
    localStorage.setItem(STORAGE_KEYS.TEMPERATURE_LOGS, JSON.stringify(SEED_TEMPERATURE_LOGS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.BULLETINS)) {
    localStorage.setItem(STORAGE_KEYS.BULLETINS, JSON.stringify([]));
  }

  SyncService.clearAllShiftsInDb().then(() => SyncService.clearAllTimeLogsInDb()).then(() => SyncService.pushAllEmployees()).then(() => SyncService.syncAll()).catch(() => {});
};

export const getStoredItem = (key, fallback = []) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (err) {
    console.error(`Error reading ${key}:`, err);
    return fallback;
  }
};

export const setStoredItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event('ado_db_update'));
  } catch (err) {
    console.error(`Error saving ${key}:`, err);
  }
};

export const StorageService = {
  getSuppliers: () => {
    const rawList = getStoredItem(STORAGE_KEYS.SUPPLIERS, SEED_SUPPLIERS);
    if (!Array.isArray(rawList)) return SEED_SUPPLIERS;
    
    const deduplicated = [];
    const seenNames = new Map();
    const normalize = (name) => (name || '').toLowerCase().replace(/[^a-z0-9]/g, '');

    for (const sup of rawList) {
      if (!sup || !sup.name) continue;
      const key = normalize(sup.name);
      
      let existingKey = null;
      for (const k of seenNames.keys()) {
        if (k === key || (k.length > 5 && key.length > 5 && (k.includes(key) || key.includes(k)))) {
          existingKey = k;
          break;
        }
      }

      if (existingKey) {
        const existing = seenNames.get(existingKey);
        const existingCatLen = existing.catalog?.length || 0;
        const supCatLen = sup.catalog?.length || 0;
        if (supCatLen > existingCatLen) {
          const idx = deduplicated.findIndex(s => s.id === existing.id);
          if (idx >= 0) deduplicated[idx] = sup;
          seenNames.set(existingKey, sup);
        }
      } else {
        seenNames.set(key, sup);
        deduplicated.push(sup);
      }
    }

    return deduplicated.length > 0 ? deduplicated : SEED_SUPPLIERS;
  },
  saveSupplier: (supplier) => {
    const list = StorageService.getSuppliers();
    const existingIndex = list.findIndex(s => s.id === supplier.id);
    let targetSupplier = supplier;
    if (existingIndex >= 0) {
      list[existingIndex] = supplier;
    } else {
      targetSupplier = { ...supplier, id: supplier.id || `sup-${Date.now()}` };
      list.push(targetSupplier);
    }
    setStoredItem(STORAGE_KEYS.SUPPLIERS, list);
    SyncService.pushSupplier(targetSupplier);
    return list;
  },

  deleteSupplier: (supplierId) => {
    const list = StorageService.getSuppliers().filter(s => s.id !== supplierId);
    setStoredItem(STORAGE_KEYS.SUPPLIERS, list);
    SyncService.deleteSupplierInDb(supplierId);
    return list;
  },

  getOrders: () => getStoredItem(STORAGE_KEYS.ORDERS, []),
  addOrder: (order) => {
    const list = StorageService.getOrders();
    const newOrder = {
      ...order,
      id: `ord-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    list.unshift(newOrder);
    setStoredItem(STORAGE_KEYS.ORDERS, list);
    
    StorageService.addNotification({
      type: 'order',
      title: `Neue Bestellung an ${newOrder.supplierName}`,
      message: `Bestellwert: CHF ${newOrder.totalAmount.toFixed(2)} - Status: ${newOrder.status}`
    });

    return newOrder;
  },
  updateOrderStatus: (orderId, newStatus) => {
    const list = StorageService.getOrders();
    const order = list.find(o => o.id === orderId);
    if (order) {
      order.status = newStatus;
      setStoredItem(STORAGE_KEYS.ORDERS, list);
    }
    return list;
  },

  setCustomAvatar: (empIdOrPin, base64Data) => {
    const map = getStoredItem(STORAGE_KEYS.CUSTOM_AVATARS, {});
    if (empIdOrPin) {
      map[String(empIdOrPin)] = base64Data;
      setStoredItem(STORAGE_KEYS.CUSTOM_AVATARS, map);
    }
  },

  getEmployees: () => {
    const list = getStoredItem(STORAGE_KEYS.EMPLOYEES, SEED_EMPLOYEES);
    const customAvatars = getStoredItem(STORAGE_KEYS.CUSTOM_AVATARS, {});
    return list.map(emp => {
      let title = emp.jobTitle || emp.role || '';
      if (title) {
        title = title.replace(/\s*\([^)]*(mutfak|servis|depo|temizlik)[^)]*\)/gi, '').trim();
      }
      const custom = customAvatars[emp.id] || customAvatars[String(emp.pin)] || customAvatars[emp.email];
      return {
        ...emp,
        jobTitle: title || emp.jobTitle || emp.role,
        avatar: custom || emp.avatar
      };
    });
  },

  saveEmployee: (employee) => {
    if (employee.avatar && employee.avatar.startsWith('data:image')) {
      const map = getStoredItem(STORAGE_KEYS.CUSTOM_AVATARS, {});
      if (employee.id) map[employee.id] = employee.avatar;
      if (employee.pin) map[String(employee.pin)] = employee.avatar;
      if (employee.email) map[employee.email] = employee.avatar;
      setStoredItem(STORAGE_KEYS.CUSTOM_AVATARS, map);
    }

    const list = getStoredItem(STORAGE_KEYS.EMPLOYEES, SEED_EMPLOYEES);
    const idx = list.findIndex(e => e.id === employee.id || (e.pin && employee.pin && String(e.pin) === String(employee.pin)));
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...employee };
    } else {
      list.push({ ...employee, id: employee.id || `emp-${Date.now()}` });
    }
    setStoredItem(STORAGE_KEYS.EMPLOYEES, list);

    const currentUser = StorageService.getCurrentUser();
    if (currentUser && (currentUser.id === employee.id || (currentUser.pin && employee.pin && String(currentUser.pin) === String(employee.pin)))) {
      StorageService.setCurrentUser({ ...currentUser, ...employee });
    }

    SyncService.pushEmployee(employee);
    return list;
  },

  getShifts: () => getStoredItem(STORAGE_KEYS.SHIFTS, SEED_SHIFTS),
  saveShift: (shift) => {
    const list = StorageService.getShifts();
    const idx = list.findIndex(s => s.id === shift.id);
    if (idx >= 0) {
      list[idx] = shift;
    } else {
      list.push({ ...shift, id: shift.id || `sh-${Date.now()}` });
    }
    setStoredItem(STORAGE_KEYS.SHIFTS, list);
    SyncService.pushShift(shift);
    return list;
  },
  deleteShift: (shiftId) => {
    const list = StorageService.getShifts().filter(s => s.id !== shiftId);
    setStoredItem(STORAGE_KEYS.SHIFTS, list);
    SyncService.deleteShiftInDb(shiftId);
    return list;
  },

  getTimeLogs: () => getStoredItem(STORAGE_KEYS.TIME_LOGS, []),
  clockIn: (employeeId) => {
    const list = StorageService.getTimeLogs();
    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toTimeString().split(' ')[0].substring(0, 5);
    
    const existing = list.find(l => l.employeeId === employeeId && l.date === today && !l.clockOut);
    if (existing) return existing;

    const newLog = {
      id: `tl-${Date.now()}`,
      employeeId,
      date: today,
      clockIn: nowTime,
      clockOut: null,
      breakMinutes: 0,
      status: 'working'
    };
    list.unshift(newLog);
    setStoredItem(STORAGE_KEYS.TIME_LOGS, list);
    SyncService.pushClockIn(newLog, employeeId);
    return newLog;
  },
  clockOut: (employeeId) => {
    const list = StorageService.getTimeLogs();
    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toTimeString().split(' ')[0].substring(0, 5);
    
    const active = list.find(l => l.employeeId === employeeId && l.date === today && !l.clockOut);
    if (active) {
      active.clockOut = nowTime;
      active.status = 'completed';
      setStoredItem(STORAGE_KEYS.TIME_LOGS, list);
      SyncService.pushClockOut(employeeId, nowTime);
      return active;
    }
    return null;
  },
  addBreakTime: (employeeId, minutes) => {
    const list = StorageService.getTimeLogs();
    const today = new Date().toISOString().split('T')[0];
    const active = list.find(l => l.employeeId === employeeId && l.date === today && !l.clockOut);
    if (active) {
      active.breakMinutes = (active.breakMinutes || 0) + minutes;
      setStoredItem(STORAGE_KEYS.TIME_LOGS, list);
    }
    return active;
  },

  getSickReports: () => getStoredItem(STORAGE_KEYS.SICK_REPORTS, []),
  addSickReport: (report) => {
    const list = StorageService.getSickReports();
    const newReport = {
      ...report,
      id: `sick-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'gemeldet'
    };
    list.unshift(newReport);
    setStoredItem(STORAGE_KEYS.SICK_REPORTS, list);

    SyncService.pushSickLeave(newReport);

    const shifts = StorageService.getShifts();
    shifts.forEach(s => {
      if (s.employeeId === report.employeeId && s.date >= report.startDate && s.date <= report.endDate) {
        s.status = 'sick';
        s.sickReason = report.reason;
      }
    });
    setStoredItem(STORAGE_KEYS.SHIFTS, shifts);

    StorageService.addNotification({
      type: 'warning',
      title: `🚨 KRANKMELDUNG: ${report.employeeName}`,
      message: `Grund: ${report.reason} (${report.startDate} bis ${report.endDate}). Schichtausfall erfordert Ersatz!`
    });

    return newReport;
  },

  getLeaveRequests: () => getStoredItem(STORAGE_KEYS.LEAVE_REQUESTS, []),
  addLeaveRequest: (req) => {
    const list = StorageService.getLeaveRequests();
    const newReq = {
      ...req,
      id: `leave-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    list.unshift(newReq);
    setStoredItem(STORAGE_KEYS.LEAVE_REQUESTS, list);

    StorageService.addNotification({
      type: 'info',
      title: `Urlaubsantrag: ${req.employeeName}`,
      message: `${req.days} Tage von ${req.startDate} bis ${req.endDate} angefragt.`
    });

    return newReq;
  },
  updateLeaveStatus: (requestId, status) => {
    const list = StorageService.getLeaveRequests();
    const req = list.find(r => r.id === requestId);
    if (req) {
      req.status = status;
      setStoredItem(STORAGE_KEYS.LEAVE_REQUESTS, list);

      if (status === 'approved') {
        const employees = StorageService.getEmployees();
        const emp = employees.find(e => e.id === req.employeeId);
        if (emp) {
          emp.vacationUsed = (emp.vacationUsed || 0) + (req.days || 1);
          setStoredItem(STORAGE_KEYS.EMPLOYEES, employees);
        }
      }
    }
    return list;
  },

  getInvoices: () => getStoredItem(STORAGE_KEYS.INVOICES, SEED_INVOICES),
  addInvoice: (invoice) => {
    const list = StorageService.getInvoices();
    const newInv = {
      ...invoice,
      id: `inv-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    list.unshift(newInv);
    setStoredItem(STORAGE_KEYS.INVOICES, list);
    SyncService.pushInvoice(newInv);

    StorageService.addNotification({
      type: 'invoice',
      title: `Neue Rechnung erfasst: ${newInv.supplierName}`,
      message: `Betrag: CHF ${newInv.totalAmount.toFixed(2)} - Fällig am: ${newInv.dueDate}`
    });

    return newInv;
  },
  updateInvoiceStatus: (invoiceId, status, paidDate = null, paymentAccount = null, paymentRef = null) => {
    const list = StorageService.getInvoices();
    const inv = list.find(i => i.id === invoiceId);
    if (inv) {
      inv.status = status;
      if (paidDate) inv.paidDate = paidDate;
      if (paymentAccount) inv.paymentAccount = paymentAccount;
      if (paymentRef) inv.paymentRef = paymentRef;
      setStoredItem(STORAGE_KEYS.INVOICES, list);
      SyncService.updateInvoiceStatusInDb(invoiceId, status, paidDate, paymentAccount, paymentRef);
    }
    return list;
  },

  getNotifications: () => getStoredItem(STORAGE_KEYS.NOTIFICATIONS, []),
  addNotification: (notif) => {
    const list = StorageService.getNotifications();
    list.unshift({
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false
    });
    setStoredItem(STORAGE_KEYS.NOTIFICATIONS, list.slice(0, 30));
  },
  markNotificationsRead: () => {
    const list = StorageService.getNotifications().map(n => ({ ...n, read: true }));
    setStoredItem(STORAGE_KEYS.NOTIFICATIONS, list);
  },

  getCurrentUser: () => {
    const user = getStoredItem(STORAGE_KEYS.CURRENT_USER, null);
    if (!user || user === 'guest') return null;
    let title = user.jobTitle || user.role || '';
    if (title) {
      title = title.replace(/\s*\([^)]*(mutfak|servis|depo|temizlik)[^)]*\)/gi, '').trim();
    }
    const customAvatars = getStoredItem(STORAGE_KEYS.CUSTOM_AVATARS, {});
    const custom = customAvatars[user.id] || customAvatars[String(user.pin)] || customAvatars[user.email];
    return {
      ...user,
      jobTitle: title || user.jobTitle || user.role,
      avatar: custom || user.avatar
    };
  },
  setCurrentUser: (user) => setStoredItem(STORAGE_KEYS.CURRENT_USER, user),
  logout: () => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify('guest'));
    window.dispatchEvent(new Event('ado_db_update'));
  },
  login: (email, password) => {
    const employees = StorageService.getEmployees();
    const found = employees.find(e => e.email.toLowerCase() === email.toLowerCase() && e.password === password);
    if (found) {
      StorageService.setCurrentUser(found);
      return { success: true, user: found };
    }
    return { success: false, error: 'E-Mail oder Passwort ungültig.' };
  },
  loginWithPin: (pin) => {
    const employees = StorageService.getEmployees();
    const found = employees.find(e => e.pin === pin || (e.role === 'admin' && pin === '9999'));
    if (found) {
      StorageService.setCurrentUser(found);
      return { success: true, user: found };
    }
    return { success: false, error: 'Ungültige PIN (Demo: 1001-1006 / 9999)' };
  },
  clockWithPin: (pin, action) => {
    const employees = StorageService.getEmployees();
    const found = employees.find(e => e.pin === pin || (e.role === 'admin' && pin === '9999'));
    if (!found) {
      return { success: false, error: 'Ungültige PIN' };
    }
    let result = null;
    if (action === 'in') {
      result = StorageService.clockIn(found.id);
    } else if (action === 'out') {
      result = StorageService.clockOut(found.id);
    } else if (action === 'break') {
      result = StorageService.addBreakTime(found.id, 30);
    }
    return { success: true, user: found, result };
  },

  getHaccpChecklists: () => getStoredItem(STORAGE_KEYS.HACCP_CHECKLISTS, SEED_HACCP_CHECKLISTS),
  toggleHaccpItem: (id, employeeName) => {
    const list = StorageService.getHaccpChecklists();
    const item = list.find(i => i.id === id);
    if (item) {
      item.done = !item.done;
      item.completedBy = item.done ? employeeName : null;
      item.time = item.done ? new Date().toTimeString().substring(0, 5) : null;
      setStoredItem(STORAGE_KEYS.HACCP_CHECKLISTS, list);
    }
    return list;
  },
  addHaccpItem: (item) => {
    const list = StorageService.getHaccpChecklists();
    const newItem = {
      ...item,
      id: `chk-${Date.now()}`,
      done: false,
      date: new Date().toISOString().split('T')[0]
    };
    list.push(newItem);
    setStoredItem(STORAGE_KEYS.HACCP_CHECKLISTS, list);
    return list;
  },

  getTemperatureLogs: () => getStoredItem(STORAGE_KEYS.TEMPERATURE_LOGS, SEED_TEMPERATURE_LOGS),
  updateTemperature: (id, temp, employeeName) => {
    const list = StorageService.getTemperatureLogs();
    const log = list.find(l => l.id === id);
    if (log) {
      log.currentTemp = parseFloat(temp);
      log.checkedBy = employeeName;
      log.checkedAt = new Date().toTimeString().substring(0, 5);
      log.date = new Date().toISOString().split('T')[0];
      if (log.location.includes('Tiefkühler')) {
        log.status = log.currentTemp <= -17 ? 'ok' : 'warning';
      } else {
        log.status = (log.currentTemp >= 1.0 && log.currentTemp <= 6.0) ? 'ok' : 'warning';
      }
      setStoredItem(STORAGE_KEYS.TEMPERATURE_LOGS, list);
      SyncService.updateTemperatureInDb(id, temp, employeeName);
    }
    return list;
  },

  getBulletins: () => getStoredItem(STORAGE_KEYS.BULLETINS, []),
  addBulletin: (bulletin) => {
    const list = StorageService.getBulletins();
    const newBul = {
      ...bulletin,
      id: `bul-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      views: 1
    };
    list.unshift(newBul);
    setStoredItem(STORAGE_KEYS.BULLETINS, list);
    SyncService.pushBulletin(newBul);
    return newBul;
  },

  getLanguage: () => localStorage.getItem(STORAGE_KEYS.APP_LANG) || 'de',
  setLanguage: (lang) => {
    localStorage.setItem(STORAGE_KEYS.APP_LANG, lang);
    window.dispatchEvent(new Event('ado_db_update'));
  },

  exportDatabaseJSON: () => {
    const dump = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      suppliers: StorageService.getSuppliers(),
      orders: StorageService.getOrders(),
      employees: StorageService.getEmployees(),
      shifts: StorageService.getShifts(),
      timeLogs: StorageService.getTimeLogs(),
      sickReports: StorageService.getSickReports(),
      leaveRequests: StorageService.getLeaveRequests(),
      invoices: StorageService.getInvoices()
    };
    return JSON.stringify(dump, null, 2);
  },
  importDatabaseJSON: (jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      if (data.suppliers) setStoredItem(STORAGE_KEYS.SUPPLIERS, data.suppliers);
      if (data.orders) setStoredItem(STORAGE_KEYS.ORDERS, data.orders);
      if (data.employees) setStoredItem(STORAGE_KEYS.EMPLOYEES, data.employees);
      if (data.shifts) setStoredItem(STORAGE_KEYS.SHIFTS, data.shifts);
      if (data.timeLogs) setStoredItem(STORAGE_KEYS.TIME_LOGS, data.timeLogs);
      if (data.sickReports) setStoredItem(STORAGE_KEYS.SICK_REPORTS, data.sickReports);
      if (data.leaveRequests) setStoredItem(STORAGE_KEYS.LEAVE_REQUESTS, data.leaveRequests);
      if (data.invoices) setStoredItem(STORAGE_KEYS.INVOICES, data.invoices);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },
  resetToDefaults: () => {
    localStorage.removeItem(STORAGE_KEYS.SUPPLIERS);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.EMPLOYEES);
    localStorage.removeItem(STORAGE_KEYS.SHIFTS);
    localStorage.removeItem(STORAGE_KEYS.TIME_LOGS);
    localStorage.removeItem(STORAGE_KEYS.SICK_REPORTS);
    localStorage.removeItem(STORAGE_KEYS.LEAVE_REQUESTS);
    localStorage.removeItem(STORAGE_KEYS.INVOICES);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    initializeDatabase();
    window.dispatchEvent(new Event('ado_db_update'));
  }
};
