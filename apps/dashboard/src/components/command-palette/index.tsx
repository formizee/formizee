'use client';

import {createContext, useContext, useState} from 'react';
import {CommandPalette} from './dialog';

interface CommandPaletteContextType {
  workspaceSlug: string;

  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
}

const CommandPaletteContext = createContext<
  CommandPaletteContextType | undefined
>(undefined);

interface CommandPaletteProps {
  children: React.ReactNode;
  workspaceSlug: string;
}

export function CommandPaletteProvider({
  workspaceSlug,
  children
}: CommandPaletteProps) {
  const [open, setOpen] = useState(false);

  return (
    <CommandPaletteContext.Provider value={{open, setOpen, workspaceSlug}}>
      <CommandPalette />
      {children}
    </CommandPaletteContext.Provider>
  );
}

export function useCommandPalette() {
  const context = useContext(CommandPaletteContext);

  if (!context) {
    throw new Error(
      'useCommandPalette must be used within a CommandPaletteProvider'
    );
  }

  return context;
}
