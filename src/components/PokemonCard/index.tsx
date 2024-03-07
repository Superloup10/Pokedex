import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import Image from "next/image";
import {PokemonData} from "@/models/pokemon.dto";
import {useParams, usePathname} from "next/navigation";
import {useDictionary} from "@/context/DictionaryContext";
import {Locale} from "@/i18n-config";

function PokemonBasic(pokemonData: PokemonData) {
    return (
        <Card className="flex flex-col justify-center items-center w-full h-full">
            <CardHeader>
                <CardTitle>{pokemonData.name}</CardTitle>
            </CardHeader>
            <CardContent>
                {pokemonData.sprite &&
                    <Image src={pokemonData.sprite} alt={pokemonData.name} width="100" height="100" unoptimized/>}
            </CardContent>
            <CardFooter>
                <p>{pokemonData.types && pokemonData.types.join(", ")}</p>
            </CardFooter>
        </Card>
    );
}

function PokemonDetails(pokemonData: PokemonData) {
    const {dictionary} = useDictionary();

    return (
        <Card className="flex flex-col justify-center items-center w-full h-full">
            <CardHeader>
                <CardTitle>{pokemonData.name}</CardTitle>
            </CardHeader>
            <CardContent>
                {pokemonData.sprite &&
                    <Image src={pokemonData.sprite} alt={pokemonData.name} width="100" height="100" unoptimized/>}
                <p>{`${pokemonData.types && pokemonData.types.length > 1 ? dictionary.pokemon.types : dictionary.pokemon.type}`} : {pokemonData.types && pokemonData.types.join(", ")}</p>
                <p>{dictionary.pokemon.height} : {pokemonData.height} m</p>
                <p>{dictionary.pokemon.weight} : {pokemonData.weight} kg</p>
                <p>{`${pokemonData.abilities && pokemonData.abilities.length > 1 ? dictionary.pokemon.abilities : dictionary.pokemon.ability}`} :
                    {pokemonData.abilities && pokemonData.abilities.map((ability, index) => (
                        <span
                            key={index}>{index > 0 && ", "} {ability.name}{ability.is_hidden ? ` (${dictionary.pokemon.ability.toLowerCase()} ${dictionary.pokemon.hidden})` : ""}</span>
                    ))}
                </p>
            </CardContent>
            <CardFooter className="flex text-wrap justify-between">
                <p>{dictionary.pokemon.moves} : {pokemonData.moves && pokemonData.moves.join(", ")}</p>
            </CardFooter>
        </Card>
    )
}

export default function PokemonCard(pokemonData: PokemonData) {
    const pathname = usePathname();
    const lang = useParams().lang as Locale;
    const isHomePage = pathname === `/${lang}`;
    return isHomePage ? <PokemonBasic {...pokemonData}/> : <PokemonDetails {...pokemonData}/>
}
