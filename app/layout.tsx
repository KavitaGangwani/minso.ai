import type { Metadata } from 'next';
import {
  Bricolage_Grotesque,
  Instrument_Serif,
  Hanken_Grotesk,
  JetBrains_Mono,
} from 'next/font/google';
import './globals.css';

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  weight: ['500', '600', '700', '800'],
  display: 'swap',
});

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  variable: '--font-instrument',
  style: ['italic'],
  weight: '400',
  display: 'swap',
});

const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-hanken',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  weight: ['500', '600'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MINSO.AI – Mining Agents',
  description:
    'AI agents for the mining industry. Each one reads its own documents and shows the page every answer came from.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${bricolage.variable} ${instrumentSerif.variable} ${hanken.variable} ${jetbrainsMono.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
