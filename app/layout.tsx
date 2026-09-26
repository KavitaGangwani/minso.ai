import type { Metadata } from 'next';
import './globals.css';

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
      <body>{children}</body>
    </html>
  );
}
