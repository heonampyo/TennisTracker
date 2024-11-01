// app/utils/stats.ts
import { User, OpponentStats } from '../type/user';

// 점수 계산 로직을 비즈니스 레이어에서 처리
const calculateScore = (wins: number, losses: number): number => {
    return (wins * 3) + (losses);
};

export const calculateUserStats = (user: User) => {
    const totalWins = user.records.reduce((acc, record) => acc + record.wins, 0);
    const totalLosses = user.records.reduce((acc, record) => acc + record.losses, 0);
    const totalGames = totalWins + totalLosses;
    const winRate = totalGames > 0
        ? ((totalWins / totalGames) * 100).toFixed(1)
        : '0.0';
    const score = calculateScore(totalWins, totalLosses);

    return {
        totalGames,
        totalWins,
        totalLosses,
        winRate,
        score
    };
};

export const calculateOpponentStats = (user: User): OpponentStats[] => {
    const opponentStats = user.records.reduce((acc: { [key: string]: OpponentStats }, record) => {
        if (!acc[record.opponent]) {
            acc[record.opponent] = {
                opponent: record.opponent,
                wins: 0,
                losses: 0,
                winRate: '0.0',
                score: 0
            };
        }

        acc[record.opponent].wins += record.wins;
        acc[record.opponent].losses += record.losses;

        const totalGames = acc[record.opponent].wins + acc[record.opponent].losses;
        // 승률 계산
        acc[record.opponent].winRate = totalGames > 0
            ? ((acc[record.opponent].wins / totalGames) * 100).toFixed(1)
            : '0.0';

        // 점수 계산
        acc[record.opponent].score = calculateScore(
            acc[record.opponent].wins,
            acc[record.opponent].losses
        );

        return acc;
    }, {});

    // 점수와 승률로 정렬된 배열 반환
    return Object.values(opponentStats).sort((a, b) => {
        if (b.score !== a.score) {
            return b.score - a.score;
        }
        return parseFloat(b.winRate) - parseFloat(a.winRate);
    });
};
