import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "./globals.css";
import { UserContextProvider } from "./store/userContext";
import { BreweryContextProvider } from "./store/breweryContext";

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bees Frontend Interview",
  description: "A simple Next.js application for the Bees Frontend Interview",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${workSans.variable} antialiased`}>
        <UserContextProvider>
          <BreweryContextProvider>
            {children}
          </BreweryContextProvider>
        </UserContextProvider>
      </body>
    </html>
  );
}