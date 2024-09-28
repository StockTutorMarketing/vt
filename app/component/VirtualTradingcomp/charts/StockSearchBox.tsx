import React, { useState, useEffect, useContext } from 'react';
import { CiSearch } from 'react-icons/ci';
import { getAllSymbols } from '@/datafeeds/stocks';
import { StockSkeleton } from '../Skeleton';
import { MyContext } from '@/context/symbolecontext';

export default function StockSearchBox() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [noResults, setNoResults] = useState(false);
    const { value, setValue } = useContext<any>(MyContext);
    const [clicked, setClicked] = useState(true);

    useEffect(() => {
        if (searchQuery.length > 0) {
            setLoading(true);
            setNoResults(false);

            getAllSymbols(searchQuery)
                .then((data) => {
                    setSearchResults(data);
                })
                .catch((error) => {
                    console.error('Error fetching search results:', error);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setSearchResults([]);
            setNoResults(false);
        }
    }, [searchQuery]);

    const handleClick = (result: any) => {
        setValue(result?.symbol);
        setClicked(false);
        setSearchQuery('');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setClicked(true);
    };

    return (
        <div className="relative mb-4">
            <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Stocks, Futures & Options"
                value={searchQuery}
                onChange={handleInputChange}
            />
            <CiSearch className="absolute right-2 top-2 text-gray-400" size={20} />

            {searchQuery && clicked && (
                <div className="absolute top-full left-0 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg z-10 overflow-hidden">
                    {loading ? (
                        <div className="p-4 text-center">
                            <StockSkeleton />
                        </div>
                    ) : noResults ? (
                        <div className="p-4 text-center text-gray-500">
                            <div role="img" className='flex justify-center gap-2 items-center' aria-label="Search">
                                <CiSearch /> No results found
                            </div>
                        </div>
                    ) : (
                        <div className="max-h-[23rem] overflow overflow-y-auto ">
                            {searchResults.map((result: any, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer transition duration-150 ease-in-out"
                                    onClick={() => handleClick(result)}
                                >
                                    <div>
                                        <p className="text-sm font-medium">{result?.symbol}</p>
                                        <p className="text-xs text-gray-500">{result?.exchange}</p>
                                    </div>
                                    <CiSearch size={16} className="text-gray-400" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
