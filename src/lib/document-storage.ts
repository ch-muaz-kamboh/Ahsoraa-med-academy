// src/lib/document-storage.ts
// Robust IndexedDB storage for student documents (especially PDFs and large files)

const DB_NAME = 'AhsoraDocumentVaultDB';
const DB_VERSION = 1;
const STORE_NAME = 'student_document_files';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Window not available'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = (event: any) => {
      resolve(event.target.result);
    };

    request.onerror = (event: any) => {
      reject(event.target.error);
    };
  });
}

export async function saveDocumentFile(docId: string, fileData: string | Blob): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put({ id: docId, data: fileData, updatedAt: Date.now() });

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    console.warn('IndexedDB save fallback:', e);
  }
}

export async function getDocumentFile(docId: string): Promise<string | Blob | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(docId);

      req.onsuccess = () => {
        resolve(req.result?.data || null);
      };
      req.onerror = () => resolve(null);
    });
  } catch (e) {
    return null;
  }
}

export async function deleteDocumentFile(docId: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(docId);
      req.onsuccess = () => resolve();
      req.onerror = () => resolve();
    });
  } catch (e) {}
}

/**
 * Safely saves documents metadata to localStorage without throwing QuotaExceededError.
 * Trims huge data URLs from metadata if needed since file data is in IndexedDB.
 */
export function safeSaveDocumentsToLocalStorage(documents: any[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem('ahsora_student_documents', JSON.stringify(documents));
  } catch (quotaError) {
    console.warn('LocalStorage quota exceeded for documents. Storing lightweight metadata:', quotaError);
    // Strip large fileDataUrls for localStorage while retaining metadata
    const lightweight = documents.map((doc) => {
      if (doc.fileDataUrl && doc.fileDataUrl.length > 50000) {
        return {
          ...doc,
          hasIndexedDBFile: true,
          fileDataUrl: doc.fileDataUrl.slice(0, 100), // Marker prefix only
        };
      }
      return doc;
    });

    try {
      localStorage.setItem('ahsora_student_documents', JSON.stringify(lightweight));
    } catch (innerError) {
      console.error('Failed to store even lightweight document metadata:', innerError);
    }
  }
}
