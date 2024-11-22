// app/api/fcm/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function POST(request: NextRequest) {
    try {
        const requestData = await request.json();
        const { userId, fcmToken } = requestData;

        const requestLog = {
            receivedData: requestData,
            timestamp: new Date().toISOString()
        };

        if (!userId || !fcmToken) {
            return NextResponse.json({
                error: '필수 파라미터가 누락되었습니다.',
                debug: {
                    ...requestLog,
                    validationError: {
                        userId: !userId ? 'missing' : 'present',
                        fcmToken: !fcmToken ? 'missing' : 'present'
                    }
                }
            }, { status: 400 });
        }

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
            user: updatedUser,
            debug: {
                ...requestLog,
                success: true
            }
        });

    } catch (error: unknown) {
        const errorResponse: {
            error: string;
            debug: {
                timestamp: string;
                errorName?: string;
                errorMessage?: string;
                errorStack?: string;
                prismaError?: {
                    code?: string;
                    meta?: unknown;
                    clientVersion?: string;
                };
            };
        } = {
            error: 'FCM 토큰 업데이트 실패',
            debug: {
                timestamp: new Date().toISOString(),
            }
        };

        if (error instanceof Error) {
            errorResponse.debug.errorName = error.name;
            errorResponse.debug.errorMessage = error.message;
            errorResponse.debug.errorStack =
                process.env.NODE_ENV === 'development' ? error.stack : undefined;
        }

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            errorResponse.debug.prismaError = {
                code: error.code,
                meta: error.meta,
                clientVersion: error.clientVersion
            };

            if (error.code === 'P2025') {
                return NextResponse.json({
                    ...errorResponse,
                    error: '사용자를 찾을 수 없습니다.'
                }, { status: 404 });
            }
        }

        return NextResponse.json(errorResponse, { status: 500 });
    }
}