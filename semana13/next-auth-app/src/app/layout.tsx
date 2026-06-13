import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import LogoutButton from "../components/LogoutButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Image from "next/image";
import Provider from "@/components/SessionProvider";

const geistSans = Geist({
});

const geistMono = Geist_Mono({
});

export const metadata: Metadata = {
  title: "Next Auth App",
  description: "My Next Auth App",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  console.log(session);
  return (
        <html lang="en">
            <body
                className={`${geistSans.className} ${geistMono.className} antialiased`}
            >
                <nav className="w-full border-b border-slate-800 bg-slate-950 shadow-lg shadow-slate-950/30">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                        <Link href="/" className="text-xl font-black tracking-tight !text-white">
                            MyAuthApp
                        </Link>
                        <ul className="flex items-center gap-6 text-sm font-semibold text-slate-50">
                            <li>
                                <Link href="/dashboard" className="rounded-md px-2 py-1 transition hover:bg-slate-800 hover:text-white">
                                    Dashboard
                                </Link>
                            </li>
                            {session?.user && (
                                <li>
                                    <Link href="/profile" className="rounded-md px-2 py-1 transition hover:bg-slate-800 hover:text-white">
                                        Profile
                                    </Link>
                                </li>
                            )}
                            {session?.user && (
                                <li>
                                    <LogoutButton />
                                </li>
                            )}
                            {session?.user?.image && (
                                <li>
                                    <Image
                                        height={100}
                                        width={100}
                                        src={session?.user?.image}
                                        alt="Profile"
                                        className="w-10 h-10 rounded-full"
                                    />
                                </li>
                            )}
                        </ul>
                    </div>
                </nav>
                <Provider>
                    <main>{children}</main>
                </Provider>
            </body>
        </html>
  );
}