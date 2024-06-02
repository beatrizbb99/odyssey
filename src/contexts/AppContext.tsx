import React, { createContext, useState, ReactNode, useContext } from 'react';

// Definieren des Interface für den Context
interface AppContextProps {
  title: string;
  setTitle: (title: string) => void;
  clickCount: number;
  setClickCount: (count: number) => void;
}

// Erstellen des Contexts
const AppContext = createContext<AppContextProps | undefined>(undefined);

// Definieren des Providers
const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [title, setTitle] = useState('Welcome to your Creative Odyssey!');
  const [clickCount, setClickCount] = useState(0);

  return (
    <AppContext.Provider value={{ title, setTitle, clickCount, setClickCount }}>
      {children}
    </AppContext.Provider>
  );
};

// Benutzerdefinierter Hook zum Verwenden des Contexts
const useAppContext = (): AppContextProps => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export { AppProvider, useAppContext };
