import { useEffect, useCallback, useRef, useState } from "react";
import { openDB, IDBPDatabase } from "idb";

export interface QueuedMessage {
  id: string;
  content: string;
  timestamp: string;
  senderId: string;
  senderRole: string | null;
  recipientId: string | null;
  incidentId: string | null;
  imageUrl: string | null;
  status: "pending" | "sent" | "failed";
  tempId: string;
}

const DB_NAME = "dumasafe-chat";
const STORE_NAME = "offline-queue";

async function getDB(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    },
  });
}

export function useOfflineQueue() {
  const dbRef = useRef<IDBPDatabase | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [queueSize, setQueueSize] = useState(0);

  useEffect(() => {
    const init = async () => {
      dbRef.current = await getDB();
      const db = dbRef.current;
      const all = await db.getAll(STORE_NAME);
      setQueueSize(all.length);
    };
    init();
  }, []);

  const addToQueue = useCallback(async (msg: Omit<QueuedMessage, "id">): Promise<string> => {
    const db = dbRef.current || (await getDB());
    dbRef.current = db;
    const record: QueuedMessage = { ...msg, id: msg.tempId };
    await db.put(STORE_NAME, record);
    setQueueSize(await db.count(STORE_NAME));
    return record.id;
  }, []);

  const removeFromQueue = useCallback(async (id: string) => {
    const db = dbRef.current || (await getDB());
    dbRef.current = db;
    await db.delete(STORE_NAME, id);
    setQueueSize(await db.count(STORE_NAME));
  }, []);

  const updateStatus = useCallback(async (id: string, status: "sent" | "failed") => {
    const db = dbRef.current || (await getDB());
    dbRef.current = db;
    const existing = await db.get(STORE_NAME, id);
    if (existing) {
      existing.status = status;
      await db.put(STORE_NAME, existing);
    }
  }, []);

  const getQueue = useCallback(async (): Promise<QueuedMessage[]> => {
    const db = dbRef.current || (await getDB());
    dbRef.current = db;
    return db.getAll(STORE_NAME);
  }, []);

  const flushQueue = useCallback(async (sendFn?: (msg: QueuedMessage) => Promise<unknown>) => {
    const db = dbRef.current || (await getDB());
    dbRef.current = db;
    const queue = await db.getAll(STORE_NAME);
    const pending = queue.filter(m => m.status === "pending");
    for (const msg of pending) {
      try {
        if (sendFn) await sendFn(msg);
        await updateStatus(msg.id, "sent");
      } catch {
        await updateStatus(msg.id, "failed");
      }
    }
    setQueueSize(await db.count(STORE_NAME));
  }, [updateStatus]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return { isOnline, queueSize, addToQueue, removeFromQueue, updateStatus, getQueue, flushQueue };
}
