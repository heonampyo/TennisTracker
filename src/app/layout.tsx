import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '파새단(파주 새벽 단식 테니스)',
  description: '파주 상지석 테니스장 (일)새벽 6시',
  openGraph: {
    title: '파새단(파주 새벽 단식 테니스)',
    description: '파주 상지석 테니스장 (일)새벽 6시',
    images: 'https://tennis-tracker-azure.vercel.app/pasaedan.jpg',
    url: 'https://tennis-tracker-azure.vercel.app',
    locale: 'ko_KR',
    type: 'website',
  },
  // 인스타그램용 메타 태그
  other: {
    'instagram:card': 'summary_large_image',
    'instagram:title': '파새단(파주 새벽 단식 테니스)',
    'instagram:description': '파주 상지석 테니스장 (일)새벽 6시',
    'instagram:image': 'https://tennis-tracker-azure.vercel.app/pasaedan.jpg',
  }
}

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode
}) {
  return (
      <html lang="ko">
      <body className={inter.className}>{children}</body>
      </html>
  )
}
