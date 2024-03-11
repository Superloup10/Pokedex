"use client"

import {useCallback, useEffect, useState} from "react";
import Link from "next/link";
import PokemonCard from "@/components/PokemonCard";
import {PokemonData} from "@/models/pokemon.dto";
import {type Locale} from "@/i18n-config";
import {useDictionary} from "@/context/DictionaryContext";

export default function Pokemon({params}: { params: { id: number, lang: Locale } }) {
    const [pokemonData, setPokemonData] = useState<{ [key: number]: PokemonData }>({});
    const {dictionary} = useDictionary();
    const fetchPokemonData = useCallback(async (id: number, lang: Locale) => {
        if (!pokemonData[id]) {
            const pokemonResponse = await fetch(`/api/v1/pokemon?id=${id}&lang=${lang}`, {cache: "force-cache"});
            const pokemonData: PokemonData = await pokemonResponse.json();
            setPokemonData(prevState => ({...prevState, [id]: pokemonData}));
        }
    }, [pokemonData]);

    useEffect(() => {
        fetchPokemonData(params.id, params.lang);
    }, [params.id, params.lang, fetchPokemonData]);

    return (
        <main className="p-8">
            <div className="grid grid-cols-1 gap-4">
                <PokemonCard {...pokemonData[params.id]}/>
                <Link href="/">{dictionary.links.pokedex}</Link>
            </div>
        </main>
    );
}
