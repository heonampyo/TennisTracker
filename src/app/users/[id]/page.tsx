"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '../../type/user';
import { calculateUserStats, calculateOpponentStats } from '../../utils/stats';

interface Props {
    params: { id: string }
}

export default function UserDetail({ params }: Props) {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        fetchUserData();
    }, [params.id]);

    const fetchUserData = async () => {
        const response = await fetch(`/api/users/${params.id}`);
        const data = await response.json();
        setUser(data);
    };

    if (!user) return <div>Loading...</div>;

    const { totalGames, totalWins, totalLosses, winRate } = calculateUserStats(user);
    const opponentStats = calculateOpponentStats(user);

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">{user.name}님의 상세 전적</h1>
                <button
                    onClick={() => router.back()}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    뒤로가기
                </button>
            </div>

            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                <h2 className="text-xl font-semibold mb-2">전체 통계</h2>
                <p>총 {totalGames}경기 ({totalWins}승 {totalLosses}패) - 승률: {winRate}%</p>
            </div>

            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">상대별 전적</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 border-b text-left">상대</th>
                            <th className="px-6 py-3 border-b text-left">승</th>
                            <th className="px-6 py-3 border-b text-left">패</th>
                            <th className="px-6 py-3 border-b text-left">승률</th>
                        </tr>
                        </thead>
                        <tbody>
                        {opponentStats.map((stat, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="px-6 py-4 border-b">{stat.opponent}</td>
                                <td className="px-6 py-4 border-b">{stat.wins}</td>
                                <td className="px-6 py-4 border-b">{stat.losses}</td>
                                <td className="px-6 py-4 border-b">{stat.winRate}%</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-4">전체 매치 기록</h2>
                <div className="space-y-2">
                    {user.records.map((record, index) => (
                        <div key={index} className="border rounded p-3 bg-gray-50">
                            <p>
                                vs {record.opponent} - {' '}
                                {record.wins > 0 ? (
                                    <span className="text-green-600">승리</span>
                                ) : (
                                    <span className="text-red-600">패배</span>
                                )}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}