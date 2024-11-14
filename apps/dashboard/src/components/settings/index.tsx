'use client';

import {createContext, useContext, useState} from 'react';
import SettingsDialog from './dialog';

interface SettingsContextType {
  workspaceSlug: string;
  userId: string;

  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

interface SettingsProviderProps {
  children: React.ReactNode;
  workspaceSlug: string;
  userId: string;
}

export function SettingsProvider({
  children,
  userId,
  workspaceSlug
}: SettingsProviderProps) {
  const [open, setOpen] = useState(false);

  return (
    <SettingsContext.Provider value={{open, setOpen, workspaceSlug, userId}}>
      <SettingsDialog />
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }

  return context;
}
