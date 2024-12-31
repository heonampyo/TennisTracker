"use client";

import React, { useState } from 'react';
import { User } from '../type/user';
import { calculateUserStats } from '../utils/stats';
import Link from 'next/link';
import crypto from 'crypto';

interface UserSummaryCardProps {
    user: User;
    selectedYear: number;  // 년도 prop 추가
}

export const UserSummaryCard: React.FC<UserSummaryCardProps> = ({ user, selectedYear }) => {
    const [isDeleting, setIsDeleting] = useState(false);

    // 선택된 년도의 기록만 필터링
    const filteredRecords = user.records.filter(record =>
        new Date(record.createdAt).getFullYear() === selectedYear
    );

    // 필터링된 기록으로 새로운 user 객체 생성
    const filteredUser = {
        ...user,
        records: filteredRecords
    };

    // 필터링된 데이터로 통계 계산
    const { totalGames, totalWins, totalLosses, winRate, score } = calculateUserStats(filteredUser);

    const HASHED_PASSWORD = '46c6adda1ceaa107d0f71e6adbf4da03dcbc309ee95d681f2d234375ec502b1a';

    const hashPassword = (password: string) => {
        return crypto
            .createHash('sha256')
            .update(password)
            .digest('hex');
    };

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();

        const enteredPassword = prompt('비밀번호를 입력해주세요:');
        if (!enteredPassword) return;

        const hashedInput = hashPassword(enteredPassword);
        if (hashedInput !== HASHED_PASSWORD) {
            alert('비밀번호가 틀렸습니다.');
            return;
        }

        const confirmation = window.confirm('정말로 이 사용자를 삭제하시겠습니까?');
        if (!confirmation) return;

        setIsDeleting(true);

        try {
            const response = await fetch(`/api/users/${user.id}`, { method: 'DELETE' });
            if (response.ok) {
                setTimeout(() => {
                    setIsDeleting(false);
                    window.location.reload();
                }, 500);
            } else {
                alert('사용자 삭제에 실패했습니다.');
                setIsDeleting(false);
            }
        } catch (error) {
            alert('사용자 삭제 중 오류가 발생했습니다.');
            setIsDeleting(false);
        }
    };

    // 해당 년도의 기록이 없는 경우 카드를 렌더링하지 않음
    if (filteredRecords.length === 0) {
        return null;
    }

    return (
        <Link href={`/users/${user.id}`}>
            <div className="border p-4 rounded shadow hover:bg-gray-50 cursor-pointer transition-colors relative">
                <h3 className="font-bold text-lg">{user.name}</h3>
                <p>
                    {selectedYear}년 전적: {totalGames}경기 ({totalWins}승 {totalLosses}패)
                    <br />
                    포인트: {score} / 승률: {winRate}%
                </p>
                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className={`absolute top-4 right-4 px-3 py-1 rounded text-white
                        ${isDeleting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-red-500 hover:bg-red-600'
                    }`}
                >
                    {isDeleting ? (
                        <div className="flex items-center">
                            <svg className="animate-spin h-4 w-4 mr-1" viewBox="0 0 24 24">
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                />
                            </svg>
                            삭제 중...
                        </div>
                    ) : '삭제'}
                </button>
            </div>
        </Link>
    );
};
