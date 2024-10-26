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

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault(); // Link 컴포넌트의 네비게이션을 막습니다
        const confirmation = window.confirm('정말로 이 사용자를 삭제하시겠습니까?');
        if (!confirmation) return;

        const response = await fetch(`/api/users/${user.id}`, { method: 'DELETE' });
        if (response.ok) {
            window.location.reload(); // 페이지를 새로 고쳐서 사용자 목록 업데이트
        } else {
            alert('사용자 삭제에 실패했습니다.');
        }
    };

    return (
        <Link href={`/users/${user.id}`}>
            <div className="border p-4 rounded shadow hover:bg-gray-50 cursor-pointer transition-colors relative">
                <h3 className="font-bold text-lg">{user.name}</h3>
                <p>
                    총 전적: {totalGames}경기 ({totalWins}승 {totalLosses}패)
                    <br />
                    승률: {winRate}%
                </p>
                <button
                    onClick={handleDelete}
                    className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                    삭제
                </button>
            </div>
        </Link>
    );
};
