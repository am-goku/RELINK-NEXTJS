import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from 'next/font/google'
import '@/styles/nprogress.css';
import UserProvider from "../context/UserContext";
import SessionProviderWrapper from "@/providers/SessionProviderWrapper";
import ProtectedRoute from "@/providers/ProtectedRoute";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import NProgressProvider from "@/providers/NProgressProvider";
import { ThemeProvider } from "@/context/ThemeContext";


const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap', // Ensures the font is loaded first, avoiding "flash of unstyled text"
})

export const metadata: Metadata = {
  title: "Relink",
  description: "A social media application.",
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <body className={poppins.className}>
        <SessionProviderWrapper session={session}>
          <UserProvider>
            <ProtectedRoute>
              <ThemeProvider>
                <NProgressProvider>
                  {children}
                </NProgressProvider>
              </ThemeProvider>
            </ProtectedRoute>
          </UserProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  )
}
