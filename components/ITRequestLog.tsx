import React from 'react';
import { ITRequest, Status } from '../types';
import ITRequestCard from './ITRequestCard';
import { Loader } from './ui/Loader';
import { InfoIcon, SearchIcon } from './ui/Icons';

interface ITRequestLogProps {
  requests: ITRequest[];
  onUpdateRequest: (id: number, status: Status, pic?: string, notes?: string) => void;
  onDeleteRequest: (id: number) => void;
  loading: boolean;
  hasActiveFilters: boolean; // New prop
}

const ITRequestLog: React.FC<ITRequestLogProps> = ({ requests, onUpdateRequest, onDeleteRequest, loading, hasActiveFilters }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-gray-700">Permintaan Saat Ini</h2>
      {loading ? (
        <div className="flex justify-center items-center h-96">
            <Loader />
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-16 px-6 bg-white rounded-lg shadow">
            {hasActiveFilters ? (
              <>
                <SearchIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">Tidak ada permintaan yang cocok</h3>
                <p className="mt-1 text-sm text-gray-500">Coba ubah atau reset filter pencarian Anda.</p>
              </>
            ) : (
              <>
                <InfoIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">Tidak ada permintaan ditemukan</h3>
                <p className="mt-1 text-sm text-gray-500">Kirim permintaan baru untuk melihatnya di sini.</p>
              </>
            )}
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <ITRequestCard 
              key={req.id} 
              request={req} 
              onUpdateRequest={onUpdateRequest} 
              onDeleteRequest={onDeleteRequest}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ITRequestLog;