// app/types/user.ts
export interface User {
    id: number;
    name: string;
    records: Record[];
}

export interface Record {
    id: number;
    opponent: string;
    wins: number;
    losses: number;
}

export interface OpponentStats {
    opponent: string;
    wins: number;
    losses: number;
    winRate: string;
}