import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import '@/styles/globals.css'
import { Toaster } from 'sonner'
import { SessionAuthProvider } from '@/components/session-auth'
import { QueryProvider } from '@/providers/queryclient'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'FlusxFy | Encontre os melhores profissionais em um único local!',
  description:
    'A plataforma completa para profissionais e barbearias: organize seus atendimentos e ganhe mais tempo para o que importa.',
  keywords: ['FlusxFy', 'Barber', 'Barbearia', 'SaaS', 'Agendamento', 'Profissional'],
  icons: '/logofluxsfy.png',
  robots: {
    index: true,
    follow: true,
    nocache: true,
  },
  openGraph: {
    title: 'FlusxFy | Encontre os melhores profissionais em um único local!',
    description:
      'A plataforma completa para profissionais e barbearias: organize seus atendimentos e ganhe mais tempo para o que importa.',
    images: ['/logofluxsfy.png'],
    url: 'https://fluxsfy.com',
    siteName: 'FlusxFy',
    locale: 'pt-BR',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='pt-BR'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionAuthProvider>
          <QueryProvider>
            <Toaster duration={2500} />
            {children}
          </QueryProvider>
        </SessionAuthProvider>
      </body>
    </html>
  )
}
