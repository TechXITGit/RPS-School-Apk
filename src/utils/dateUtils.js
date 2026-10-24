// Date Formatting & Period Filter Utilities for RPS Admin Panel

/**
 * Formats a Date object or timestamp into standard date string (e.g. "22 Sep 2026")
 */
export function formatDate(dateInput) {
  if (!dateInput) return '-';

  let date;
  if (dateInput.toDate && typeof dateInput.toDate === 'function') {
    date = dateInput.toDate(); // Firestore Timestamp
  } else if (dateInput instanceof Date) {
    date = dateInput;
  } else if (typeof dateInput === 'number' || typeof dateInput === 'string') {
    date = new Date(dateInput);
  } else {
    return '-';
  }

  if (isNaN(date.getTime())) return '-';

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

/**
 * Formats a Date object or timestamp with time (e.g. "22 Sep 2026, 10:30 AM")
 */
export function formatDateTime(dateInput) {
  if (!dateInput) return '-';

  let date;
  if (dateInput.toDate && typeof dateInput.toDate === 'function') {
    date = dateInput.toDate();
  } else if (dateInput instanceof Date) {
    date = dateInput;
  } else {
    date = new Date(dateInput);
  }

  if (isNaN(date.getTime())) return '-';

  const dateStr = formatDate(date);
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;

  return `${dateStr}, ${hours}:${minutes} ${ampm}`;
}

/**
 * Returns YYYY-MM-DD string for attendance keys
 */
export function toDateKey(date = new Date()) {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Checks if a timestamp falls on today
 */
export function isToday(dateInput) {
  if (!dateInput) return false;
  const date = dateInput.toDate ? dateInput.toDate() : new Date(dateInput);
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

export default {
  formatDate,
  formatDateTime,
  toDateKey,
  isToday,
};
