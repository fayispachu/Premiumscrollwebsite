import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Premium Cinematic Scroll Website',
  description: 'A premium interactive storytelling website with scroll-driven video, cinematic motion, and luxury design.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
