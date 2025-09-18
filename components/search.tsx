import { Search } from "lucide-react-native";
import React from "react";
import { Input } from "./ui/input";
import { View } from "react-native";

interface SearchBarProps {
    search: string;
    handleSearchChange: (text: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ search, handleSearchChange }) => {
    return (
        <View className="flex flex-row items-center gap-2 bg-purple-200 p-2 overflow-hidden box-content rounded">
            <Search />
            <Input
                value={search}
                onChangeText={handleSearchChange}
                placeholder="Buscar productos..."
                className="flex-1 bg-transparent border border-black"
            />
        </View>
    );
};

export default SearchBar;
