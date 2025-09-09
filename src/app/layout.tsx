import type { Metadata } from 'next';
import '../styles/globals.css';
import { UserProvider } from './context/UserContext';

export const metadata: Metadata = {
  title: 'Plataforma de Inovação Aberta',
  description: 'Conectando corporações e startups para acelerar a inovação',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className=''>
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}