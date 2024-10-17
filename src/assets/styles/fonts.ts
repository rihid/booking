import {
  JetBrains_Mono as FontMono,
  Plus_Jakarta_Sans as FontSans,
} from 'next/font/google';

export const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  preload: false,
});

export const fontMono = FontMono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  preload: false,
});
