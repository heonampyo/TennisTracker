// app/types/user.ts
export interface User {
    id: number;
    name: string;
    fcmToken?: string;
    isAllPush: boolean;
    records: Record[];
}

export interface Record {
    id: number;
    opponent: string;
    wins: number;
    losses: number;
    createdAt: string;
}

export interface OpponentStats {
    opponent: string;
    wins: number;
    losses: number;
    winRate: string;
    score: number;
}