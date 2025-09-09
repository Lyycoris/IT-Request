import React from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { User } from '../types';
import { LogOutIcon } from './ui/Icons';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  user: User | null;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onClose, onConfirm, user }) => {
  if (!user) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="p-6 sm:p-8 flex flex-col items-center text-center">
        {/* Icon */}
        <div className="bg-blue-100 p-3 rounded-full">
          <LogOutIcon className="h-6 w-6 text-blue-600" />
        </div>
        
        {/* Title */}
        <h3 className="mt-4 text-lg font-semibold text-gray-900">Konfirmasi Keluar</h3>
        
        {/* Message with user info */}
        <p className="mt-2 text-sm text-gray-500 max-w-sm">
          Apakah Anda yakin ingin keluar dari sesi Anda sebagai <span className="font-semibold">{user.name} ({user.role})</span>?
        </p>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-center gap-3 w-full max-w-xs">
          <Button onClick={onClose} variant="secondary" className="w-full">
            Batal
          </Button>
          <Button onClick={handleConfirm} variant="primary" className="w-full">
            Keluar
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default LogoutModal;