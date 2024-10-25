// app/utils/stats.ts
import { User, OpponentStats } from '../type/user';

export const calculateUserStats = (user: User) => {
    const totalWins = user.records.reduce((acc, record) => acc + record.wins, 0);
    const totalLosses = user.records.reduce((acc, record) => acc + record.losses, 0);
    const totalGames = totalWins + totalLosses;
    const winRate = totalGames > 0
        ? ((totalWins / totalGames) * 100).toFixed(1)
        : '0.0';

    return { totalGames, totalWins, totalLosses, winRate };
};

export const calculateOpponentStats = (user: User): OpponentStats[] => {
    return Object.values(
        user.records.reduce((acc: { [key: string]: OpponentStats }, record) => {
            if (!acc[record.opponent]) {
                acc[record.opponent] = {
                    opponent: record.opponent,
                    wins: 0,
                    losses: 0,
                    winRate: '0.0'
                };
            }
            acc[record.opponent].wins += record.wins;
            acc[record.opponent].losses += record.losses;
            const totalGames = acc[record.opponent].wins + acc[record.opponent].losses;
            acc[record.opponent].winRate = totalGames > 0
                ? ((acc[record.opponent].wins / totalGames) * 100).toFixed(1)
                : '0.0';
            return acc;
        }, {})
    ).sort((a, b) => parseFloat(b.winRate) - parseFloat(a.winRate));
};