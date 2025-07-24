import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from '@next/font/google'
import '@/styles/nprogress.css';
import NProgressProvider from "../components/NProgressProvider";
import UserProvider from "../providers/UserProvider";
import SessionProviderWrapper from "@/providers/SessionProviderWrapper";
import ProtectedRoute from "@/providers/ProtectedRoute";


const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap', // Ensures the font is loaded first, avoiding "flash of unstyled text"
})

export const metadata: Metadata = {
  title: "Relink",
  description: "A social media application.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <SessionProviderWrapper>
          <ProtectedRoute>
            <UserProvider>
              <NProgressProvider />
              {children}
            </UserProvider>
          </ProtectedRoute>
        </SessionProviderWrapper>
      </body>
    </html>
  )
}
