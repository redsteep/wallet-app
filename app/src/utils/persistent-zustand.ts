import { type StateStorage } from "zustand/middleware";
import { storage } from "@wallet/universal-storage";

export const persistentZustandStorage: StateStorage = {
  setItem: async (name, value) => await storage.set(name, value),
  getItem: async (name) => (await storage.getString(name)) ?? null,
  removeItem: async (name) => await storage.delete(name),
};
