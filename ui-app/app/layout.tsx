import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { GlobalStateProvider } from "@/lib/GlobalStateContext";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Query builder",
  description: "Query builder for Data Extractor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <GlobalStateProvider>{children}</GlobalStateProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
