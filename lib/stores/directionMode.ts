'use client';

import { create } from 'zustand';

export type DirectionMode = 'kichikyou' | 'houishin' | 'both' | 'all';

export const DIRECTION_MODE_STORAGE_KEY = 'direction_mode';

interface DirectionModeState {
  mode: DirectionMode;
  setMode: (value: DirectionMode) => void;
}

function saveDirectionMode(value: DirectionMode) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(DIRECTION_MODE_STORAGE_KEY, normalizeDirectionMode(value));
}

function normalizeDirectionMode(value: string | null): Exclude<DirectionMode, 'all'> {
  if (value === 'houishin') return 'houishin';
  if (value === 'both' || value === 'all') return 'both';
  return 'kichikyou';
}

function getInitialMode(): Exclude<DirectionMode, 'all'> {
  if (typeof window === 'undefined') return 'kichikyou';
  return normalizeDirectionMode(window.localStorage.getItem(DIRECTION_MODE_STORAGE_KEY));
}

export const useDirectionMode = create<DirectionModeState>((set) => ({
  mode: getInitialMode(),
  setMode: (value: DirectionMode) => {
    const mode = normalizeDirectionMode(value);
    set({ mode });
    saveDirectionMode(value);
  },
}));
