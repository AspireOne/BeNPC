import { InventoryItem, Stats } from "@/types/types";
import { create } from "zustand";

export type Store = {
  stats: Stats | undefined;
  inventoryItems: InventoryItem[];
  setStats: (stats: Stats) => void;
  setInventoryItems: (inventoryItems: InventoryItem[]) => void;
};

export const useGameStore = create<Store>((set, getState) => ({
  stats: undefined,
  inventoryItems: [],

  setStats: (stats: Stats) => set({ stats }),
  setInventoryItems: (inventoryItems: InventoryItem[]) => set({ inventoryItems }),
}));