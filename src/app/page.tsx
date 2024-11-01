'use client';

import React, { useState, useEffect } from 'react';
import crypto from 'crypto';
import { User } from './type/user';
import { BattleForm } from './components/BattleForm';
import { UserSummaryCard } from './components/UserSummaryCard';
import { calculateUserStats } from './utils/stats';
import { useSpring, animated } from '@react-spring/web';

export default function Home() {
    const [users, setUsers] = useState<User[]>([]);
    const [player1, setPlayer1] = useState<string>('');
    const [player2, setPlayer2] = useState<string>('');
    const [showIntro, setShowIntro] = useState(true);

    const HASHED_PASSWORD = '46c6adda1ceaa107d0f71e6adbf4da03dcbc309ee95d681f2d234375ec502b1a';

    const hashPassword = (password: string) => {
        return crypto
            .createHash('sha256')
            .update(password)
            .digest('hex');
    };

    useEffect(() => {
        fetchUsers();
        // localStorage에서 인트로 표시 여부 확인
        const hasSeenIntro = sessionStorage.getItem('hasSeenIntro');

        if (hasSeenIntro) {
            setShowIntro(false);
        } else {
            const timer = setTimeout(() => {
                setShowIntro(false);
                sessionStorage.setItem('hasSeenIntro', 'true');
            }, 3500);
            return () => clearTimeout(timer);
        }

        // 개발자 도구 방지
        const preventDevTools = () => {
            document.addEventListener('contextmenu', (e) => e.preventDefault());
            document.addEventListener('keydown', (e) => {
                if (
                    (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
                    (e.key === 'F12')
                ) {
                    e.preventDefault();
                }
            });
        };

        preventDevTools();
    }, []);

    // 텍스트 애니메이션
    const textAnimation = useSpring({
        from: { opacity: 0, transform: 'translateY(50px)' },
        to: { opacity: 1, transform: 'translateY(0)' },
        delay: 300,
    });

    // 테니스공 애니메이션
    const ballAnimation = useSpring({
        from: { transform: 'translateX(-100vw) rotate(0deg)' },
        to: { transform: 'translateX(100vw) rotate(720deg)' },
        config: { duration: 2000 },
    });

    // 전체 인트로 페이드아웃 애니메이션
    const fadeOut = useSpring({
        opacity: showIntro ? 1 : 0,
        config: { duration: 500 },
    });

    const fetchUsers = async () => {
        const response = await fetch('/api/users');
        const data: User[] = await response.json();

        const sortedUsers = data.sort((a, b) => {
            const statsA = calculateUserStats(a);
            const statsB = calculateUserStats(b);

            // 점수로 정렬 (점수가 같을 경우 승률로 정렬)
            if (statsB.score !== statsA.score) {
                return statsB.score - statsA.score;
            }
            return Number(statsB.winRate) - Number(statsA.winRate);
        });

        setUsers(sortedUsers);
    };

    const resetData = async () => {
        const enteredPassword = prompt('비밀번호를 입력해주세요:');

        if (!enteredPassword) {
            return;
        }

        const hashedInput = hashPassword(enteredPassword);

        if (hashedInput !== HASHED_PASSWORD) {
            alert('비밀번호가 틀렸습니다.');
            return;
        }

        if (window.confirm('모든 데이터를 초기화하시겠습니까?')) {
            await fetch('/api/reset', { method: 'POST' });
            fetchUsers();
        }
    };

    const addBattleResult = async (result: 'win' | 'loss') => {
        if (!player1 || !player2) {
            alert('두 플레이어의 이름을 모두 입력해주세요.');
            return;
        }

        await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: player1,
                opponent: player2,
                result,
            }),
        });

        setPlayer1('');
        setPlayer2('');
        fetchUsers();
    };

    return (
        <>
            {showIntro && (
                <animated.div
                    style={fadeOut}
                    className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center overflow-hidden"
                >
                    <animated.div style={textAnimation} className="text-center z-10">
                        <h1 className="text-7xl font-bold text-black mb-4">파새단</h1>
                        <p className="text-3xl text-gray-600">파주새벽단식테니스</p>
                    </animated.div>
                    <animated.div
                        style={ballAnimation}
                        className="absolute top-1/2 -mt-8"
                    >
                        <div className="w-16 h-16 bg-yellow-400 rounded-full relative">
                            <div className="absolute w-full h-1 bg-white/30 top-1/2 -translate-y-1/2 rotate-45"></div>
                        </div>
                    </animated.div>
                </animated.div>
            )}

            <div className={`p-4 ${showIntro ? 'hidden' : 'block'}`}>
                <h1 className="text-2xl font-bold mb-4 text-black">대전 기록 관리</h1>

                <div className="mb-4">
                    <button
                        onClick={resetData}
                        className="bg-red-500 text-white px-4 py-2 rounded mb-4 hover:bg-red-600"
                    >
                        데이터 초기화
                    </button>
                </div>

                <BattleForm
                    player1={player1}
                    player2={player2}
                    setPlayer1={setPlayer1}
                    setPlayer2={setPlayer2}
                    onBattleResult={addBattleResult}
                    users={users}
                />

                <div className="mt-8">
                    <h2 className="text-xl font-bold mb-4 text-black">전적 현황</h2>
                    <div className="grid gap-4">
                        {users.map((user, index) => (
                            <div key={user.id} className="flex items-center gap-4">
                                <div className={`font-bold w-8 ${
                                    index === 0
                                        ? 'text-4xl text-yellow-500' // 1등: 금색, 가장 큰 크기
                                        : index === 1
                                            ? 'text-3xl text-gray-400' // 2등: 은색, 두 번째 크기
                                            : index === 2
                                                ? 'text-2xl text-amber-700' // 3등: 동색, 세 번째 크기
                                                : 'text-xl text-gray-400' // 나머지: 회색, 작은 크기
                                }`}>
                                    {index + 1}
                                </div>
                                <div className="flex-1">
                                    <UserSummaryCard user={user}/>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}