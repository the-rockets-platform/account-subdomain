import './globals.css'
import type { Metadata, ServerRuntime } from 'next'
import { Inter } from 'next/font/google';
import { NextAuthProvider } from '@/providers/next-auth';
import { ThemeWrepper } from '@/theme/theme-wrepper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'The Rockets',
  description: 'Painel de administração',
  colorScheme: 'dark',
  applicationName: 'The Rockets - Admin Area',
  keywords: ['Conta', 'info produtos']
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <NextAuthProvider>
          <ThemeWrepper>
            {children}
          </ThemeWrepper>
        </NextAuthProvider>
      </body>
    </html>
  );
}
