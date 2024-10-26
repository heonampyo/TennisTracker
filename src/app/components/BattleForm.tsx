// app/components/BattleForm.tsx
"use client";

import React from 'react';

interface BattleFormProps {
    player1: string;
    player2: string;
    setPlayer1: (name: string) => void;
    setPlayer2: (name: string) => void;
    onBattleResult: (result: 'win' | 'loss') => void;
}

export const BattleForm: React.FC<BattleFormProps> = ({
                                                          player1,
                                                          player2,
                                                          setPlayer1,
                                                          setPlayer2,
                                                          onBattleResult,
                                                      }) => {
    const handlePlayer1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPlayer1(e.target.value.trim());
    };

    const handlePlayer2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPlayer2(e.target.value.trim());
    };

    return (
        <div className="flex flex-col gap-4 mb-4">
            <div className="flex gap-4">
                <input
                    value={player1}
                    onChange={handlePlayer1Change}
                    placeholder="플레이어 1"
                    className="border p-2 rounded flex-1"
                    style={{ color: 'black' }}
                />
                <span className="flex items-center">VS</span>
                <input
                    value={player2}
                    onChange={handlePlayer2Change}
                    placeholder="플레이어 2"
                    className="border p-2 rounded flex-1"
                    style={{ color: 'black' }}
                />
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