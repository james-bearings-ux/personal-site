import type { Metadata } from "next";
import { Overpass, Quicksand } from "next/font/google";
import "./globals.css";
import "../styles/tokens.css";
import "../styles/tokens.semantic.css";
import "../styles/tokens.component.css";
import "../styles/tokens.breakpoints.css";
import "../styles/tokens.typography.css";
import "../styles/motion.css";

const overpass = Overpass({
  weight: ["400", "600"],
  subsets: ["latin"],
  variable: "--font-overpass",
});

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
});

export const metadata: Metadata = {
  title: "James Melzer, User Experience Designer",
  description: "Personal site of James Melzer, UX Designer and Information Architect.",
  icons: { icon: [] },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" data-density="default" suppressHydrationWarning>
      <head>
        {/* Blocking script: reads localStorage and prefers-color-scheme before first paint
            to prevent a flash of unstyled theme. Must be inline and synchronous. */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);}else if(window.matchMedia('(prefers-color-scheme: dark)').matches){document.documentElement.setAttribute('data-theme','dark');}var d=localStorage.getItem('density');if(d==='compact'||d==='default'||d==='spacious'){document.documentElement.setAttribute('data-density',d);}}catch(e){}})();` }} />
      </head>
      <body className={`${overpass.variable} ${quicksand.variable}`}>
        {children}
      </body>
    </html>
  );
}
