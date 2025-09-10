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
                Aplikasi tidak dapat memuat data karena ada masalah konfigurasi pada backend Google Apps Script Anda.
            </p>

            <div className="mt-6 bg-red-50 border border-red-200 p-4 rounded-md text-left">
                <div className="flex">
                    <AlertTriangleIcon className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                    <div>
                        <h2 className="font-semibold text-red-800">Penyebab Masalah</h2>
                        <p className="text-sm text-red-700 mt-1">
                            Versi skrip backend yang berjalan saat ini tidak dapat menemukan sheet yang dikonfigurasi. Ini biasanya terjadi karena salah satu dari dua alasan:
                            <ul className="list-disc pl-5 mt-2">
                                <li>Nama sheet di dalam skrip tidak cocok dengan nama tab di Google Sheet.</li>
                                <li>Skrip sudah diperbaiki, tetapi **perubahan tersebut belum di-deploy ulang**.</li>
                            </ul>
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-6 text-left space-y-4 text-gray-700">
                <h3 className="font-semibold text-lg text-gray-800">Solusi: Verifikasi dan Deploy Ulang Skrip Anda</h3>
                <p className="text-sm">
                    Ikuti langkah-langkah ini dengan saksama untuk memastikan semuanya sinkron:
                </p>
                <ol className="list-decimal list-inside space-y-4 text-sm">
                    <li>
                        Buka editor <strong>Google Apps Script</strong> Anda.
                    </li>
                    <li>
                        <strong>Langkah 1: Verifikasi Nama Sheet.</strong> Pastikan baris kode di bawah ini ada di bagian atas skrip Anda dan nama-namanya (`"Requests"`, `"Pengguna"`) sama persis dengan nama tab di Google Sheet Anda.
                        <pre className="my-2 p-3 bg-gray-100 border border-gray-300 rounded text-sm font-semibold">
                          <code>const REQUEST_SHEET_NAME = "Requests";{'\n'}const USER_SHEET_NAME = "Pengguna";</code>
                        </pre>
                    </li>
                     <li>
                        <strong>Langkah 2: Deploy Ulang (Sangat Penting!).</strong> Setelah memverifikasi kode, Anda **harus** menerapkan perubahan tersebut.
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                            <li>Klik tombol biru <strong>"Deploy"</strong> di kanan atas.</li>
                            <li>Dari menu dropdown, pilih <strong>"New deployment"</strong>.</li>
                            <li>Klik tombol <strong>"Deploy"</strong> di jendela baru.</li>
                        </ul>
                        <p className="text-xs text-gray-500 mt-1">Hanya menyimpan skrip (ikon disket) tidak akan memperbarui aplikasi web Anda. Anda harus selalu melakukan "New deployment".</p>
                    </li>
                </ol>
            </div>

            <div className="mt-8">
                <Button onClick={onRetry} className="w-full sm:w-auto">
                    Saya Sudah Men-deploy Ulang Skrip, Coba Lagi
                </Button>
            </div>
        </div>
    </div>
  );
};

export default ConfigErrorDisplay;
