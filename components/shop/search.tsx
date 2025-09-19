import { Search } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import { Input } from "../ui/input";
import { Icon } from "../ui/icon";

interface SearchBarProps {
    search: string;
    handleSearchChange: (text: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ search, handleSearchChange }) => {
    return (
        <View className="flex flex-row items-center gap-2 bg-purple-400 dark:bg-gray-700 p-2 overflow-hidden box-content rounded">
            <Icon as={Search} height={24} width={24} />
            <Input
                value={search}
                onChangeText={handleSearchChange}
                placeholder="Buscar productos..."
                className="flex-1 bg-transparent border border-black  placeholder:text-black dark:border-white dark:placeholder:text-gray-50"
            />
        </View>
    );
};

export default SearchBar;
