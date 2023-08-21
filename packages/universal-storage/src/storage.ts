import { MMKV } from "react-native-mmkv";

const chromeStorage = window.chrome?.storage?.local;
const mmkvStorage = typeof chromeStorage === "undefined" ? new MMKV() : undefined;

async function getFromChromeStorage<T>(key: string) {
  const storageItems = await chromeStorage.get(key);
  return storageItems?.[key] as T | undefined;
}

export const storage = {
  async set(key: string, value: boolean | string | number | object) {
    if (mmkvStorage) {
      return mmkvStorage.set(
        key,
        typeof value === "object" ? JSON.stringify(value) : value,
      );
    } else {
      return await chromeStorage.set({
        [key]: value,
      });
    }
  },

  async delete(key: string) {
    if (mmkvStorage) {
      return mmkvStorage.delete(key);
    } else {
      return await chromeStorage.remove(key);
    }
  },

  async contains(key: string) {
    if (mmkvStorage) {
      return mmkvStorage.contains(key);
    }
    const storageItems = await chromeStorage.get(key);
    return key in storageItems;
  },

  async getObject<T = object>(key: string): Promise<T | undefined> {
    if (mmkvStorage) {
      try {
        const rawString = mmkvStorage.getString(key);
        return rawString ? JSON.parse(rawString) : undefined;
      } catch (error) {
        if (error instanceof SyntaxError) {
          console.error(`Invalid JSON string stored in "${key}" key:`, error);
        }
      }
    } else {
      return await getFromChromeStorage<T>(key);
    }
  },

  async getBoolean(key: string) {
    if (mmkvStorage) {
      return mmkvStorage.getBoolean(key);
    } else {
      return await getFromChromeStorage<boolean>(key);
    }
  },

  async getString(key: string) {
    if (mmkvStorage) {
      return mmkvStorage.getString(key);
    } else {
      return await getFromChromeStorage<string>(key);
    }
  },

  async getNumber(key: string) {
    if (mmkvStorage) {
      return mmkvStorage.getNumber(key);
    } else {
      return await getFromChromeStorage<number>(key);
    }
  },
};
