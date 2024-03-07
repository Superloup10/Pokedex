import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {Check, ChevronsUpDown} from "lucide-react";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem} from "@/components/ui/command";
import {cn} from "@/lib/utils";
import {useParams} from "next/navigation";
import {type Locale} from "@/i18n-config";
import {useDictionary} from "@/context/DictionaryContext";

interface TypeFilterProps {
    onSearch: (value: string) => void;
}

export default function TypeFilter({onSearch}: TypeFilterProps) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");
    const [types, setTypes] = useState<string[]>([]);
    const {dictionary} = useDictionary();
    const lang = useParams().lang as Locale;

    useEffect(() => {
        fetch(`/api/v1/types?lang=${lang}`, {cache: "force-cache"})
            .then(res => res.json())
            .then(data => setTypes(data));
    }, [lang]);

    const handleSelected = (currentValue: string) => {
        setValue(currentValue.toLowerCase() === value.toLowerCase() ? "" : currentValue);
        setOpen(false);
        onSearch(currentValue.toLowerCase() === value.toLowerCase() ? "" : currentValue);
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
                    {value ? types.find((type) => type.toLowerCase() === value.toLowerCase()) : dictionary.inputs.combobox.value}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder={dictionary.inputs.combobox.value}/>
                    <CommandEmpty>{dictionary.inputs.combobox.empty}</CommandEmpty>
                    <CommandGroup>
                        {types && types.map((type) => (
                            <CommandItem key={type} value={type} onSelect={handleSelected}>
                                <Check
                                    className={cn("mr-2 h-4 w-4", value.toLowerCase() === type.toLowerCase() ? "opacity-100" : "opacity-0")}/>
                                {type}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
