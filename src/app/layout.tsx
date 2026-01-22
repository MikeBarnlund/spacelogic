import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "SpaceLogic - AI-Powered Office Space Planning",
  description: "Transform how you analyze office space needs. Generate multiple professional scenarios in real-time during client meetings using AI.",
  keywords: ["commercial real estate", "office space planning", "CRE", "tenant representation", "space calculator"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <Header />
        <main className="pt-16 lg:pt-18">
          {children}
        </main>
      </body>
    </html>
  );
}
