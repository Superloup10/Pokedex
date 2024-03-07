"use client"

import PokemonList from "@/components/PokemonList";
import InputWithButton from "@/components/InputWithButton";
import {useState} from "react";
import TypeFilter from "@/components/TypeFilter";
import ToggleMode from "@/components/ToggleMode";

export default function Home() {
    const [searchNameTerm, setSearchNameTerm] = useState("");
    const [searchTypeTerm, setSearchTypeTerm] = useState("");

    const handleSearchByName = (value: string) => {
        setSearchNameTerm(value);
    }

    const handleSearchByType = (value: string) => {
        setSearchTypeTerm(value);
    }

    return (
        <main className="p-8">
            <div className="flex items-center justify-between">
                <TypeFilter onSearch={handleSearchByType}/>
                <InputWithButton onSearch={handleSearchByName}/>
                <ToggleMode/>
            </div>
            <PokemonList searchNameTerm={searchNameTerm} searchTypeTerm={searchTypeTerm}/>
        </main>
    );
}
