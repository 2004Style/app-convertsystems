import { Search } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Alert, View } from "react-native";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { TriggerRef } from '@rn-primitives/select';
import { Icon } from "../ui/icon";
import { Input } from "../ui/input";
import { useCosultaApi } from "@/hooks/datosApi.hook";
import { Categorias } from "@/interfaces/interfaces";

interface SearchBarProps {
    search: string;
    handleSearchChange: (text: string) => void;
    seachCategorySelect: string;
    handleSearchCategory: (text: string) => void;
}

interface CategoriesSelectProps {
    seachCategorySelect: string;
    handleSearchCategory: (text: string) => void;
}

const CategoriesSelect: React.FC<CategoriesSelectProps> = ({ seachCategorySelect, handleSearchCategory }) => {
    const { get } = useCosultaApi();
    const [categorias, setCategorias] = useState<Categorias[]>([]);

    useEffect(() => {
        const fetchCategorias = async () => {
            const { alert, data } = await get("/categorias")
            alert === "success" ? setCategorias(data.records) : setCategorias([]);
        }

        fetchCategorias();
    }, []);

    return (
        <Select value={{ label: seachCategorySelect || "All", value: seachCategorySelect || "" }} onValueChange={(option) => option && handleSearchCategory(option.value)}>
            <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent className="w-[150px] bg-blue-300 dark:bg-blue-800">
                <SelectGroup>
                    <SelectLabel>Categorias</SelectLabel>
                    <SelectItem label="All" value="">
                        All
                    </SelectItem>
                    {categorias.map((cat) => (
                        <SelectItem key={cat.id} label={cat.nombre} value={cat.nombre}>
                            {cat.nombre}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}

const SearchBar: React.FC<SearchBarProps> = ({ search, handleSearchChange, seachCategorySelect, handleSearchCategory }) => {
    return (
        <View className="flex-row gap-2 w-full justify-between items-center bg-purple-400 dark:bg-gray-700 px-2">
            <View className="flex flex-1 flex-row items-center gap-2 py-2 overflow-hidden box-content rounded">
                <Icon as={Search} height={24} width={24} />
                <Input
                    value={search}
                    onChangeText={handleSearchChange}
                    placeholder="Buscar productos..."
                    className="flex-1 bg-transparent border border-black  placeholder:text-black dark:border-white dark:placeholder:text-gray-50"
                />
            </View>
            <CategoriesSelect seachCategorySelect={seachCategorySelect} handleSearchCategory={handleSearchCategory} />
        </View>
    );
};

export default SearchBar;
