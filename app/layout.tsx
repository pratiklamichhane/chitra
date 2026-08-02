import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "driver.js/dist/driver.css";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Chitra Studio - Passport Photo Maker",
    template: "%s | Chitra Studio",
  },
  description:
    "Create professional passport, visa, and ID photos online with Chitra Studio. Remove backgrounds, set exact print sizes, and export ready-to-use photo sheets.",
  applicationName: "Chitra Studio",
  keywords: [
    "Chitra Studio",
    "passport photo maker",
    "visa photo maker",
    "ID photo maker",
    "online photo editor",
    "background remover",
    "photo sheet maker",
  ],
  openGraph: {
    title: "Chitra Studio - Passport Photo Maker",
    description:
      "Create professional passport, visa, and ID photos online with background removal, exact sizing, and ready-to-use exports.",
    siteName: "Chitra Studio",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Chitra Studio - Passport Photo Maker",
    description:
      "Create passport, visa, and ID photos online with exact sizing, background cleanup, and ready-to-use exports.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
