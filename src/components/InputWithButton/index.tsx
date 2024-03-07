import {useState, FormEvent, ChangeEvent} from 'react';
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useDictionary} from "@/context/DictionaryContext";

interface InputWithButtonProps {
    onSearch: (value: string) => void;
}

export default function InputWithButton({onSearch}: InputWithButtonProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const {dictionary} = useDictionary();

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        onSearch(searchTerm);
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    }

    return (
        <form onSubmit={handleSubmit} className="flex w-full max-w-sm items-center space-x-2">
            <Input type="text" placeholder={dictionary.inputs.text} value={searchTerm} onChange={handleChange}/>
            <Button type="submit">{dictionary.inputs.button}</Button>
        </form>
    );
}
