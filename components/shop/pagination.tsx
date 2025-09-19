import React from "react";
import { Button } from "../ui/button";
import { Text, View } from "react-native";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
            onPageChange(newPage);
        }
    };

    return (
        <>{totalPages > 1 &&
            <View className="flex flex-row gap-2 justify-evenly">
                <Button onPress={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                    <Text className="text-white">{'<<'}</Text>
                </Button>

                {currentPage > 4 && (
                    <Button onPress={() => handlePageChange(1)}>
                        <Text className="text-white">1</Text>
                    </Button>
                )}

                {currentPage > 3 && <Text className="text-white bg-lime-500">...</Text>}

                {[...Array(5)].map((_, index) => {
                    const page = currentPage - 2 + index;
                    if (page > 0 && page <= totalPages) {
                        return (
                            <Button
                                key={page}
                                onPress={() => handlePageChange(page)}
                                className={currentPage === page ? "active" : ""}
                            >
                                <Text className="text-white">{page}</Text>
                            </Button>
                        );
                    }
                    return null;
                })}

                {currentPage < totalPages - 2 && <Text className="text-white">...</Text>}

                {currentPage < totalPages - 4 && (
                    <Button onPress={() => handlePageChange(totalPages)}>
                        <Text className="text-white">{totalPages}</Text>
                    </Button>
                )}

                <Button onPress={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                    <Text className="text-white">{'>>'}</Text>
                </Button>
            </View>
        }</>
    );
};

export default Pagination;
