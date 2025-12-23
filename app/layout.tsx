import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar"; // Import the Navbar

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Modern Ledger | Double Entry Accounting",
  description: "Secure accounting using Next.js and SQL Server",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        {/* The Navbar stays at the top */}
        <Navbar />

        {/* The main content changes based on the route */}
        <main className="py-4">
          {children}
        </main>
      </body>
    </html>
  );
}