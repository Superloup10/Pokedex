const POKEMONS_URL = "{{API_URL}}/pokemon?limit={{limit}}&offset={{offset}}";

function getUrlToCallPokemonsData(limit: string, offset: string) {
    return POKEMONS_URL
        .replace("{{API_URL}}", process.env.API_URL as string)
        .replace("{{limit}}", limit)
        .replace("{{offset}}", offset);
}

export async function GET(request: Request) {
    const {searchParams} = new URL(request.url);
    const limit = searchParams.get("limit")!;
    const offset = searchParams.get("offset")!;
    const response = await fetch(getUrlToCallPokemonsData(limit, offset));

    if (response.ok) {
        const data = await response.json();
        return Response.json(data);
    } else {
        const error = await response.text();
        console.error("Error fetch data : ", error);
        return Response.json(error);
    }
}
