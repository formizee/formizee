'use client';

import {createContext, useContext, useState} from 'react';
import SettingsDialog from './dialog';
import type {Route} from './pages';

interface SettingsContextType {
  workspaceSlug: string;
  userId: string;

  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;

  setRoute: React.Dispatch<React.SetStateAction<Route>>;
  route: Route;
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
  const [route, setRoute] = useState<Route>('account.general');
  const [open, setOpen] = useState(false);

  return (
    <SettingsContext.Provider
      value={{open, setOpen, route, setRoute, workspaceSlug, userId}}
    >
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
