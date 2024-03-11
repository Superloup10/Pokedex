export type Dictionary = {
    errors: {
        general: {
            title: string;
        };
        not_found: {
            prefix: string;
            title: string;
            message: string;
        }
    };
    loadings: {
        general: string;
        pokemons: string;
    };
    inputs: {
        combobox: {
            value: string;
            empty: string;
        };
        text: string;
        button: string;
    };
    links: {
        pokedex: string;
    };
    pokemon: {
        type: string;
        types: string;
        height: string;
        weight: string;
        ability: string;
        abilities: string;
        hidden: string;
        moves: string;
    };
};
