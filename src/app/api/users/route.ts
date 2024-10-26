// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET() {
    const users = await prisma.user.findMany({
        include: { records: true },
    });
    return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
    const { name, opponent, result } = await request.json();

    try {
        // 첫 번째 사용자 찾기 또는 생성
        let user1 = await prisma.user.findFirst({ where: { name } });
        if (!user1) {
            user1 = await prisma.user.create({ data: { name } });
        }

        // 두 번째 사용자 찾기 또는 생성
        let user2 = await prisma.user.findFirst({ where: { name: opponent } });
        if (!user2) {
            user2 = await prisma.user.create({ data: { name: opponent } });
        }

        // 첫 번째 사용자의 기록 생성
        await prisma.record.create({
            data: {
                userId: user1.id,
                opponent: opponent,
                wins: result === 'win' ? 1 : 0,
                losses: result === 'loss' ? 1 : 0,
            },
        });

        // 두 번째 사용자의 기록 생성 (반대 결과)
        await prisma.record.create({
            data: {
                userId: user2.id,
                opponent: name,
                wins: result === 'loss' ? 1 : 0,
                losses: result === 'win' ? 1 : 0,
            },
        });

        return NextResponse.json({ message: '기록이 추가되었습니다.' });
    } catch (error) {ㅈㄷ
        return NextResponse.json({ error: '기록 추가 실패' }, { status: 500 });
    }
}