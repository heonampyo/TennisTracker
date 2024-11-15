"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '../../type/user';
import { calculateUserStats, calculateOpponentStats } from '../../utils/stats';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartData,
    ChartOptions
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface Props {
    params: { id: string }
}

interface ModalProps {
    opponent: string;
    stats: {
        total: number;
        wins: number;
        losses: number;
    };
    recentMatches: Array<{
        result: '승' | '패';
        createdAt: string;
    }>;
    onClose: () => void;
}

const formatDateForGrouping = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(date);
};

const LoadingSpinner = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mb-4"></div>
            <p className="text-gray-900">로딩 중...</p>
        </div>
    </div>
);

const MatchModal: React.FC<ModalProps> = ({ opponent, stats, recentMatches, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl min-w-[300px]">
            <h3 className="text-xl font-bold mb-4">{opponent}</h3>

            <div className="mb-4">
                <p className="text-lg mb-2">전체 전적</p>
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-gray-100 p-2 rounded">
                        <div className="text-sm text-gray-600">총 경기</div>
                        <div className="font-bold">{stats.total}</div>
                    </div>
                    <div className="bg-gray-100 p-2 rounded">
                        <div className="text-sm text-gray-600">승</div>
                        <div className="font-bold text-green-600">{stats.wins}</div>
                    </div>
                    <div className="bg-gray-100 p-2 rounded">
                        <div className="text-sm text-gray-600">패</div>
                        <div className="font-bold text-red-600">{stats.losses}</div>
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <p className="text-lg mb-2">최근 3경기</p>
                <div className="flex gap-2 justify-center">
                    {recentMatches.map((match, index) => (
                        <div
                            key={index}
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold
                                ${match.result === '승' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
                        >
                            {match.result}
                        </div>
                    ))}
                </div>
            </div>

            <button
                onClick={onClose}
                className="w-full bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
                닫기
            </button>
        </div>
    </div>
);

export default function UserDetail({ params }: Props) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [deletingRecordId, setDeletingRecordId] = useState<number | null>(null);
    const [selectedMatch, setSelectedMatch] = useState<{
        opponent: string;
        stats: {
            total: number;
            wins: number;
            losses: number;
        };
        recentMatches: Array<{
            result: '승' | '패';
            createdAt: string;
        }>;
    } | null>(null);

    const router = useRouter();

    useEffect(() => {
        fetchUserData();
    }, [params.id]);

    const fetchUserData = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/users/${params.id}`);
            if (!response.ok) {
                throw new Error('사용자 데이터를 불러오는데 실패했습니다.');
            }
            const data = await response.json();
            setUser(data);
        } catch (error) {
            console.error('Error fetching user data:', error);
            alert('데이터를 불러오는 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const deleteRecord = async (recordId: number) => {
        const record = user?.records.find(r => r.id === recordId);
        if (!record || !user) return;

        const result = record.wins > 0 ? '승리' : '패배';
        const formattedDate = formatDateForGrouping(record.createdAt);

        if (!window.confirm(
            `다음 전적을 삭제하시겠습니까?\n\n` +
            `상대: ${record.opponent}\n` +
            `결과: ${result}\n` +
            `날짜: ${formattedDate}`
        )) return;

        try {
            setDeletingRecordId(recordId);
            const response = await fetch(`/api/users/${params.id}/records/${recordId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || '전적 삭제에 실패했습니다.');
            }

            // 성공적으로 삭제된 경우 UI 업데이트
            const updatedRecords = user.records.filter(r => r.id !== recordId);
            setUser({ ...user, records: updatedRecords });

            // 전체 데이터 새로고침
            await fetchUserData();
        } catch (error) {
            console.error('Error deleting record:', error);
            alert('전적 삭제 중 오류가 발생했습니다.');
        } finally {
            setDeletingRecordId(null);
        }
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (!user) {
        return <div className="p-6 text-black">사용자를 찾을 수 없습니다.</div>;
    }

    const { totalGames, totalWins, totalLosses, winRate } = calculateUserStats(user);
    const opponentStats = calculateOpponentStats(user);

    const chartData = {
        labels: opponentStats.map(stat => stat.opponent),
        datasets: [
            {
                label: '승률',
                data: opponentStats.map(stat => Number(stat.winRate)),
                backgroundColor: opponentStats.map(stat => {
                    const winRatio = Number(stat.winRate) / 100;
                    return `rgba(${255 - (winRatio * 255)}, ${winRatio * 255}, 0, 0.6)`;
                }),
                borderWidth: 1,
            }
        ]
    };

    const chartOptions: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => `승률: ${Number(context.raw).toFixed(1)}%`,
                    afterLabel: () => '클릭하여 상세 정보 보기'
                },
                titleFont: {
                    size: 14
                },
                bodyFont: {
                    size: 13
                },
                padding: 10,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    callback: function(value) {
                        return value + '%';
                    }
                }
            }
        },
        onClick: (event, elements) => {
            if (elements && elements.length > 0) {
                const index = elements[0].index;
                const stat = opponentStats[index];

                const recentMatches = user.records
                    .filter(record => record.opponent === stat.opponent)
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 3)
                    .map(record => ({
                        result: record.wins > 0 ? ('승' as const) : ('패' as const),
                        createdAt: record.createdAt
                    }));

                setSelectedMatch({
                    opponent: stat.opponent,
                    stats: {
                        total: stat.wins + stat.losses,
                        wins: stat.wins,
                        losses: stat.losses
                    },
                    recentMatches
                });
            }
        }
    };

    return (
        <div className="p-6 text-black">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-black">{user.name}님의 상세 전적</h1>
                <button
                    onClick={() => router.back()}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                >
                    뒤로가기
                </button>
            </div>

            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                <h2 className="text-xl font-semibold mb-2 text-black">전체 통계</h2>
                <p className="text-black">
                    총 {totalGames}경기 ({totalWins}승 {totalLosses}패) - 승률: {winRate}%
                </p>
            </div>

            <div className="mb-8 p-4 bg-white rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4 text-black">상대별 승률</h2>
                <div className="h-[400px] relative">
                    <Bar data={chartData} options={chartOptions} />
                </div>
            </div>

            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-black">상대별 전적</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 border-b text-left text-black">상대</th>
                            <th className="px-6 py-3 border-b text-left text-black">승</th>
                            <th className="px-6 py-3 border-b text-left text-black">패</th>
                            <th className="px-6 py-3 border-b text-left text-black">승률</th>
                        </tr>
                        </thead>
                        <tbody>
                        {opponentStats.map((stat, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="px-6 py-4 border-b text-black">{stat.opponent}</td>
                                <td className="px-6 py-4 border-b text-black">{stat.wins}</td>
                                <td className="px-6 py-4 border-b text-black">{stat.losses}</td>
                                <td className="px-6 py-4 border-b text-black">
                                    {Number(stat.winRate).toFixed(1)}%
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-4 text-black">전체 매치 기록</h2>
                <div className="space-y-4">
                    {Object.entries(
                        user.records
                            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                            .reduce((groups: { [key: string]: typeof user.records }, record) => {
                                const date = formatDateForGrouping(record.createdAt);
                                if (!groups[date]) {
                                    groups[date] = [];
                                }
                                groups[date].push(record);
                                return groups;
                            }, {})
                    ).map(([date, records]) => (
                        <div key={date} className="border rounded-lg overflow-hidden">
                            <div className="bg-gray-100 px-4 py-2 font-medium text-black">
                                {date}
                            </div>
                            <div className="divide-y">
                                {records.map((record) => {
                                    const matchTime = new Date(record.createdAt);
                                    const timeString = matchTime.toLocaleTimeString('ko-KR', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false
                                    });

                                    const isDeleting = deletingRecordId === record.id;

                                    return (
                                        <div key={record.id} className="p-3 bg-white hover:bg-gray-50 transition-colors">
                                            <div className="flex justify-between items-center">
                                                <div className="flex-grow">
                                                    <span className="flex items-center gap-2">
                                                        <span className="font-medium">                                                        vs {record.opponent}</span>
                                                        {record.wins > 0 ? (
                                                            <span className="text-green-600 font-semibold">승리</span>
                                                        ) : (
                                                            <span className="text-red-600 font-semibold">패배</span>
                                                        )}
                                                    </span>
                                                    <span className="text-gray-600 text-sm block mt-1">
                                                        {timeString}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => deleteRecord(record.id)}
                                                    className={`text-gray-400 hover:text-red-500 transition-colors p-2 
                                                        rounded-full hover:bg-red-50 ${isDeleting ? 'cursor-not-allowed opacity-50' : ''}`}
                                                    disabled={isDeleting}
                                                    title="전적 삭제"
                                                >
                                                    {isDeleting ? (
                                                        <div className="animate-spin h-5 w-5 border-2 border-gray-500 border-t-transparent rounded-full" />
                                                    ) : (
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-5 w-5"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                            />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedMatch && (
                <MatchModal
                    opponent={selectedMatch.opponent}
                    stats={selectedMatch.stats}
                    recentMatches={selectedMatch.recentMatches}
                    onClose={() => setSelectedMatch(null)}
                />
            )}
        </div>
    );
}
