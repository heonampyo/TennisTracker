// app/api/fcm/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function POST(request: NextRequest) {
    try {
        const { userId, fcmToken } = await request.json();

        if (!userId || !fcmToken) {
            return NextResponse.json(
                { error: '필수 파라미터가 누락되었습니다.' },
                { status: 400 }
            );
        }

        // Prisma 타입 정의를 명시적으로 사용
        const updateData: Prisma.UserUpdateInput = {
            fcmToken: fcmToken
        };

        const updatedUser = await prisma.user.update({
            where: {
                id: userId
            },
            data: updateData
        });

        return NextResponse.json({
            message: 'FCM 토큰이 업데이트되었습니다.',
            user: updatedUser
        });

    } catch (error) {
        return NextResponse.json(
            { error: 'FCM 토큰 업데이트 실패' },
            { status: 500 }
        );
    }
}