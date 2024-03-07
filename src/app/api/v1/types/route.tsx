const TYPES_URL = "{{API_URL}}/type?limit={{limit}}";

const TYPE_URL = "{{API_URL}}/type/{{name}}"

function getUrlToCallTypesData() {
    return TYPES_URL
        .replace("{{API_URL}}", process.env.API_URL as string)
        .replace("{{limit}}", String(18));
}

function getUrlToCallTypeDataByName(name: string) {
    return TYPE_URL
        .replace("{{API_URL}}", process.env.API_URL as string)
        .replace("{{name}}", name);
}

export async function GET(request: Request) {
    const {searchParams} = new URL(request.url);
    const lang = searchParams.get("lang")!;
    const response = await fetch(getUrlToCallTypesData());

    if (response.ok) {
        const data = await response.json();
        const typeNames = data.results.map(({name}: any) => name);
        const types = await Promise.all(typeNames.map(async (typeName: string) => {
            const typeResponse = await fetch(getUrlToCallTypeDataByName(typeName));
            if (typeResponse.ok) {
                const typeData = await typeResponse.json();
                return typeData.names.find((nameData: any) => nameData.language.name === lang)?.name || typeName;
            }
        }));
        return Response.json(types);
    } else {
        const error = await response.text();
        console.error("Error fetch data : ", error);
        return Response.json(error);
    }
}
