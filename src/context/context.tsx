import React, { createContext, useContext, useState } from 'react';

type ModsContextType = {
    query: string;
    setQuery: (q: string) => void;
    sortedBy: string;
    setSortedBy: (s: string) => void;
    qtdMods: number;
    setQtdMods: (n: number) => void;
    currentPage: number;
    setCurrentPage: (n: number) => void;
    lastPage: number;
    setLastPage: (n: number) => void;
};

const ModsContext = createContext<ModsContextType | undefined>(undefined);

export const ModsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [query, setQuery] = useState('');
    const [sortedBy, setSortedBy] = useState('Relevance');
    const [qtdMods, setQtdMods] = useState(24);
    const [currentPage, setCurrentPage] = useState(0);
    const [lastPage, setLastPage] = useState(0);

    return (
        <ModsContext.Provider value={{
            query, setQuery,
            sortedBy, setSortedBy,
            qtdMods, setQtdMods,
            currentPage, setCurrentPage,
            lastPage, setLastPage
        }}>
            {children}
        </ModsContext.Provider>
    );
};

export const useModsContext = () => {
    const context = useContext(ModsContext);
    if (!context) throw new Error('useModsContext must be used within ModsProvider');
    return context;
};