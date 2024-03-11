"use client"

import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {Locale} from "@/i18n-config";
import {Dictionary} from "@/models/Dictionary";

interface DictionaryProviderProps {
    children: ReactNode;
    locale: Locale
}

interface DictionaryContextProps {
    dictionary: Dictionary
}

import defaultDictionary from "@/dictionaries/fr.json";

const DictionaryContext = createContext<DictionaryContextProps>({dictionary: defaultDictionary});

export const useDictionary = () => {
    const context = useContext(DictionaryContext);
    if (!context) {
        throw new Error("useLocalization must be used within a LocalizationProvider.")
    }
    return context;
}

export default function DictionaryProvider({children, locale}: DictionaryProviderProps) {
    const [dictionary, setDictionary] = useState<Dictionary>(defaultDictionary);
    useEffect(() => {
        const fetchDictionary = async () => {
            const loadedDictionary = await import(`@/dictionaries/${locale}.json`);
            setDictionary(loadedDictionary.default);
        };
        fetchDictionary();
    }, [locale]);
    return (
        <DictionaryContext.Provider value={{dictionary}}>
            {children}
        </DictionaryContext.Provider>
    );
}
