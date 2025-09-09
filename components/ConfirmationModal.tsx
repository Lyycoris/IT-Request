
import React from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { AlertTriangleIcon } from './ui/Icons';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmButtonText?: string;
  confirmButtonVariant?: React.ComponentProps<typeof Button>['variant'];
  icon?: React.ReactNode;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message,
  confirmButtonText = 'Konfirmasi',
  confirmButtonVariant = 'danger',
  icon
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center text-center">
        {icon || (
            <div className="bg-red-100 p-3 rounded-full">
                <AlertTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
        )}
        <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
        <p className="mt-2 text-sm text-gray-500">{message}</p>
        <div className="mt-6 flex justify-center gap-3 w-full">
          <Button onClick={onClose} variant="secondary" className="w-full">
            Batal
          </Button>
          <Button onClick={handleConfirm} variant={confirmButtonVariant} className="w-full">
            {confirmButtonText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
