import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Header from "@/components/Header";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", '600', "700"],
});

export const metadata: Metadata = {
  title: "Ubuntu Cheat Sheet",
  description: "A quick reference guide for Ubuntu commands and setup.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="scroll-smooth">
      <body className={`${poppins.variable} font-sans antialiased`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
