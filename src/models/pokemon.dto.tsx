export interface PokemonData {
    id: number;
    name: string;
    height: number;
    weight: number;
    sprite: string;
    types: string[];
    abilities: [{ name: string, is_hidden: boolean }];
    moves: string[];
}
