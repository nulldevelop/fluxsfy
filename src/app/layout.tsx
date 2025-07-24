import { SessionAuthProvider } from '@/components/session-auth';
import { Toaster } from '@/components/ui/sonner';
import '@/styles/globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='pt-BR'>
      <body>
        <SessionAuthProvider>
          {children}
          <Toaster duration={2500} expand={true} richColors />
        </SessionAuthProvider>
      </body>
    </html>
  )
}
