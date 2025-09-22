import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from 'next/font/google'
import '@/styles/nprogress.css';
import SessionProviderWrapper from "@/providers/SessionProviderWrapper";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import NProgressProvider from "@/providers/NProgressProvider";
import { ThemeProvider } from "@/context/ThemeContext";
import { UnreadInitializer } from "@/components/initializers/UnreadInitializer";
import SocketInitializer from "@/components/initializers/SocketInitializer";
import ChatInitializer from "@/components/initializers/ChatInitializer";
import UserInitializer from "@/components/initializers/UserInitializer";


const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap', // Ensures the font is loaded first, avoiding "flash of unstyled text"
  style: 'normal',
  variable: '--font-poppins',
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
            <ThemeProvider>
              <NProgressProvider /> {/**  NProgress Provider */}
              <UserInitializer /> {/**  User Initializer */}
              <SocketInitializer /> {/**  Socket Initializer */}
              <UnreadInitializer /> {/**  Unread Initializer */}
              <ChatInitializer /> {/**  Chat Initializer */}
              {children}
            </ThemeProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  )
}
