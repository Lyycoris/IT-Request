import React from 'react';
import { Button } from './ui/Button';
import { AlertTriangleIcon, WrenchIcon } from './ui/Icons';

interface ConfigErrorDisplayProps {
  message: string;
  onRetry: () => void;
}

const ConfigErrorDisplay: React.FC<ConfigErrorDisplayProps> = ({ message, onRetry }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4 text-center">
        <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-lg border-t-4 border-red-500">
            <WrenchIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h1 className="mt-4 text-2xl font-bold text-gray-800">Gagal Terhubung ke Google Sheet</h1>
            <p className="mt-2 text-gray-600">
                Aplikasi tidak dapat memuat data karena ada masalah konfigurasi pada backend Google Sheet Anda.
            </p>

            <div className="mt-6 bg-red-50 border border-red-200 p-4 rounded-md text-left">
                <div className="flex">
                    <AlertTriangleIcon className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                    <div>
                        <h2 className="font-semibold text-red-800">Detail Kesalahan</h2>
                        <p className="text-sm text-red-700 mt-1">{message}</p>
                    </div>
                </div>
            </div>

            <div className="mt-6 text-left space-y-4 text-gray-700">
                <h3 className="font-semibold text-lg text-gray-800">Cara Memperbaiki:</h3>
                <ol className="list-decimal list-inside space-y-3 text-sm">
                    <li>Buka file Google Sheet yang terhubung dengan aplikasi ini.</li>
                    <li>Lihat ke pojok kiri bawah, Anda akan menemukan tab sheet (contohnya bernama "Sheet1").</li>
                    <li><strong>Klik kanan</strong> pada nama tab tersebut dan pilih <strong>"Ganti nama"</strong>.</li>
                    <li>
                        Ubah namanya menjadi:
                        <div className="my-2 p-2 bg-blue-100 border border-blue-300 rounded text-center">
                            <code className="text-lg font-bold text-blue-800">Requests</code>
                        </div>
                        Nama harus persis seperti ini (huruf 'R' besar dan diakhiri dengan 's').
                    </li>
                    <li>Pastikan baris pertama di sheet tersebut berisi header kolom yang benar: <code>ID</code>, <code>Timestamp</code>, <code>Name</code>, dll.</li>
                </ol>
            </div>

            <div className="mt-8">
                <Button onClick={onRetry} className="w-full sm:w-auto">
                    Coba Lagi Setelah Diperbaiki
                </Button>
            </div>
        </div>
    </div>
  );
};

export default ConfigErrorDisplay;
