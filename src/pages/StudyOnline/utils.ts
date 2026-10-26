export function fmtFCFA(n: number) {
  return n === 0 ? 'Free' : Number(n).toLocaleString('en-US') + ' FCFA';
}

export function fmtDate(iso: string) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function sessionStatus(iso: string) {
  const now = new Date();
  const t = new Date(iso);
  const diffMin = (t.getTime() - now.getTime()) / 60000;
  if (diffMin < -90) return 'ended';
  if (diffMin <= 15 && diffMin >= -90) return 'live';
  return 'upcoming';
}

export const waLink = (phone: string, text?: string) => {
  if (!phone) return '';
  const digits = phone.replace(/[^\d]/g, '');
  return `https://wa.me/${digits}${text ? '?text=' + encodeURIComponent(text) : ''}`;
};

// Video Storage (IndexedDB)
const DB_NAME = 'phhipros-media';
const STORE_NAME = 'videos';
const MAX_VIDEO_MB = 50;
export const MAX_VIDEO_BYTES = MAX_VIDEO_MB * 1024 * 1024;

export const openVideoStore = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE_NAME);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
};

export const saveVideoBlob = async (id: string, blob: Blob): Promise<void> => {
  const idb = await openVideoStore();
  return new Promise((resolve, reject) => {
    const tx = idb.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(blob, id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};

export const loadVideoBlob = async (id: string): Promise<Blob | null> => {
  const idb = await openVideoStore();
  return new Promise((resolve, reject) => {
    const tx = idb.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).get(id);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
};

export const deleteVideoBlob = async (id: string): Promise<void> => {
  try {
    const idb = await openVideoStore();
    const tx = idb.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(id);
  } catch (e) {
    console.error('Failed to delete video blob', e);
  }
};

export const fmtSize = (bytes: number) => {
  if (!bytes) return '';
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? mb.toFixed(1) + ' MB' : Math.round(bytes / 1024) + ' KB';
};
