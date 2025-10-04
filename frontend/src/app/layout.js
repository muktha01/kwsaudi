
import Script from 'next/script';
import DynamicAnalytics from './DynamicAnalytics';
import LanguageHandler from '@/components/LanguageHandler';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Dancing_Script } from 'next/font/google'
import Providers from "./Providers"; // 🔹 client wrapper
// Import metadata if needed for logic, but do not export it from this file
// import { metadata } from "./metadata";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const dancing = Dancing_Script({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


// metadata has been moved to ./metadata.js for server-side export


export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/kwline.png" type="image/png"/></head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} language-transition`}
      >
        <Providers>
          <LanguageHandler />
          {children}
        </Providers>
        <DynamicAnalytics />
      </body>
    </html>
  );
}
