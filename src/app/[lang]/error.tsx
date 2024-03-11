"use client"

import {useEffect} from "react";
import {useDictionary} from "@/context/DictionaryContext";

export default function Error({error}: { error: Error & { digest?: string } }) {
    const {dictionary} = useDictionary();

    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div>
            <h2>{dictionary.errors.general.title}: {error.message}</h2>
        </div>
    );
}
