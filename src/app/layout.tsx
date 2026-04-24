import type { Metadata } from 'next'
import { Barlow_Condensed, Bebas_Neue } from 'next/font/google'
import '@/styles/globals.css'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Toaster } from 'sonner'
import { PwaInstaller } from '@/components/pwa-installer'
import { SessionAuthProvider } from '@/components/session-auth'
import { QueryProvider } from '@/providers/queryclient'

const bebasNeue = Bebas_Neue({
  weight: '400',
  variable: '--font-bebas-neue',
  subsets: ['latin'],
})

const barlowCondensed = Barlow_Condensed({
  weight: ['300', '400', '600', '700', '800', '900'],
  variable: '--font-barlow-condensed',
  subsets: ['latin'],
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.fluxsfy.com.br'

export const metadata: Metadata = {
  verification: {
    google: 'td2lr96g3W26eGQFYEtsl7Ue4l-w1XpxcETrvKV0HtI',
  },
  metadataBase: new URL(siteUrl),
  title: 'Fluxsfy — Encontre os melhores profissionais em um único local',
  description:
    'Fluxsfy é a plataforma para profissionais e barbearias: organize seus atendimentos e ganhe mais tempo para o que importa.',
  keywords: [
    'Fluxsfy',
    'Barber',
    'Barbearia',
    'SaaS',
    'Agendamento',
    'Profissional',
  ],
  icons: {
    icon: '/logofluxsfy.png',
    shortcut: '/logofluxsfy.png',
    apple: '/logofluxsfy.png',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/',
    languages: { 'pt-BR': '/' },
  },
  openGraph: {
    title: 'Fluxsfy — Encontre os melhores profissionais em um único local',
    description:
      'Fluxsfy é a plataforma para profissionais e barbearias: organize seus atendimentos e ganhe mais tempo para o que importa.',
    images: [
      { url: '/logofluxsfy.png', width: 1200, height: 630, alt: 'Fluxsfy' },
    ],
    url: siteUrl,
    siteName: 'Fluxsfy',
    locale: 'pt-BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fluxsfy — Encontre os melhores profissionais em um único local',
    description:
      'Fluxsfy é a plataforma para profissionais e barbearias: organize seus atendimentos e ganhe mais tempo para o que importa.',
    images: ['/logofluxsfy.png'],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'Fluxsfy',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='pt-BR'>
      <head>
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: dev
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Fluxsfy',
              url: siteUrl,
              logo: `${siteUrl}/logofluxsfy.png`,
              sameAs: [],
            }),
          }}
          type='application/ld+json'
        />
      </head>
      <body
        className={`${bebasNeue.variable} ${barlowCondensed.variable} font-barlow antialiased`}
      >
        <SessionAuthProvider>
          <QueryProvider>
            <Toaster duration={2500} />
            {children}
            <PwaInstaller />
            <Analytics />
            <SpeedInsights />
          </QueryProvider>
        </SessionAuthProvider>
      </body>
    </html>
  )
}
