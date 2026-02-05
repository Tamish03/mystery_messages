import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import Navbar from "@/components/Navbar"; // New Import
import { Toaster } from "react-hot-toast"; // Install with: npm i react-hot-toast

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mystery Messages",
  description: "Send and receive anonymous messages securely.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <Navbar /> 
          <main>{children}</main>
          <Toaster position="bottom-right" />
        </body>
      </AuthProvider>
    </html>
  );
}