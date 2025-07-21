import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface HistoryItem {
  id: string;
  text: string;
  timestamp: string;
  date: Date;
  imageUri?: string;
}

interface HistoryState {
  history: HistoryItem[];
  addItem: (text: string, imageUri?: string) => void;
  clearHistory: () => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      history: [],
      addItem: (text: string, imageUri?: string) => set((state) => {
        const now = new Date();
        const newItem: HistoryItem = {
          id: now.getTime().toString(),
          text,
          timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: now,
          imageUri,
        };
        return { history: [newItem, ...state.history] };
      }),
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'ocr-history',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
