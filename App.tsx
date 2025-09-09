import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ITRequest, Status, NewRequestData, User } from './types';
import { sheetService } from './services/sheetService';
import { userService } from './services/userService';
import ITRequestForm from './components/ITRequestForm';
import ITRequestLog from './components/ITRequestLog';
import Login from './components/Login';
import ConfirmationModal from './components/ConfirmationModal';
import { ToastContainer, Toast } from './components/ui/Toast';
import { Header } from './components/Header';
import { useAuth } from './context/AuthContext';
import ConfigErrorDisplay from './components/ConfigErrorDisplay';
import FilterControls from './components/FilterControls';
import { PlusCircleIcon } from './components/ui/Icons';
import DivisionManagementModal from './components/UserManagement';
import { Button } from './components/ui/Button';
import LogoutModal from './components/LogoutModal';

export default function App() {
  const { user, logout } = useAuth();
  const [requests, setRequests] = useState<ITRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [requestToDeleteId, setRequestToDeleteId] = useState<number | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isDivisionModalOpen, setIsDivisionModalOpen] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | 'All'>('All');
  const [divisionFilter, setDivisionFilter] = useState<string>('All');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });
  const [divisionOptions, setDivisionOptions] = useState<string[]>([]);

  const fetchDivisionOptions = useCallback(async () => {
    try {
        const users = await userService.fetchUsers();
        const divisions = users
            .map(u => u.division)
            .filter((d): d is string => !!d)
            .sort();
        setDivisionOptions(Array.from(new Set(divisions)));
    } catch (error) {
        showToast('Gagal memuat daftar divisi.', 'error');
    }
  }, []);

  const fetchRequests = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setConfigError(null);
    try {
      const data = await sheetService.fetchRequests();
      setRequests(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Gagal memuat permintaan.';
      console.error("Error fetching requests:", error);
      
      if (errorMessage.includes('nama tab adalah "Requests"')) {
        setConfigError(errorMessage);
      } else {
        showToast(errorMessage, 'error');
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchRequests();
    fetchDivisionOptions();
  }, [fetchRequests, fetchDivisionOptions]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handleAddRequest = async (newRequestData: NewRequestData) => {
    try {
      await sheetService.addRequest(newRequestData);
      showToast('Permintaan berhasil dikirim!', 'success');
      fetchRequests();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Gagal mengirim permintaan.';
      console.error("Error adding request:", error);
      showToast(errorMessage, 'error');
    }
  };

  const handleUpdateRequest = async (id: number, status: Status, pic?: string, notes?: string) => {
    if (user?.role !== 'Admin') {
      showToast('Anda tidak memiliki izin untuk memperbarui permintaan.', 'error');
      return;
    }
    try {
      await sheetService.updateRequest(id, { status, pic, notes });
      showToast('Permintaan berhasil diperbarui!', 'success');
      fetchRequests();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Gagal memperbarui permintaan.';
      console.error("Error updating request:", error);
      showToast(errorMessage, 'error');
    }
  };

  const handleDeleteRequest = async (id: number) => {
    if (user?.role !== 'Admin') {
      showToast('Anda tidak memiliki izin untuk menghapus permintaan.', 'error');
      return;
    }
    try {
      await sheetService.deleteRequest(id);
      showToast('Permintaan berhasil dihapus!', 'success');
      setRequests(prev => prev.filter(r => r.id !== id));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Gagal menghapus permintaan.';
      console.error("Error deleting request:", error);
      showToast(errorMessage, 'error');
    }
  };
  
  const handleConfirmDelete = () => {
    if (requestToDeleteId !== null) {
      handleDeleteRequest(requestToDeleteId);
      setRequestToDeleteId(null);
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setDivisionFilter('All');
    setDateRange({ start: '', end: '' });
  };

  const hasActiveFilters = useMemo(() => 
    searchTerm !== '' || statusFilter !== 'All' || (user?.role === 'Admin' && divisionFilter !== 'All') || dateRange.start !== '' || dateRange.end !== '',
    [searchTerm, statusFilter, divisionFilter, user, dateRange]
  );
  
  const uniqueDivisions = useMemo(() => {
      const divisions = new Set(requests.map(r => r.division));
      return Array.from(divisions).sort();
  }, [requests]);

  const filteredRequests = useMemo(() => {
    if (!user) return [];
    
    let userVisibleRequests = requests;
    if (user.role !== 'Admin') {
        userVisibleRequests = requests.filter(req => req.division === user.division);
    }
    
    const startDate = dateRange.start ? new Date(dateRange.start) : null;
    if (startDate) startDate.setHours(0, 0, 0, 0);

    const endDate = dateRange.end ? new Date(dateRange.end) : null;
    if (endDate) endDate.setHours(23, 59, 59, 999);

    return userVisibleRequests.filter(req => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        const matchesSearch = searchTerm === '' || 
                                req.name.toLowerCase().includes(lowerCaseSearchTerm) ||
                                req.problem.toLowerCase().includes(lowerCaseSearchTerm);
        
        const matchesStatus = statusFilter === 'All' || req.status === statusFilter;
        
        const matchesDivision = user.role !== 'Admin' || divisionFilter === 'All' || req.division === divisionFilter;
        
        const reqDate = new Date(req.timestamp);
        const afterStart = !startDate || reqDate >= startDate;
        const beforeEnd = !endDate || reqDate <= endDate;
        const matchesDate = afterStart && beforeEnd;
        
        return matchesSearch && matchesStatus && matchesDivision && matchesDate;
    });
  }, [requests, user, searchTerm, statusFilter, divisionFilter, dateRange]);


  if (!user) {
    return <Login />;
  }
  
  if (configError) {
    return <ConfigErrorDisplay message={configError} onRetry={fetchRequests} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <Header onRefresh={fetchRequests} onLogoutRequest={() => setIsLogoutModalOpen(true)} />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-4">
            {user.role === 'Admin' && 
              <Button 
                onClick={() => setIsDivisionModalOpen(true)} 
                className="w-full"
                variant="secondary"
              >
                  <PlusCircleIcon className="w-5 h-5 mr-2"/>
                  Manajemen Divisi
              </Button>
            }
            <ITRequestForm onSubmit={handleAddRequest} divisionOptions={divisionOptions} />
          </div>
          <div className="lg:col-span-2">
            <FilterControls
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              divisionFilter={divisionFilter}
              setDivisionFilter={setDivisionFilter}
              uniqueDivisions={uniqueDivisions}
              dateRange={dateRange}
              setDateRange={setDateRange}
              onReset={resetFilters}
            />
            <ITRequestLog 
              requests={filteredRequests} 
              onUpdateRequest={handleUpdateRequest}
              onDeleteRequest={(id) => setRequestToDeleteId(id)}
              loading={loading}
              hasActiveFilters={hasActiveFilters}
            />
          </div>
        </div>
      </main>
      <ToastContainer>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </ToastContainer>
      {requestToDeleteId !== null && (
        <ConfirmationModal
            isOpen={true}
            onClose={() => setRequestToDeleteId(null)}
            onConfirm={handleConfirmDelete}
            title="Hapus Permintaan"
            message={`Apakah Anda yakin ingin menghapus permintaan #${requestToDeleteId} secara permanen? Tindakan ini tidak dapat dibatalkan.`}
            confirmButtonText="Hapus"
            confirmButtonVariant="danger"
        />
      )}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={logout}
        user={user}
      />
      {isDivisionModalOpen && (
        <DivisionManagementModal
            isOpen={isDivisionModalOpen}
            onClose={() => setIsDivisionModalOpen(false)}
            showToast={showToast}
            onUpdate={fetchDivisionOptions}
        />
      )}
    </div>
  );
}