// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma'

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: Number(params.id) },
            include: { records: true },
        });

        if (!user) {
            return NextResponse.json({ error: '사용자를 찾을 수 없습니다.' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ error: '사용자 조회 실패' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const userId = parseInt(params.id);

        // 삭제할 사용자 정보 조회
        const userToDelete = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true
            }
        });

        if (!userToDelete) {
            return NextResponse.json(
                { error: '사용자를 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        // 트랜잭션으로 모든 관련 데이터 삭제
        await prisma.$transaction(async (tx) => {
            // 1. 상대방의 전적에서 이 사용자의 이름이 opponent로 있는 모든 기록 삭제
            await tx.record.deleteMany({
                where: {
                    opponent: userToDelete.name.toString()
                }
            });

            // 2. 이 사용자의 전적에서 상대방이 opponent로 있는 모든 기록 삭제
            await tx.record.deleteMany({
                where: {
                    userId: userId
                }
            });

            // 3. 사용자 삭제
            await tx.user.delete({
                where: {
                    id: userId
                }
            });
        });

        return NextResponse.json(
            {
                message: '사용자와 관련된 모든 데이터가 성공적으로 삭제되었습니다.',
                deletedUser: userToDelete.name
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('사용자 삭제 중 오류:', error);
        return NextResponse.json(
            {
                error: '사용자 삭제 중 오류가 발생했습니다.',
                details: error instanceof Error ? error.message : '알 수 없는 오류'
            },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
