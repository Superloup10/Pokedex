"use client"

import {useDictionary} from "@/context/DictionaryContext";
import Link from "next/link";

export default function NotFound() {
    const {dictionary} = useDictionary();
    return (
        <main className="p-8">
            <h1>{`${dictionary.errors.not_found.prefix} : 404 ${dictionary.errors.not_found.title}`}</h1>
            <p>{dictionary.errors.not_found.message}</p>
            <Link href="/">{dictionary.links.pokedex}</Link>
        </main>
    );
}
