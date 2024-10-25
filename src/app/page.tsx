// app/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { User } from './type/user';
import { BattleForm } from './components/BattleForm';
import { UserSummaryCard } from './components/UserSummaryCard';

export default function Home() {
    const [users, setUsers] = useState<User[]>([]);
    const [player1, setPlayer1] = useState<string>('');
    const [player2, setPlayer2] = useState<string>('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const response = await fetch('/api/users');
        const data: User[] = await response.json();
        setUsers(data);
    };

    const resetData = async () => {
        if (window.confirm('모든 데이터를 초기화하시겠습니까?')) {
            await fetch('/api/reset', { method: 'POST' });
            fetchUsers();
        }
    };

    const addBattleResult = async (result: 'win' | 'loss') => {
        if (!player1 || !player2) {
            alert('두 플레이어의 이름을 모두 입력해주세요.');
            return;
        }

        await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: player1,
                opponent: player2,
                result,
            }),
        });

        setPlayer1('');
        setPlayer2('');
        fetchUsers();
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">대전 기록 관리</h1>

            <div className="mb-4">
                <button
                    onClick={resetData}
                    className="bg-red-500 text-white px-4 py-2 rounded mb-4 hover:bg-red-600"
                >
                    데이터 초기화
                </button>
            </div>

            <BattleForm
                player1={player1}
                player2={player2}
                setPlayer1={setPlayer1}
                setPlayer2={setPlayer2}
                onBattleResult={addBattleResult}
            />

            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">전적 현황</h2>
                <div className="grid gap-4">
                    {users.map((user) => (
                        <UserSummaryCard key={user.id} user={user} />
                    ))}
                </div>
            </div>
        </div>
    );
}

