"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { useDebounce } from "use-debounce";
import Image from "next/image";

import { type ProductSearch } from "@/schemas/product.schema";
import { cn, currency } from "@/lib/utils";
import { useProductVariant } from "@/hooks/useProductVariant";
import { useQuery } from "@tanstack/react-query";

const ProductCard: React.FC<{ product: ProductSearch; onProductSelect?: (product: ProductSearch) => void }> = ({ product, onProductSelect }) => {
    const { priceInfo } = useProductVariant(product);

    return (
        <div
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-search-hover transition-colors cursor-pointer group"
            onClick={() => onProductSelect?.(product)}
        >
            <div className="relative w-12 h-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                <Image
                    fill
                    alt={product.name}
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                    sizes="48px"
                    src={product.images[0] || product.image || "/placeholder.jpg"}
                />
            </div>

            <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm text-foreground truncate">{product.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                    <span className="font-semibold text-sm text-primary">{currency(priceInfo.minPrice)}</span>
                </div>
            </div>
        </div>
    );
};

interface ProductSearchProps {
    initialQuery?: string;
    onProductSelect?: (product: ProductSearch) => void;
    searchDelay?: number;
    className?: string;
    placeholder?: string;
    closeOnSelect?: boolean;
}

const ProductSearchClient: React.FC<ProductSearchProps> = ({
    initialQuery = "",
    onProductSelect,
    searchDelay = 500,
    className,
    placeholder = "Search for products...",
    closeOnSelect = true,
}) => {
    const [query, setQuery] = useState(initialQuery);
    const [debouncedQuery] = useDebounce(query, searchDelay);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const searchRef = useRef<HTMLInputElement>(null);

    // const { data, isLoading } = useProductSearch({ search: debouncedQuery, limit: 5, page: 1 });
    const { data: products, isLoading } = useQuery<ProductSearch[]>({
        queryKey: ["products", query],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SEARCH_URL}/api/product/search/public?search=${debouncedQuery}&limit=5`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return res.json();
        },
    });

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && !inputRef.current?.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleProductSelect = (product: ProductSearch) => {
        if (closeOnSelect) {
            setQuery(product.name);
            setIsOpen(false);
        }
        onProductSelect?.(product);
    };

    const hasResults = query.trim() && products?.length;
    const hasNoResults = query.trim() && (!products || products?.length === 0) && !isLoading;

    return (
        <div ref={dropdownRef} className={cn("relative w-full max-w-xl", className)}>
            <div className="relative">
                <div
                    className={cn(
                        "relative flex items-center rounded-xl border transition-all duration-200",
                        "bg-search-background border-search-border hover:border-primary/30 hover:shadow-[var(--shadow-search)]",
                        isOpen && "border-primary shadow-[var(--shadow-search)] bg-search-focus"
                    )}
                >
                    <Search className="absolute left-4 w-5 h-5 text-muted-foreground" />
                    <input
                        ref={inputRef}
                        className={cn(
                            "w-full pl-12 pr-12 py-2.5 bg-transparent border-0 outline-0",
                            "text-foreground placeholder:text-muted-foreground",
                            "transition-all duration-200"
                        )}
                        placeholder={placeholder}
                        type="text"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setIsOpen(true);
                        }}
                    />
                    {query && (
                        <button
                            className="absolute right-4 p-1 rounded-full hover:bg-muted transition-colors"
                            onClick={() => {
                                setQuery("");
                                setIsOpen(false);
                                searchRef.current?.focus();
                            }}
                        >
                            <X className="w-4 h-4 text-muted-foreground" />
                        </button>
                    )}
                </div>
            </div>

            {isOpen && (
                <div
                    ref={dropdownRef}
                    className={cn(
                        "absolute top-full left-0 right-0 mt-2 z-50",
                        "bg-background border border-search-border rounded-xl",
                        "shadow-lg backdrop-blur-sm max-h-[60vh] overflow-y-auto"
                    )}
                >
                    <div className="p-2">
                        {isLoading && (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
                            </div>
                        )}

                        {hasResults && (
                            <div className="mb-4">
                                <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground">
                                    <Search className="w-4 h-4" />
                                    Search Results ({products?.length})
                                </div>
                                <div className="space-y-1">
                                    {products?.map((product: ProductSearch, idx: number) => (
                                        <ProductCard key={idx} product={product} onProductSelect={handleProductSelect} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {hasNoResults && (
                            <div className="text-center py-8">
                                <Search className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                                <p className="text-muted-foreground">No products found for {query}</p>
                                <p className="text-sm text-muted-foreground mt-1">Try searching for something else</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductSearchClient;
