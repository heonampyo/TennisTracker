// lib/firebase-admin.ts
import admin from 'firebase-admin';

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
        })
    });
}

export const sendPushNotification = async (fcmToken: string, title: string, body: string) => {
    try {
        if (!fcmToken) {
            throw new Error('FCM 토큰이 없습니다.');
        }

        const message = {
            notification: {
                title,
                body,
            },
            token: fcmToken
        };

        const response = await admin.messaging().send(message);
        return response;
    } catch (error) {
        console.error('Push 알림 전송 실패:', error);
        throw error;
    }
};