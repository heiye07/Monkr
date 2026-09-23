const DB_NAME = 'monkr-original-media';
const STORE_NAME = 'images';

function openDatabase(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, 1);
		request.onupgradeneeded = () => request.result.createObjectStore(STORE_NAME);
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}

export async function saveOriginalImage(key: string, blob: Blob): Promise<void> {
	const db = await openDatabase();
	try {
		await new Promise<void>((resolve, reject) => {
			const tx = db.transaction(STORE_NAME, 'readwrite');
			tx.objectStore(STORE_NAME).put(blob, key);
			tx.oncomplete = () => resolve();
			tx.onerror = () => reject(tx.error);
		});
	} finally {
		db.close();
	}
}

export async function loadOriginalImage(key: string): Promise<Blob | null> {
	const db = await openDatabase();
	try {
		return await new Promise<Blob | null>((resolve, reject) => {
			const request = db.transaction(STORE_NAME).objectStore(STORE_NAME).get(key);
			request.onsuccess = () => resolve(request.result ?? null);
			request.onerror = () => reject(request.error);
		});
	} finally {
		db.close();
	}
}
