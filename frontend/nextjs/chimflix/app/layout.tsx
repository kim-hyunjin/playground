import Providers from '@/utils/providers';
import { Roboto } from 'next/font/google';
import '../styles/globals.css';

const roboto = Roboto({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: 'Chimflix',
  description: 'netflix style fan page for Youtuber calmdownman',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='kr' className={roboto.className}>
      <body id='root'>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
