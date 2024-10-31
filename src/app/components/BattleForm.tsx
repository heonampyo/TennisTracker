"use client";

import React, { useState, useEffect } from 'react';

interface BattleFormProps {
    player1: string;
    player2: string;
    setPlayer1: (name: string) => void;
    setPlayer2: (name: string) => void;
    onBattleResult: (result: 'win' | 'loss') => void;
    users: Array<{ id: number; name: string }>;
}

export const BattleForm: React.FC<BattleFormProps> = ({
                                                          player1,
                                                          player2,
                                                          setPlayer1,
                                                          setPlayer2,
                                                          onBattleResult,
                                                          users,
                                                      }) => {
    const [showDropdown1, setShowDropdown1] = useState(false);
    const [showDropdown2, setShowDropdown2] = useState(false);
    const [filteredUsers1, setFilteredUsers1] = useState(users);
    const [filteredUsers2, setFilteredUsers2] = useState(users);

    useEffect(() => {
        if (player1.length > 0) {
            setFilteredUsers1(users.filter(user =>
                user.name.toLowerCase().includes(player1.toLowerCase())
            ));
        } else {
            setFilteredUsers1(users);
        }
    }, [player1, users]);

    useEffect(() => {
        if (player2.length > 0) {
            setFilteredUsers2(users.filter(user =>
                user.name.toLowerCase().includes(player2.toLowerCase())
            ));
        } else {
            setFilteredUsers2(users);
        }
    }, [player2, users]);

    const handlePlayer1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPlayer1(e.target.value);
        setShowDropdown1(true);
    };

    const handlePlayer2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPlayer2(e.target.value);
        setShowDropdown2(true);
    };

    const handleKeyDown1 = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            if (filteredUsers1.length === 1) {
                selectPlayer1(filteredUsers1[0].name);
            }
            setShowDropdown1(false);
        }
    };

    const handleKeyDown2 = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            if (filteredUsers2.length === 1) {
                selectPlayer2(filteredUsers2[0].name);
            }
            setShowDropdown2(false);
        }
    };

    const selectPlayer1 = (name: string) => {
        setPlayer1(name);
        setShowDropdown1(false);
    };

    const selectPlayer2 = (name: string) => {
        setPlayer2(name);
        setShowDropdown2(false);
    };

    return (
        <div className="flex flex-col gap-4 mb-4">
            <div className="flex gap-4 items-start">
                <div className="relative flex-1 max-w-[200px]">
                    <div className="relative">
                        <input
                            value={player1}
                            onChange={handlePlayer1Change}
                            onKeyDown={handleKeyDown1}
                            onFocus={() => setShowDropdown1(true)}
                            placeholder="플레이어 1"
                            className="border p-2 rounded w-full pr-8"
                            style={{color: 'black'}}
                            onPaste={(e) => {
                                e.preventDefault();
                                const text = e.clipboardData.getData('text').replace(/\s/g, '');
                                setPlayer1(text);
                            }}
                            pattern="\S*"  // 공백 문자 방지
                            onInput={(e) => {
                                e.currentTarget.value = e.currentTarget.value.replace(/\s/g, '');
                            }}
                        />
                        {showDropdown1 && (
                            <button
                                onClick={() => setShowDropdown1(false)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                    {showDropdown1 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg overflow-y-auto"
                             style={{maxHeight: '300px'}}>
                            {filteredUsers1.map(user => (
                                <div
                                    key={user.id}
                                    className="p-2 hover:bg-gray-100 cursor-pointer text-black"
                                    onClick={() => selectPlayer1(user.name)}
                                >
                                    {user.name}
                                </div>
                            ))}
                            {filteredUsers1.length === 0 && (
                                <div className="p-2 text-gray-500">
                                    일치하는 사용자가 없습니다
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <span className="flex items-center font-bold text-black">VS</span>

                <div className="relative flex-1 max-w-[200px]">
                    <div className="relative">
                        <input
                            value={player2}
                            onChange={handlePlayer2Change}
                            onKeyDown={handleKeyDown2}
                            onFocus={() => setShowDropdown2(true)}
                            placeholder="플레이어 2"
                            className="border p-2 rounded w-full pr-8"
                            style={{color: 'black'}}
                            onPaste={(e) => {
                                e.preventDefault();
                                const text = e.clipboardData.getData('text').replace(/\s/g, '');
                                setPlayer2(text);
                            }}
                            pattern="\S*"  // 공백 문자 방지
                            onInput={(e) => {
                                e.currentTarget.value = e.currentTarget.value.replace(/\s/g, '');
                            }}
                        />

                        {showDropdown2 && (
                            <button
                                onClick={() => setShowDropdown2(false)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                    {showDropdown2 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg overflow-y-auto"
                             style={{maxHeight: '300px'}}>
                            {filteredUsers2.map(user => (
                                <div
                                    key={user.id}
                                    className="p-2 hover:bg-gray-100 cursor-pointer text-black"
                                    onClick={() => selectPlayer2(user.name)}
                                >
                                    {user.name}
                                </div>
                            ))}
                            {filteredUsers2.length === 0 && (
                                <div className="p-2 text-gray-500">
                                    일치하는 사용자가 없습니다
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex gap-4">
                <button
                    onClick={() => onBattleResult('win')}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex-1"
                >
                    플레이어 1 승리
                </button>
                <button
                    onClick={() => onBattleResult('loss')}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex-1"
                >
                    플레이어 2 승리
                </button>
            </div>
        </div>
    );
};
