"use client";

import Link from 'next/link';
import React from 'react';
import { useRouter } from "next/navigation";

interface AdminData {
    name: string;
    role: string;
    email: string;
}

interface HeaderProps {
    toggleSidebar: () => void;
    adminData: AdminData | null;
    loading: boolean;
}

export function Header({ toggleSidebar, adminData, loading }: HeaderProps) {
    const router = useRouter();

    const nameAdmin = adminData?.name || "Memuat...";
    const roleAdmin = adminData?.role || "Memuat Peran...";

    const handleLogout = async () => {
        try {
            await fetch("/api/logout", { method: "POST" }); // API untuk hapus cookie session
            router.push("/login");
        } catch (error) {
            console.error("Gagal Logout:", error);
        }
    };

    if (loading) {
        return (
            <header className="flex items-center justify-between p-4 bg-white border-b border-gray-100 shadow-sm">
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse lg:hidden"></div>
                <h2 className="text-xl font-semibold text-gray-800 hidden sm:block">Dashboard Analitik</h2>
                <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
            </header>
        );
    }

    if (!adminData) {
        return (
            <header className="flex items-center justify-end p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/50 shadow-lg backdrop-blur-sm">
                <p className="text-red-400 mr-4 text-sm">Data Admin tidak ditemukan. Silakan Login Ulang.</p>
                <Link href="/login" className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                    Login
                </Link>
            </header>
        );
    }

    return (
        <header className="flex items-center justify-between py-2.5 px-6 bg-white border-b border-gray-100 shadow-sm z-30 min-h-[56px]">
            <button id="sidebar-toggle" className="text-gray-400 lg:hidden hover:text-[#0138C9] transition-colors" onClick={toggleSidebar}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
            </button>

            <h2 className="text-xs font-black text-gray-900 hidden sm:block uppercase tracking-widest opacity-60">
                Dashboard <span className="text-[#0138C9]">Analitik</span>
            </h2>

            <div className="flex items-center space-x-3">
                <button className="p-1.5 text-gray-400 rounded-lg hover:bg-gray-50 relative transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.406L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                    <span className="absolute top-0 right-0 text-[8px] font-black bg-[#0138C9] text-white px-1 py-0.5 rounded-full border border-white">3</span>
                </button>

                <div className="flex items-center gap-3 pl-3 border-l border-gray-100">
                    <div className="text-right hidden sm:block">
                        <p className="text-[11px] font-black text-gray-900 uppercase tracking-tight leading-none">Hi, {nameAdmin}</p>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">{roleAdmin}</p>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="p-1.5 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                        title="Logout"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    </button>
                </div>
            </div>
        </header>
    );
}
