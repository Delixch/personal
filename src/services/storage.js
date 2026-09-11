import {
  SEED_DEPARTMENTS,
  SEED_SUPPLIERS,
  SEED_EMPLOYEES,
  SEED_SHIFTS,
  SEED_INVOICES,
  SEED_TIME_LOGS
} from './seedData';

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
  APP_LANG: 'ado_app_lang_v1'
};

// Local Database initialization with Seed Data
export const initializeDatabase = () => {
  if (!localStorage.getItem(STORAGE_KEYS.SUPPLIERS)) {
    localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(SEED_SUPPLIERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.EMPLOYEES)) {
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(SEED_EMPLOYEES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SHIFTS)) {
    localStorage.setItem(STORAGE_KEYS.SHIFTS, JSON.stringify(SEED_SHIFTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.INVOICES)) {
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(SEED_INVOICES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.TIME_LOGS)) {
    localStorage.setItem(STORAGE_KEYS.TIME_LOGS, JSON.stringify(SEED_TIME_LOGS));
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
    // Default to admin for first view, easily switchable
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(SEED_EMPLOYEES[0]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.APP_LANG)) {
    localStorage.setItem(STORAGE_KEYS.APP_LANG, 'de');
  }
};

// Generic Helpers
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

// Storage Service API
export const StorageService = {
  // Suppliers
  getSuppliers: () => getStoredItem(STORAGE_KEYS.SUPPLIERS, SEED_SUPPLIERS),
  saveSupplier: (supplier) => {
    const list = StorageService.getSuppliers();
    const existingIndex = list.findIndex(s => s.id === supplier.id);
    if (existingIndex >= 0) {
      list[existingIndex] = supplier;
    } else {
      list.push({ ...supplier, id: supplier.id || `sup-${Date.now()}` });
    }
    setStoredItem(STORAGE_KEYS.SUPPLIERS, list);
    return list;
  },

  // Orders
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
    
    // Add notification
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

  // Employees
  getEmployees: () => getStoredItem(STORAGE_KEYS.EMPLOYEES, SEED_EMPLOYEES),
  saveEmployee: (employee) => {
    const list = StorageService.getEmployees();
    const idx = list.findIndex(e => e.id === employee.id);
    if (idx >= 0) {
      list[idx] = employee;
    } else {
      list.push({ ...employee, id: employee.id || `emp-${Date.now()}` });
    }
    setStoredItem(STORAGE_KEYS.EMPLOYEES, list);
    return list;
  },

  // Shifts
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
    return list;
  },
  deleteShift: (shiftId) => {
    const list = StorageService.getShifts().filter(s => s.id !== shiftId);
    setStoredItem(STORAGE_KEYS.SHIFTS, list);
    return list;
  },

  // Time Logs (Stempeluhr)
  getTimeLogs: () => getStoredItem(STORAGE_KEYS.TIME_LOGS, []),
  clockIn: (employeeId) => {
    const list = StorageService.getTimeLogs();
    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toTimeString().split(' ')[0].substring(0, 5);
    
    // Check if open session exists
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

  // Sick Reports (Krankmeldung)
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

    // Automatically update shifts of this employee during the sick range!
    const shifts = StorageService.getShifts();
    shifts.forEach(s => {
      if (s.employeeId === report.employeeId && s.date >= report.startDate && s.date <= report.endDate) {
        s.status = 'sick';
        s.sickReason = report.reason;
      }
    });
    setStoredItem(STORAGE_KEYS.SHIFTS, shifts);

    // Create high-priority notification for Admin
    StorageService.addNotification({
      type: 'warning',
      title: `🚨 KRANKMELDUNG: ${report.employeeName}`,
      message: `Grund: ${report.reason} (${report.startDate} bis ${report.endDate}). Schichtausfall erfordert Ersatz!`
    });

    return newReport;
  },

  // Leave Requests (Urlaub & Frei)
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
        // deduct from vacation days
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

  // Invoices (Rechnungen & Scan)
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

    StorageService.addNotification({
      type: 'invoice',
      title: `Neue Rechnung erfasst: ${newInv.supplierName}`,
      message: `Betrag: CHF ${newInv.totalAmount.toFixed(2)} - Fällig am: ${newInv.dueDate}`
    });

    return newInv;
  },
  updateInvoiceStatus: (invoiceId, status, paidDate = null) => {
    const list = StorageService.getInvoices();
    const inv = list.find(i => i.id === invoiceId);
    if (inv) {
      inv.status = status;
      if (paidDate) inv.paidDate = paidDate;
      setStoredItem(STORAGE_KEYS.INVOICES, list);
    }
    return list;
  },

  // Notifications
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

  // Authentication & Session
  getCurrentUser: () => getStoredItem(STORAGE_KEYS.CURRENT_USER, SEED_EMPLOYEES[0]),
  setCurrentUser: (user) => setStoredItem(STORAGE_KEYS.CURRENT_USER, user),
  login: (email, password) => {
    const employees = StorageService.getEmployees();
    const found = employees.find(e => e.email.toLowerCase() === email.toLowerCase() && e.password === password);
    if (found) {
      StorageService.setCurrentUser(found);
      return { success: true, user: found };
    }
    return { success: false, error: 'E-Mail oder Passwort ungültig.' };
  },
  logout: () => {
    // Switch to null or login screen
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    window.dispatchEvent(new Event('ado_db_update'));
  },

  // Language
  getLanguage: () => localStorage.getItem(STORAGE_KEYS.APP_LANG) || 'de',
  setLanguage: (lang) => {
    localStorage.setItem(STORAGE_KEYS.APP_LANG, lang);
    window.dispatchEvent(new Event('ado_db_update'));
  },

  // Database Backup & Reset
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
