import React, { createContext, useState, ReactNode, useContext } from 'react';

// Definieren des Interface für den Context
interface AppContextProps {
  clickCount: number;
  setClickCount: (count: number) => void;
}

// Erstellen des Contexts
const AppContext = createContext<AppContextProps | undefined>(undefined);

// Definieren des Providers
const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [clickCount, setClickCount] = useState(0);

  return (
    <AppContext.Provider value={{ clickCount, setClickCount }}>
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
