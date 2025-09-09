
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { RefreshCwIcon, WrenchIcon, LogOutIcon } from './ui/Icons';
import { Button } from './ui/Button';

interface HeaderProps {
    onRefresh: () => void;
    onLogoutRequest: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onRefresh, onLogoutRequest }) => {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const { user } = useAuth();

    const handleRefresh = () => {
        setIsRefreshing(true);
        onRefresh();
        setTimeout(() => setIsRefreshing(false), 1000); // Visual feedback
    };

    return (
        <header className="bg-blue-700 text-white sticky top-0 z-10 shadow-md">
            <div className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <WrenchIcon className="h-8 w-8" />
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                        IT Request
                    </h1>
                </div>
                <div className="flex items-center space-x-4">
                    {user && (
                        <div className="text-right hidden sm:block">
                            <p className="font-semibold">{user.name}</p>
                            <p className="text-sm text-blue-200">{user.role} {user.division ? `(${user.division})` : ''}</p>
                        </div>
                    )}
                     <button
                        onClick={handleRefresh}
                        className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-700 focus:ring-white rounded-lg transition-colors duration-200"
                        aria-label="Segarkan Data"
                    >
                        <RefreshCwIcon className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                        <span className="hidden md:inline ml-2">Segarkan</span>
                    </button>
                    <Button onClick={onLogoutRequest} variant="danger" aria-label="Keluar">
                        <LogOutIcon className="w-5 h-5 md:mr-2" />
                        <span className="hidden md:inline">Keluar</span>
                    </Button>
                </div>
            </div>
        </header>
    );
}
