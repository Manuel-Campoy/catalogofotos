import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import ToastHandler from "@/components/ToastHandler";
import Footer from "@/components/Footer";

const outfit = Outfit({ subsets: ["latin"], variable: '--font-outfit' });
const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: "GradLens Mx",
  description: "Directorio de Fotografía de Graduación",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${outfit.variable} ${playfair.variable} font-sans bg-[#FDFBF6] text-[#111008]`}>
        <Nav />
        <ToastHandler />
        <div className="pt-15"> 
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}