"use client";
import React, { useContext } from 'react';
import Image from 'next/image';
import { BiUpArrow, BiDownArrow } from 'react-icons/bi';
import { MyContext } from '@/context/symbolecontext';
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";


export default function Header() {
    const { selectedTab, setSelectedTab, stockData } = useContext<any>(MyContext);

    const handleTabChange = (tab: string) => {
        setSelectedTab(tab);
    };

    return (
        <div className="h-full flex flex-col bg-[#f1f4fd] ">
            <div className="bg-white border-2 border-gray-200 h-fit shadow-lg p-2 flex items-center justify-evenly gap-[40rem]  ">
                <div className='w-fit gap-8 flex max-w-7xl px-auto'>
                    <div className='flex items-center gap-4'>
                        <Image alt='logo' src="/logo.png" height={20} width={30} />
                        <span className='font-bold  '>StockTutor</span>
                    </div>
                    <ul className="flex gap-10 text-xs flex-grow justify-start ">
                        {[
                            { label: 'Nifty50', key: '256265' },
                            { label: 'NIFTY PHARMA', key: '262409' },
                            { label: 'Nifty Bank', key: '260105' },
                        ].map(({ label, key }) => {
                            const stockInfo = stockData[key] || {};
                            const price = stockInfo.last_price || "0.0";
                            const openPrice = stockInfo.ohlc?.close || 0;
                            const change = price !== "0.0" ? (price - openPrice).toFixed(2) : "0.00";
                            const percentage = openPrice !== 0 ? ((Number(change) / openPrice) * 100).toFixed(2) : "0.00";
                            const isPositive = Number(change) >= 0;
                            return (
                                <li key={key} className="flex flex-col font-barlow items-left border-r-[1px] pr-4  border-[#e8ebf1]">
                                    <p className="text-xm">{label.toUpperCase()}</p>
                                    <div className={`flex items-center ${isPositive ? 'text-green-600 ' : 'text-red-600'}`}>
                                        <span className="text-xm font">{price}</span>
                                        {isPositive ? (
                                            < IoMdArrowDropup size={28} className="ml-1 " />
                                        ) : (
                                            <IoMdArrowDropdown size={28} className="ml-1 text-lg" />
                                        )}
                                        <span className="ml-1 text-sm">
                                            {isPositive ? `(+${percentage}%)` : `(${percentage}%)`}
                                        </span>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <ul className="flex gap-8 text-lg font-semibold">
                    <li
                        className={`flex flex-col items-center cursor-pointer hover:scale-95 ${selectedTab === 'chart' ? 'text-blue-600' : 'text-gray-600'}`}
                        onClick={() => handleTabChange('chart')}
                    >
                        <Image src="/chart.svg" priority width={20} height={20} alt="icon" />
                        <span className="mt-1 text-xs">Chart</span>
                    </li>

                    <li
                        className={`flex flex-col items-center cursor-pointer hover:scale-95 ${selectedTab === 'orders' ? 'text-blue-600' : 'text-gray-600'}`}
                        onClick={() => handleTabChange('orders')}
                    >
                        <Image src="/cart.svg" priority width={20} height={20} alt="icon" />
                        <span className="mt-1 text-xs">Orders</span>
                    </li>

                    <li
                        className={`flex flex-col items-center cursor-pointer hover:scale-95 ${selectedTab === 'holdings' ? 'text-blue-600' : 'text-gray-600'}`}
                        onClick={() => handleTabChange('holdings')}
                    >
                        <Image src="/bag.svg" priority width={20} height={20} alt="icon" />
                        <span className="mt-1 text-xs">Holdings</span>
                    </li>

                    <li
                        className={`flex flex-col items-center cursor-pointer hover:scale-95 ${selectedTab === 'position' ? 'text-blue-600' : 'text-gray-600'}`}
                        onClick={() => handleTabChange('position')}
                    >
                        <Image src="/holdings.svg" priority width={20} height={20} alt="icon" />
                        <span className="mt-1 text-xs">Position</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}
