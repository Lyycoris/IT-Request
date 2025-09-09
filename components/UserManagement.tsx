import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { userService } from '../services/userService';
import { Modal } from './ui/Modal';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Trash2Icon } from './ui/Icons';
import ConfirmationModal from './ConfirmationModal';

interface DivisionManagementModalProps {
    isOpen: boolean;
    onClose: () => void;
    showToast: (message: string, type: 'success' | 'error') => void;
    onUpdate: () => void;
}

const DivisionManagementModal: React.FC<DivisionManagementModalProps> = ({ isOpen, onClose, showToast, onUpdate }) => {
    const [divisionUsers, setDivisionUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ divisionName: '', username: '', password: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    const fetchDivisionUsers = async () => {
        setLoading(true);
        try {
            const users = await userService.fetchUsers();
            setDivisionUsers(users);
        } catch (error) {
            showToast('Gagal memuat daftar divisi.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchDivisionUsers();
        }
    }, [isOpen]);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { divisionName, username, password } = formData;
        if (!divisionName.trim() || !username.trim() || !password.trim()) {
            showToast('Semua kolom harus diisi.', 'error');
            return;
        }
        setIsSubmitting(true);
        try {
            const newUser = {
                name: `Divisi ${divisionName.trim()}`,
                division: divisionName.trim(),
                username: username.trim(),
                password: password,
            };
            await userService.addUser(newUser);
            showToast('Divisi baru berhasil ditambahkan!', 'success');
            setFormData({ divisionName: '', username: '', password: '' });
            await fetchDivisionUsers();
            onUpdate();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Gagal menambahkan divisi.';
            showToast(errorMessage, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!userToDelete) return;
        try {
            await userService.deleteUser(userToDelete.id);
            showToast(`Divisi "${userToDelete.division}" berhasil dihapus.`, 'success');
            setUserToDelete(null);
            await fetchDivisionUsers();
            onUpdate();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Gagal menghapus divisi.';
            showToast(errorMessage, 'error');
        }
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} size="3xl">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">Manajemen Divisi</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Column: Add New Division Form */}
                        <div>
                             <h3 className="font-semibold text-gray-800 mb-3">Tambah Divisi Baru</h3>
                             <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Divisi</label>
                                    <Input name="divisionName" value={formData.divisionName} onChange={handleFormChange} placeholder="cth: Keuangan" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                    <Input name="username" value={formData.username} onChange={handleFormChange} placeholder="cth: keuangan_user" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                    <Input name="password" type="text" value={formData.password} onChange={handleFormChange} placeholder="Minimal 6 karakter" required />
                                </div>
                                <Button type="submit" disabled={isSubmitting} className="w-full">{isSubmitting ? 'Menambahkan...' : 'Tambah Divisi'}</Button>
                            </form>
                        </div>

                        {/* Right Column: Registered Divisions */}
                        <div className="md:border-l md:pl-8 border-gray-200">
                            <h3 className="font-semibold text-gray-800 mb-3">Divisi Terdaftar</h3>
                            {loading ? <p className="text-sm text-gray-500 text-center py-4">Memuat...</p> : (
                                <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                                    {divisionUsers.length === 0 ? (
                                        <p className="text-sm text-gray-500 text-center py-4">Belum ada divisi yang ditambahkan.</p>
                                    ) : (
                                        divisionUsers.map(user => (
                                            <div key={user.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                                                <div>
                                                    <p className="font-medium text-gray-900">{user.name}</p>
                                                    <p className="text-sm text-gray-600">{user.username} (Password: {user.password})</p>
                                                </div>
                                                <button onClick={() => setUserToDelete(user)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition" aria-label={`Hapus ${user.name}`}><Trash2Icon className="w-5 h-5" /></button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Modal>
            {userToDelete && (
                <ConfirmationModal 
                    isOpen={true} 
                    onClose={() => setUserToDelete(null)} 
                    onConfirm={handleDelete} 
                    title="Hapus Divisi" 
                    message={`Apakah Anda yakin ingin menghapus divisi "${userToDelete.division}"? Ini akan menghapus akun yang terkait.`} 
                    confirmButtonText="Ya, Hapus" 
                />
            )}
        </>
    );
};

export default DivisionManagementModal;