// app/admin/pengaturan/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { useAdminData } from '../../hooks/useAdminData';
import React from 'react';

export default function PengaturanPage(): React.ReactElement {
    const [isOpen, setIsOpen] = useState(false);
    const { adminData, loading } = useAdminData();

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

            <div className="flex-1 flex flex-col overflow-y-auto">
                <Header 
                    toggleSidebar={toggleSidebar} 
                    adminData={adminData} 
                    loading={loading}     
                />

                <main className="flex-1 p-4 sm:p-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Pengaturan Admin</h1>
                    
                    <div className="bg-white p-6 rounded-xl shadow-lg h-96 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="border p-4 rounded-lg">
                            <h2 className="font-semibold mb-2">Profil Saya</h2>
                            <p>Nama: {adminData?.name || 'N/A'}</p>
                            <p>Role: {adminData?.role || 'N/A'}</p>
                        </div>
                        <div className="border p-4 rounded-lg">
                            <h2 className="font-semibold mb-2">Manajemen Akun</h2>
                            <button className="text-blue-600 hover:underline">Ganti Password</button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}