/**
 * Date utilities for Belesu Order Management.
 * Accurately aligns date boundaries and timestamps with Indian Standard Time (IST / UTC+05:30).
 */

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

export interface DateRange {
  startDate: string; // ISO string in UTC
  endDate: string;   // ISO string in UTC
}

/**
 * Calculates start and end UTC timestamps for a given period in Indian Standard Time (IST).
 */
export function getISTDateRange(
  period: string,
  monthStr?: string | null,
  yearStr?: string | null
): DateRange | null {
  const now = new Date();
  const istNow = new Date(now.getTime() + IST_OFFSET_MS);

  const istYear = istNow.getUTCFullYear();
  const istMonth = istNow.getUTCMonth(); // 0-11
  const istDate = istNow.getUTCDate();
  const istDay = istNow.getUTCDay(); // 0 is Sunday, 1 is Monday...

  let startIST: Date | null = null;
  let endIST: Date | null = null;

  if (period === 'today') {
    startIST = new Date(Date.UTC(istYear, istMonth, istDate, 0, 0, 0, 0));
    endIST = new Date(Date.UTC(istYear, istMonth, istDate, 23, 59, 59, 999));
  } else if (period === 'yesterday') {
    startIST = new Date(Date.UTC(istYear, istMonth, istDate - 1, 0, 0, 0, 0));
    endIST = new Date(Date.UTC(istYear, istMonth, istDate - 1, 23, 59, 59, 999));
  } else if (period === 'this_week') {
    // Week starts Monday (1)
    const diffToMonday = istDay === 0 ? 6 : istDay - 1;
    startIST = new Date(Date.UTC(istYear, istMonth, istDate - diffToMonday, 0, 0, 0, 0));
    endIST = new Date(Date.UTC(istYear, istMonth, istDate, 23, 59, 59, 999));
  } else if (period === 'last_7_days') {
    startIST = new Date(Date.UTC(istYear, istMonth, istDate - 6, 0, 0, 0, 0));
    endIST = new Date(Date.UTC(istYear, istMonth, istDate, 23, 59, 59, 999));
  } else if (period === 'this_month') {
    startIST = new Date(Date.UTC(istYear, istMonth, 1, 0, 0, 0, 0));
    endIST = new Date(Date.UTC(istYear, istMonth + 1, 0, 23, 59, 59, 999));
  } else if (period === 'last_month') {
    startIST = new Date(Date.UTC(istYear, istMonth - 1, 1, 0, 0, 0, 0));
    endIST = new Date(Date.UTC(istYear, istMonth, 0, 23, 59, 59, 999));
  } else if (period === 'month_year' && monthStr && yearStr) {
    const m = parseInt(monthStr, 10) - 1;
    const y = parseInt(yearStr, 10);
    if (!isNaN(m) && !isNaN(y)) {
      startIST = new Date(Date.UTC(y, m, 1, 0, 0, 0, 0));
      endIST = new Date(Date.UTC(y, m + 1, 0, 23, 59, 59, 999));
    }
  }

  if (startIST && endIST) {
    return {
      startDate: new Date(startIST.getTime() - IST_OFFSET_MS).toISOString(),
      endDate: new Date(endIST.getTime() - IST_OFFSET_MS).toISOString(),
    };
  }

  return null;
}

export interface FormattedOrderDate {
  dateStr: string;       // e.g. "14 Nov 2026"
  dayName: string;       // e.g. "Sat"
  fullDayName: string;   // e.g. "Saturday"
  timeStr: string;       // e.g. "02:09 PM"
  relativeBadge: { label: string; color: string } | null;
  relativeText: string;  // e.g. "Today", "Yesterday", "3d ago"
  monthYear: string;     // e.g. "Nov 2026"
  weekNumber: number;    // e.g. 46
}

/**
 * Formats an order timestamp into Day, Week, Month, and Time components.
 */
