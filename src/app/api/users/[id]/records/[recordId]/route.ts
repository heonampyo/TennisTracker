import { NextRequest, NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma'

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string; recordId: string } }
) {
    try {
        const userId = parseInt(params.id);
        const recordId = parseInt(params.recordId);

        if (isNaN(userId) || isNaN(recordId)) {
            return NextResponse.json(
                { error: '잘못된 ID 형식입니다.' },
                { status: 400 }
            );
        }

        // 삭제할 기록 조회
        const recordToDelete = await prisma.record.findFirst({
            where: {
                id: recordId,
                userId: userId
            }
        });

        if (!recordToDelete) {
            return NextResponse.json(
                { error: '해당 기록을 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        // matchId를 사용하여 관련된 모든 기록 삭제
        await prisma.record.deleteMany({
            where: {
                matchId: recordToDelete.matchId
            }
        });

        return NextResponse.json(
            {
                message: '기록이 성공적으로 삭제되었습니다.',
                deletedMatchId: recordToDelete.matchId
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('기록 삭제 중 오류:', error);
        return NextResponse.json(
            {
                error: '기록 삭제 중 오류가 발생했습니다.',
                details: error instanceof Error ? error.message : '알 수 없는 오류'
            },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
