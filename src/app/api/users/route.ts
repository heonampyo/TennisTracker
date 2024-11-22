// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client';
import crypto from 'crypto';
import { sendPushNotification } from '@/lib/firebase-admin';

export async function GET() {
    const users = await prisma.user.findMany({
        include: { records: true },
    });
    return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
    const { name, opponent, result } = await request.json();
    const matchId = crypto.randomUUID();
    const now = new Date();

    try {
        // 첫 번째 사용자 찾기 또는 생성
        let user1 = await prisma.user.findFirst({
            where: { name },
            select: {
                id: true,
                name: true,
                fcmToken: true,
                isAllPush: true
            }
        });
        if (!user1) {
            user1 = await prisma.user.create({
                data: {
                    name,
                    isAllPush: true // 기본값 설정
                },
                select: {
                    id: true,
                    name: true,
                    fcmToken: true,
                    isAllPush: true
                }
            });
        }

        // 두 번째 사용자 찾기 또는 생성
        let user2 = await prisma.user.findFirst({
            where: { name: opponent },
            select: {
                id: true,
                name: true,
                fcmToken: true,
                isAllPush: true
            }
        });
        if (!user2) {
            user2 = await prisma.user.create({
                data: {
                    name: opponent,
                    isAllPush: true // 기본값 설정
                },
                select: {
                    id: true,
                    name: true,
                    fcmToken: true,
                    isAllPush: true
                }
            });
        }

        // 첫 번째 사용자의 기록 생성
        await prisma.record.create({
            data: {
                matchId,
                userId: user1.id,
                opponent: opponent,
                wins: result === 'win' ? 1 : 0,
                losses: result === 'loss' ? 1 : 0,
                createdAt: now
            },
        });

        // 두 번째 사용자의 기록 생성
        await prisma.record.create({
            data: {
                matchId,
                userId: user2.id,
                opponent: name,
                wins: result === 'loss' ? 1 : 0,
                losses: result === 'win' ? 1 : 0,
                createdAt: now
            },
        });

        // 푸시 알림 전송을 위한 배열
        const pushNotifications = [];

        // 1. 경기 참여자들에게 푸시 알림 전송
        if (user1.fcmToken) {
            pushNotifications.push(
                sendPushNotification(
                    user1.fcmToken,
                    '새로운 경기 결과',
                    `${opponent}님과의 경기 결과: ${result === 'win' ? '승리' : '패배'}`
                )
            );
        }

        if (user2.fcmToken) {
            pushNotifications.push(
                sendPushNotification(
                    user2.fcmToken,
                    '새로운 경기 결과',
                    `${name}님과의 경기 결과: ${result === 'loss' ? '승리' : '패배'}`
                )
            );
        }

        // 2. isAllPush가 true인 사용자들 중 경기 참여자를 제외한 사용자들에게 푸시 알림 전송
        const allPushUsers = await prisma.user.findMany({
            where: {
                isAllPush: true,
                fcmToken: {
                    not: null
                },
                AND: [
                    { name: { not: name } },
                    { name: { not: opponent } }
                ]
            },
            select: {
                name: true,
                fcmToken: true
            }
        });

        // 모든 구독자에게 경기 결과 알림 전송
        allPushUsers.forEach(user => {
            if (user.fcmToken) {
                pushNotifications.push(
                    sendPushNotification(
                        user.fcmToken,
                        '새로운 경기 알림',
                        `${name}님과 ${opponent}님의 경기 결과: ${name}님 ${result === 'win' ? '승리' : '패배'}`
                    )
                );
            }
        });

        // 모든 푸시 알림 비동기 처리
        await Promise.allSettled(pushNotifications);

        return NextResponse.json({
            message: '기록이 추가되었습니다.',
            debug: {
                participantsCount: 2,
                subscribersCount: allPushUsers.length,
                totalPushNotifications: pushNotifications.length
            }
        });

    } catch (error) {
        console.error('Error creating records:', error);
        const errorResponse: {
            error: string;
            debug?: {
                errorName?: string;
                errorMessage?: string;
                errorStack?: string;
                prismaError?: {
                    code?: string;
                    meta?: unknown;
                };
            };
        } = {
            error: '기록 추가 실패'
        };

        if (error instanceof Error) {
            errorResponse.debug = {
                errorName: error.name,
                errorMessage: error.message,
                errorStack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            };
        }

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            errorResponse.debug = {
                ...errorResponse.debug,
                prismaError: {
                    code: error.code,
                    meta: error.meta
                }
            };
        }

        return NextResponse.json(errorResponse, { status: 500 });
    }
}