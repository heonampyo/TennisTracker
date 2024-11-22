// app/api/fcm/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function POST(request: NextRequest) {
    try {
        const requestData = await request.json();
        const { userId, fcmToken, isAllPush } = requestData;

        const requestLog = {
            receivedData: requestData,
            timestamp: new Date().toISOString()
        };

        // 필수 파라미터 검증
        if (!userId || !fcmToken || isAllPush === undefined) {
            return NextResponse.json({
                error: '필수 파라미터가 누락되었습니다.',
                debug: {
                    ...requestLog,
                    validationError: {
                        userId: !userId ? 'missing' : 'present',
                        fcmToken: !fcmToken ? 'missing' : 'present',
                        isAllPush: isAllPush === undefined ? 'missing' : 'present'
                    }
                }
            }, { status: 400 });
        }

        // 1. 이름으로 사용자 조회
        const user = await prisma.user.findFirst({
            where: {
                name: userId
            }
        });

        if (!user) {
            return NextResponse.json({
                error: '해당 이름의 사용자를 찾을 수 없습니다.',
                debug: {
                    ...requestLog,
                    searchedName: userId
                }
            }, { status: 404 });
        }

        // 2. 찾은 사용자의 ID로 FCM 토큰과 isAllPush 값 업데이트
        const updatedUser = await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                fcmToken: fcmToken,
                isAllPush: isAllPush
            }
        });

        return NextResponse.json({
            message: 'FCM 토큰과 알림 설정이 업데이트되었습니다.',
            user: updatedUser,
            debug: {
                ...requestLog,
                success: true,
                userId: user.id
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