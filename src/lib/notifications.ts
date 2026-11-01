export interface StudentPortalNotification {
  id: string;
  studentEmail: string;
  type: 'medpath_rejected' | 'medpath_approved' | 'medpath_update' | 'general';
  title: string;
  message: string;
  stageKey?: string;
  stageLabel?: string;
  level: 'urgent' | 'success' | 'info' | 'warning';
  createdAt: string;
  read: boolean;
  actionUrl?: string;
}

const NOTIFICATIONS_PREFIX = 'ahsora_notifications_';
const GLOBAL_NOTIFICATIONS_KEY = 'ahsora_student_notifications';

export function getStudentNotifications(email?: string): StudentPortalNotification[] {
  if (typeof window === 'undefined') return [];
  try {
    const emailKey = email ? email.toLowerCase().trim() : '';
    let list: StudentPortalNotification[] = [];

    if (emailKey) {
      const stored = localStorage.getItem(`${NOTIFICATIONS_PREFIX}${emailKey}`);
      if (stored) {
        list = JSON.parse(stored);
      }
    }

    if (!list || list.length === 0) {
      const globalStored = localStorage.getItem(GLOBAL_NOTIFICATIONS_KEY);
      if (globalStored) {
        const parsed: StudentPortalNotification[] = JSON.parse(globalStored);
        if (emailKey) {
          list = parsed.filter(
            (n) => !n.studentEmail || n.studentEmail.toLowerCase().trim() === emailKey
          );
        } else {
          list = parsed;
        }
      }
    }

    return Array.isArray(list)
      ? list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      : [];
  } catch (e) {
    console.warn('Failed to parse notifications:', e);
    return [];
  }
}

export function saveStudentNotifications(email: string, notifications: StudentPortalNotification[]) {
  if (typeof window === 'undefined') return;
  try {
    const emailKey = email.toLowerCase().trim();
    if (emailKey) {
      localStorage.setItem(`${NOTIFICATIONS_PREFIX}${emailKey}`, JSON.stringify(notifications));
    }

    // Also update global list
    const globalStored = localStorage.getItem(GLOBAL_NOTIFICATIONS_KEY);
    let all: StudentPortalNotification[] = globalStored ? JSON.parse(globalStored) : [];
    // remove existing ones with same ids
    const notifIds = new Set(notifications.map((n) => n.id));
    all = all.filter((n) => !notifIds.has(n.id));
    all = [...notifications, ...all].slice(0, 100);
    localStorage.setItem(GLOBAL_NOTIFICATIONS_KEY, JSON.stringify(all));

    window.dispatchEvent(new CustomEvent('ahsora_portal_notifications_updated', { detail: notifications }));
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    console.warn('Failed to save notifications:', e);
  }
}

export function addStudentNotification(
  notif: Omit<StudentPortalNotification, 'id' | 'createdAt' | 'read'>
): StudentPortalNotification {
  const email = (notif.studentEmail || '').toLowerCase().trim();
  const current = getStudentNotifications(email);

  const newNotif: StudentPortalNotification = {
    ...notif,
    id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
    read: false,
  };

  const updated = [newNotif, ...current].slice(0, 50);
  saveStudentNotifications(email, updated);
  return newNotif;
}

export function markNotificationAsRead(id: string, email?: string) {
  const current = getStudentNotifications(email);
  const updated = current.map((n) => (n.id === id ? { ...n, read: true } : n));
  if (email) {
    saveStudentNotifications(email, updated);
  }
}

export function markAllNotificationsAsRead(email?: string) {
  const current = getStudentNotifications(email);
  const updated = current.map((n) => ({ ...n, read: true }));
  if (email) {
    saveStudentNotifications(email, updated);
  }
}
