import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Harvest Videos — OME Solution',
  description: 'Real-time monitoring for video harvester processing',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
