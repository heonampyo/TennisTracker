// 1. 데이터 초기화를 위한 새로운 API 라우트
// app/api/reset/route.ts
import { NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma'

export async function POST() {
    try {
        // 먼저 Record 테이블의 모든 데이터 삭제
        await prisma.record.deleteMany({});
        // 그 다음 User 테이블의 모든 데이터 삭제
        await prisma.user.deleteMany({});

        return NextResponse.json({ message: '모든 데이터가 초기화되었습니다.' });
    } catch (error) {
        return NextResponse.json({ error: '데이터 초기화 실패' }, { status: 500 });
    }
}