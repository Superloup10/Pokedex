"use client"

import {useCallback, useEffect, useState} from "react";
import PokemonCard from "@/components/PokemonCard";
import Link from "next/link";
import {PokemonData} from "@/models/pokemon.dto";
import PaginationComponent from "@/components/Pagination";
import {useParams} from "next/navigation";
import {type Locale} from "@/i18n-config";
import {useDictionary} from "@/context/DictionaryContext";

const pokemonsPerPage = 100;

interface PokemonListProps {
    searchNameTerm: string,
    searchTypeTerm: string
}

export default function PokemonList({searchNameTerm, searchTypeTerm}: PokemonListProps) {
    const [pokemonList, setPokemonList] = useState<{ [key: number]: PokemonData[] }>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const {dictionary} = useDictionary();
    const lang = useParams().lang as Locale;

    const fetchPokemonList = useCallback(async (currentPage: number, lang: Locale) => {
        setLoading(true);
        if (!pokemonList[currentPage]) {
            const offset = (currentPage - 1) * pokemonsPerPage;

            const pokemonsResponse = await fetch(`/api/v1/pokemons?limit=${pokemonsPerPage}&offset=${offset}`, {cache: "force-cache"});
            const pokemonsData = await pokemonsResponse.json();

            const newPokemonPromises = pokemonsData.results.map(async ({url}: any) => {
                const id = Number(url.split("/").filter(Boolean).pop());

                const pokemonResponse = await fetch(`/api/v1/pokemon?id=${id}&lang=${lang}`, {cache: "force-cache"});
                const pokemonData = await pokemonResponse.json();

                return {name: pokemonData.name, id, sprite: pokemonData.sprite, types: pokemonData.types};
            });
            const newPokemons = await Promise.all(newPokemonPromises);

            setPokemonList(prevState => ({...prevState, [currentPage]: newPokemons}));
            if (pokemonsData.count) {
                setLastPage(Math.ceil(pokemonsData.count / pokemonsPerPage));
            }
        }
        setLoading(false);
    }, [pokemonList]);

    useEffect(() => {
        fetchPokemonList(currentPage, lang);
    }, [currentPage, lang, fetchPokemonList]);

    const searchPokemonByName = (pokemon: PokemonData) => pokemon.name.toLowerCase().includes(searchNameTerm.toLowerCase());

    const searchPokemonsByType = (pokemon: PokemonData) => pokemon.types.some((type) => type.toLowerCase().includes(searchTypeTerm.toLowerCase()))

    const filteredPokemons = (pokemonList[currentPage] || []).filter((pokemonData) => searchPokemonByName(pokemonData) && searchPokemonsByType(pokemonData));

    return (
        <>
            {loading ? (
                <p>{dictionary.loadings.pokemons}...</p>
            ) : (
                <div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 ">
                        {filteredPokemons.map((pokemonData) => (
                            <Link key={pokemonData.id} href={`/pokemon/${pokemonData.id}`}>
                                <PokemonCard key={pokemonData.id} {...pokemonData}/>
                            </Link>
                        ))}
                    </div>
                    <PaginationComponent currentPage={currentPage} lastPage={lastPage} onPageChange={setCurrentPage}/>
                </div>
            )}
        </>
    );
}
