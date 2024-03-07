import {useDictionary} from "@/context/DictionaryContext";

export default function Loading() {
    const {dictionary} = useDictionary();
    return (<p>{dictionary.loadings.general}...</p>);
}
