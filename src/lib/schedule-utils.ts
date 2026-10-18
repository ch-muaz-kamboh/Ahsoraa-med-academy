import { ScheduleItem } from '@/types';

/**
 * Robust date/time parser for schedule items to enable automatic date-wise sorting.
 * Handles formats like YYYY-MM-DD, MM/DD/YYYY, DD/MM/YYYY, ISO strings, and extracts start time.
 */
export function parseScheduleDateTime(dateStr?: string, timeStr?: string): number {
  if (!dateStr) return 0;
  const trimmedDate = dateStr.trim();
  let year = 0;
  let month = 0;
  let day = 0;

  // Pattern: YYYY-MM-DD or YYYY/MM/DD
  if (/^\d{4}[-/]\d{1,2}[-/]\d{1,2}/.test(trimmedDate)) {
    const parts = trimmedDate.split(/[-/T]/);
    year = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10) - 1;
    day = parseInt(parts[2], 10);
  }
  // Pattern: MM/DD/YYYY or DD/MM/YYYY
  else if (/^\d{1,2}[-/]\d{1,2}[-/]\d{4}/.test(trimmedDate)) {
    const parts = trimmedDate.split(/[-/]/);
    const p0 = parseInt(parts[0], 10);
    const p1 = parseInt(parts[1], 10);
    const p2 = parseInt(parts[2], 10);
    if (p0 > 12) {
      // DD/MM/YYYY
      day = p0;
      month = p1 - 1;
      year = p2;
    } else {
      // MM/DD/YYYY
      month = p0 - 1;
      day = p1;
      year = p2;
    }
  } else {
    const ts = Date.parse(trimmedDate);
    if (!isNaN(ts)) return ts;
    return 0;
  }

  let hours = 0;
  let minutes = 0;

  if (timeStr) {
    // Extract first time pattern like "17:00", "09:30", "5:00 PM"
    const match = timeStr.match(/(\d{1,2}):(\d{2})(?:\s*(AM|PM))?/i);
    if (match) {
      hours = parseInt(match[1], 10);
      minutes = parseInt(match[2], 10);
      const meridiem = match[3]?.toUpperCase();
      if (meridiem === 'PM' && hours < 12) hours += 12;
      if (meridiem === 'AM' && hours === 12) hours = 0;
    }
  }

  const d = new Date(year, month, day, hours, minutes, 0, 0);
  const time = d.getTime();
  return isNaN(time) ? 0 : time;
}

/**
 * Sorts an array of schedule items date-wise.
 * @param items List of ScheduleItems
 * @param order 'asc' (earliest date first) or 'desc' (latest date first)
 */
export function sortSchedulesByDate(items: ScheduleItem[], order: 'asc' | 'desc' = 'asc'): ScheduleItem[] {
  return [...items].sort((a, b) => {
    const timeA = parseScheduleDateTime(a.date, a.time);
    const timeB = parseScheduleDateTime(b.date, b.time);

    if (timeA === 0 && timeB === 0) {
      // fallback to created_at
      const createdA = a.createdAt ? Date.parse(a.createdAt) : 0;
      const createdB = b.createdAt ? Date.parse(b.createdAt) : 0;
      return order === 'asc' ? createdA - createdB : createdB - createdA;
    }

    if (timeA === 0) return 1;
    if (timeB === 0) return -1;

    return order === 'asc' ? timeA - timeB : timeB - timeA;
  });
}
