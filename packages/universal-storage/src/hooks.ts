import { useCallback, useEffect, useState } from "react";
import { Platform } from "react-native";
import {
  useMMKVBoolean,
  useMMKVNumber,
  useMMKVObject,
  useMMKVString,
} from "react-native-mmkv";
import { storage } from "./storage";

type StorageHookReturnType<T> = [value: T | undefined, setValue: (value?: T) => void];

type StorageHookFunction<T> = (key: string) => StorageHookReturnType<T>;

const isExtension =
  Platform.OS === "web" && typeof window.chrome?.runtime !== "undefined";

function createChromeStorageHook<T>(getter: (key: string) => Promise<T>) {
  if (!isExtension) {
    throw new Error(
      "createAsyncStorageHook can only be called within Chrome extension runtime",
    );
  }

  return (key: string): StorageHookReturnType<T> => {
    const [value, setValue] = useState<T>();

    useEffect(() => {
      (async () => setValue(await getter(key)))();
    }, [key]);

    useEffect(() => {
      const listener = (storageChanges: Record<string, chrome.storage.StorageChange>) => {
        if (key in storageChanges) {
          setValue(storageChanges[key].newValue);
        }
      };
      chrome.storage.local.onChanged.addListener(listener);
      return () => chrome.storage.local.onChanged.removeListener(listener);
    }, [key]);

    const updateValue = useCallback(
      async (newValue?: T) => {
        switch (typeof newValue) {
          case "number":
          case "string":
          case "boolean":
          case "object":
            await storage.set(key, newValue as never);
            break;

          case "undefined":
            await storage.delete(key);
            break;

          default:
            throw new Error(`MMKV: Type ${typeof newValue} is not supported!`);
        }
      },
      [key],
    );

    return [value as T, updateValue];
  };
}

export const usePersistedObject = <T extends object>(key: string) =>
  (isExtension
    ? createChromeStorageHook<T | undefined>(storage.getObject)(key)
    : useMMKVObject(key)) as StorageHookReturnType<T>;

export const usePersistedBoolean: StorageHookFunction<boolean> = isExtension
  ? createChromeStorageHook(storage.getBoolean)
  : useMMKVBoolean;

export const usePersistedString: StorageHookFunction<string> = isExtension
  ? createChromeStorageHook(storage.getString)
  : useMMKVString;

export const usePersistedNumber: StorageHookFunction<number> = isExtension
  ? createChromeStorageHook(storage.getNumber)
  : useMMKVNumber;