export function formatOrderDate(dateInput: string | Date | undefined | null): FormattedOrderDate {
  if (!dateInput) {
    return {
      dateStr: '—',
      dayName: '',
      fullDayName: '',
      timeStr: '',
      relativeBadge: null,
      relativeText: '',
      monthYear: '',
      weekNumber: 0,
    };
  }

  const d = new Date(dateInput);
  if (isNaN(d.getTime())) {
    return {
      dateStr: '—',
      dayName: '',
      fullDayName: '',
      timeStr: '',
      relativeBadge: null,
      relativeText: '',
      monthYear: '',
      weekNumber: 0,
    };
  }

  const dateStr = d.toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const dayName = d.toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'short',
  });

  const fullDayName = d.toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'long',
  });

  const timeStr = d.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const monthYear = d.toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    month: 'short',
    year: 'numeric',
  });

  // Calculate IST relative boundaries
  const now = new Date();
  const istNow = new Date(now.getTime() + IST_OFFSET_MS);
  const targetIST = new Date(d.getTime() + IST_OFFSET_MS);

  const isToday =
    istNow.getUTCFullYear() === targetIST.getUTCFullYear() &&
    istNow.getUTCMonth() === targetIST.getUTCMonth() &&
    istNow.getUTCDate() === targetIST.getUTCDate();

  const yesterdayIST = new Date(istNow.getTime() - 24 * 60 * 60 * 1000);
  const isYesterday =
    yesterdayIST.getUTCFullYear() === targetIST.getUTCFullYear() &&
    yesterdayIST.getUTCMonth() === targetIST.getUTCMonth() &&
    yesterdayIST.getUTCDate() === targetIST.getUTCDate();

  // Week number calculation (ISO week)
  const dCopy = new Date(Date.UTC(targetIST.getUTCFullYear(), targetIST.getUTCMonth(), targetIST.getUTCDate()));
  const dayNum = dCopy.getUTCDay() || 7;
  dCopy.setUTCDate(dCopy.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(dCopy.getUTCFullYear(), 0, 1));
  const weekNumber = Math.ceil(((dCopy.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);

  // Check if target is in current week
  const dayOfWeek = istNow.getUTCDay();
  const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const startOfWeekIST = new Date(Date.UTC(istNow.getUTCFullYear(), istNow.getUTCMonth(), istNow.getUTCDate() - diffToMonday));
  const isThisWeek = targetIST >= startOfWeekIST && !isToday && !isYesterday;

  let relativeBadge: { label: string; color: string } | null = null;
  let relativeText = '';

  if (isToday) {
    relativeBadge = {
      label: 'Today',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    };
    relativeText = 'Today';
  } else if (isYesterday) {
    relativeBadge = {
      label: 'Yesterday',
      color: 'bg-blue-50 text-blue-700 border-blue-200',
    };
    relativeText = 'Yesterday';
  } else if (isThisWeek) {
    relativeBadge = {
      label: 'This Week',
      color: 'bg-purple-50 text-purple-700 border-purple-200',
    };
    relativeText = 'This Week';
  } else {
    const diffDays = Math.floor((istNow.getTime() - targetIST.getTime()) / (24 * 60 * 60 * 1000));
    if (diffDays <= 30) {
      relativeText = `${diffDays}d ago`;
    } else {
      const diffMonths = Math.floor(diffDays / 30);
      relativeText = diffMonths <= 1 ? '1 mo ago' : `${diffMonths} mos ago`;
    }
  }

  return {
    dateStr,
    dayName,
    fullDayName,
    timeStr,
    relativeBadge,
    relativeText,
    monthYear,
    weekNumber,
  };
}

/**
 * Generates the list of past N months for easy month-based filtering.
 */
export function getAvailableMonths(count: number = 24) {
  const months: { label: string; value: string; month: number; year: number }[] = [];
  const now = new Date();
  const istNow = new Date(now.getTime() + IST_OFFSET_MS);

  let currentYear = istNow.getUTCFullYear();
  let currentMonth = istNow.getUTCMonth(); // 0-indexed

  for (let i = 0; i < count; i++) {
    const d = new Date(Date.UTC(currentYear, currentMonth, 1));
    const label = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const value = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
    months.push({
      label,
      value,
      month: currentMonth + 1,
      year: currentYear,
    });

    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
  }

  return months;
}
