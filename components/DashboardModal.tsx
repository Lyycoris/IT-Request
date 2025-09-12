import React, { useMemo } from 'react';
import { ITRequest, Status } from '../types';
import { Modal } from './ui/Modal';
import { BarChart } from './BarChart';
import { DoughnutChart } from './DoughnutChart';
import { HorizontalBarChart } from './HorizontalBarChart';

interface DashboardModalProps {
    isOpen: boolean;
    onClose: () => void;
    requests: ITRequest[];
}

const categoryColors: { [key: string]: string } = {
    'Perangkat Keras': '#ef4444', // red-500
    'Perangkat Lunak': '#3b82f6', // blue-500
    'Jaringan': '#22c55e',       // green-500
    'Lainnya': '#a855f7',         // purple-500
};

const statusColors: { [key: string]: string } = {
    [Status.Open]: '#ef4444',         // red-500
    [Status.InProgress]: '#eab308', // yellow-500
    [Status.Done]: '#22c55e',         // green-500
};


const DashboardModal: React.FC<DashboardModalProps> = ({ isOpen, onClose, requests }) => {

    const requestsByDivision = useMemo(() => {
        const counts = requests.reduce((acc, req) => {
            acc[req.division] = (acc[req.division] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(counts)
            .map(([label, value]) => ({ label, value }))
            .sort((a, b) => b.value - a.value);
    }, [requests]);

    const requestsByCategory = useMemo(() => {
        const counts = requests.reduce((acc, req) => {
            acc[req.category] = (acc[req.category] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(counts)
            .map(([label, value]) => ({ label, value, color: categoryColors[label] || '#6b7280' }))
            .sort((a, b) => b.value - a.value);
    }, [requests]);

    const requestsByStatus = useMemo(() => {
        const counts = requests.reduce((acc, req) => {
            acc[req.status] = (acc[req.status] || 0) + 1;
            return acc;
        }, {} as Record<Status, number>);

        return Object.values(Status).map(status => ({
            label: status,
            value: counts[status] || 0,
            color: statusColors[status]
        }));
    }, [requests]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="3xl">
            <div className="p-6 bg-gray-50">
                <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">Dashboard Statistik</h2>
                {requests.length === 0 ? (
                    <div className="text-center py-16 px-6 bg-white rounded-lg shadow">
                         <h3 className="mt-2 text-lg font-medium text-gray-900">Tidak ada data untuk ditampilkan</h3>
                         <p className="mt-1 text-sm text-gray-500">Belum ada permintaan yang diajukan.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="lg:col-span-2">
                           <BarChart data={requestsByDivision} title="Permintaan per Divisi" />
                        </div>
                        <div>
                            <DoughnutChart data={requestsByCategory} title="Permintaan per Kategori" />
                        </div>
                        <div>
                            <HorizontalBarChart data={requestsByStatus} title="Permintaan per Status" />
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default DashboardModal;