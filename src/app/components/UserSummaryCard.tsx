// app/components/UserSummaryCard.tsx
"use client";

import React from 'react';
import { User } from '../type/user';
import { calculateUserStats } from '../utils/stats';
import Link from 'next/link';

interface UserSummaryCardProps {
    user: User;
}

export const UserSummaryCard: React.FC<UserSummaryCardProps> = ({ user }) => {
    const { totalGames, totalWins, totalLosses, winRate } = calculateUserStats(user);

    return (
        <Link href={`/users/${user.id}`}>
            <div className="border p-4 rounded shadow hover:bg-gray-50 cursor-pointer transition-colors">
                <h3 className="font-bold text-lg">{user.name}</h3>
                <p>
                    총 전적: {totalGames}경기 ({totalWins}승 {totalLosses}패)
                    <br />
                    승률: {winRate}%
                </p>
            </div>
        </Link>
    );
};