import {PokemonData} from "@/models/pokemon.dto";

const POKEMON_URL = "{{API_URL}}/pokemon/{{id}}";
const POKEMON_SPECIES_URL = "{{API_URL}}/pokemon-species/{{id}}";
const POKEMON_TYPES_URL = "{{API_URL}}/type/{{name}}";
const POKEMON_ABILITY_URL = "{{API_URL}}/ability/{{name}}";
const POKEMON_MOVE_URL = "{{API_URL}}/move/{{name}}";

const cacheTypes: Record<string, unknown> = {};
const cacheAbilities: Record<string, unknown> = {};
const cacheMoves: Record<string, unknown> = {};

function getPokemonById(id: string) {
    return POKEMON_URL
        .replace("{{API_URL}}", process.env.API_URL as string)
        .replace("{{id}}", id);
}

function getPokemonSpeciesById(id: string) {
    return POKEMON_SPECIES_URL
        .replace("{{API_URL}}", process.env.API_URL as string)
        .replace("{{id}}", id);
}

function getPokemonTypesByName(name: string) {
    return POKEMON_TYPES_URL
        .replace("{{API_URL}}", process.env.API_URL as string)
        .replace("{{name}}", name);
}

function getPokemonAbilityByName(name: string) {
    return POKEMON_ABILITY_URL
        .replace("{{API_URL}}", process.env.API_URL as string)
        .replace("{{name}}", name);
}

function getPokemonMoveByName(name: string) {
    return POKEMON_MOVE_URL
        .replace("{{API_URL}}", process.env.API_URL as string)
        .replace("{{name}}", name);
}

export async function GET(request: Request) {
    const {searchParams} = new URL(request.url);
    const id = searchParams.get("id")!;
    const lang = searchParams.get("lang")!;
    const response = await fetch(getPokemonById(id), {cache: "force-cache"});
    const response2 = await fetch(getPokemonSpeciesById(id), {cache: "force-cache"});

    if (response.ok && response2.ok) {
        const data = await response.json();
        const speciesData = await response2.json();
        /*======================================TYPE=========================================== */
        const fetchTypeData = async (typeName: string) => {
            if (!cacheTypes[typeName]) {
                const typeResponse = await fetch(getPokemonTypesByName(typeName));
                if (typeResponse.ok) {
                    const typeData = await typeResponse.json();
                    cacheTypes[typeName] = typeData.names.find((nameData: any) => nameData.language.name === lang)?.name || typeName;
                }
            }
            return cacheTypes[typeName];
        };
        /*======================================ABILITY======================================== */
        const fetchAbilityData = async (abilityName: string) => {
            if (!cacheAbilities[abilityName]) {
                const abilityResponse = await fetch(getPokemonAbilityByName(abilityName));
                if (abilityResponse.ok) {
                    const abilityData = await abilityResponse.json();
                    cacheAbilities[abilityName] = abilityData.names.find((nameData: any) => nameData.language.name === lang)?.name || abilityName;
                }
            }
            return cacheAbilities[abilityName];
        };
        /*======================================MOVE=========================================== */
        const fetchMoveData = async (moveName: string) => {
            if (!cacheMoves[moveName]) {
                const moveResponse = await fetch(getPokemonMoveByName(moveName));
                if (moveResponse.ok) {
                    const moveData = await moveResponse.json();
                    cacheMoves[moveName] = moveData.names.find((nameData: any) => nameData.language.name === lang)?.name || moveName;
                }
            }
            return cacheMoves[moveName];
        };
        const [typesData, abilitiesData, movesData] = await Promise.all([
            Promise.all(data.types.map((typeData: any) => fetchTypeData(typeData.type.name))),
            Promise.all(data.abilities.map((abilityData: any) => fetchAbilityData(abilityData.ability.name))),
            Promise.all(data.moves.map((moveData: any) => fetchMoveData(moveData.move.name)))
        ]);

        const pokemonData: PokemonData = {
            id: data.id,
            name: speciesData.names.find((item: any) => item.language.name === lang)?.name || data.name,
            height: data.height / 10,
            weight: data.weight / 10,
            sprite: data.sprites.other["official-artwork"].front_default,
            types: typesData,
            abilities: data.abilities.map((abilityData: any, idx: number) => {
                return {name: abilitiesData[idx], is_hidden: abilityData.is_hidden};
            }),
            moves: movesData
        };

        // Retourner les nouvelles donnees
        return Response.json(pokemonData);
    } else {
        const errorData = await response.text() || await response2.text();
        console.error("Error fetch data : ", errorData);
    }
}
