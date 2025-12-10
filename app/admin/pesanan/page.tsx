// app/admin/pesanan/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { useAdminData } from '../../hooks/useAdminData';
import React from 'react';

export default function PesananPage(): React.ReactElement {
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
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Manajemen Pesanan</h1>
                    
                    <div className="bg-white p-6 rounded-xl shadow-lg h-96 flex items-center justify-center">
                        <p className="text-gray-500">Area untuk Filter Status Pesanan dan Tabel Daftar Pesanan.</p>
                    </div>
                </main>
            </div>
        </div>
    );
}