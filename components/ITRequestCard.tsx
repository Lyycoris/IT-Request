import React, { useState, useEffect } from 'react';
import { ITRequest, Status } from '../types';
import { Select } from './ui/Select';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { UserIcon, BuildingIcon, TagIcon, CalendarIcon, UserCogIcon, EditIcon, AlertTriangleIcon, Trash2Icon } from './ui/Icons';
import { useAuth } from '../context/AuthContext';

interface ITRequestCardProps {
  request: ITRequest;
  onUpdateRequest: (id: number, updates: Partial<ITRequest>) => void;
  onDeleteRequest: (id: number) => void;
}

// Mengembalikan statusConfig ke versi sebelumnya dengan warna batas dan denyut
const statusConfig = {
  [Status.Open]: {
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    borderColor: 'border-red-500',
    pulseColor: 'bg-red-400',
  },
  [Status.InProgress]: {
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    borderColor: 'border-yellow-500',
    pulseColor: 'bg-yellow-400',
  },
  [Status.Done]: {
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    borderColor: 'border-green-500',
    pulseColor: 'bg-green-400', // Tidak digunakan, untuk konsistensi
  },
};

const ITRequestCard: React.FC<ITRequestCardProps> = ({ request, onUpdateRequest, onDeleteRequest }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';
  const isUser = user?.role === 'Pengguna';

  const [isEditing, setIsEditing] = useState(false);

  // Admin editable state
  const [editableStatus, setEditableStatus] = useState<Status>(request.status);
  const [editablePic, setEditablePic] = useState(request.pic);
  const [editableNotes, setEditableNotes] = useState(request.notes || '');
  
  // User editable state
  const [editableName, setEditableName] = useState(request.name);
  const [editableProblem, setEditableProblem] = useState(request.problem);
  const [editableCategory, setEditableCategory] = useState(request.category);

  const isOverdue = request.status === Status.Open && (new Date().getTime() - new Date(request.timestamp).getTime()) > 2 * 24 * 60 * 60 * 1000;
  
  const currentStatusConfig = statusConfig[request.status] || statusConfig[Status.Open];

  const handleSave = () => {
    if (isAdmin) {
        onUpdateRequest(request.id, { status: editableStatus, pic: editablePic, notes: editableNotes });
    } else {
        onUpdateRequest(request.id, { name: editableName, problem: editableProblem, category: editableCategory });
    }
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    // Reset admin state
    setEditableStatus(request.status);
    setEditablePic(request.pic);
    setEditableNotes(request.notes || '');
    // Reset user state
    setEditableName(request.name);
    setEditableProblem(request.problem);
    setEditableCategory(request.category);
    setIsEditing(false);
  };
  
  useEffect(() => {
    // Reset all editable states when request data changes
    setEditableStatus(request.status);
    setEditablePic(request.pic);
    setEditableNotes(request.notes || '');
    setEditableName(request.name);
    setEditableProblem(request.problem);
    setEditableCategory(request.category);
  }, [request]);

  const InfoPill: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
    <div className="flex items-center text-sm text-gray-600">
        <span className="text-gray-400 mr-2">{icon}</span>
        <span className="font-medium mr-1">{label}:</span> {value}
    </div>
  );

  // Determine if the current user can edit this request
  const canEdit = isAdmin || (isUser && user?.division === request.division && request.status === Status.Open);

  return (
    <div className={`relative bg-white shadow-md rounded-lg overflow-hidden border-l-4 ${currentStatusConfig.borderColor}`}>
      {request.status !== Status.Done && (
          <div className={`absolute top-2 right-2 h-2 w-2 rounded-full ${currentStatusConfig.pulseColor} animate-subtle-pulse`}></div>
      )}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg text-gray-800">{request.problem}</h3>
            <div className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${currentStatusConfig.bgColor} ${currentStatusConfig.textColor}`}>
              {request.status || 'Tidak Diketahui'}
            </div>
          </div>
          <div className="flex items-center space-x-1">
            {canEdit && !isEditing && (
              <button onClick={() => setIsEditing(true)} className="p-2 text-gray-500 hover:text-brand-primary hover:bg-gray-100 rounded-full transition" aria-label="Edit Permintaan">
                <EditIcon className="w-5 h-5" />
              </button>
            )}
            {isAdmin && !isEditing && (
                <button onClick={() => onDeleteRequest(request.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition" aria-label="Hapus Permintaan">
                    <Trash2Icon className="w-5 h-5" />
                </button>
            )}
          </div>
        </div>

        {isOverdue && (
            <div className="mt-3 flex items-center bg-red-100 text-red-800 text-sm font-medium px-3 py-2 rounded-md">
                <AlertTriangleIcon className="w-5 h-5 mr-2" />
                <span>Tiket ini sudah lewat batas waktu. Perlu perhatian segera!</span>
            </div>
        )}

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
            <InfoPill icon={<UserIcon className="w-4 h-4" />} label="Pengguna" value={request.name} />
            <InfoPill icon={<BuildingIcon className="w-4 h-4" />} label="Divisi" value={request.division} />
            <InfoPill icon={<TagIcon className="w-4 h-4" />} label="Kategori" value={request.category} />
            <InfoPill icon={<CalendarIcon className="w-4 h-4" />} label="Tanggal" value={new Date(request.timestamp).toLocaleDateString()} />
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
             <div className="space-y-3">
                <div className="flex items-start text-sm text-gray-600">
                    <span className="text-gray-400 mr-2 pt-0.5"><UserCogIcon className="w-4 h-4" /></span>
                    <div>
                        <span className="font-medium">PIC:</span> {request.pic}
                        {request.notes && (
                            <p className="text-sm text-gray-500 mt-1 italic">"{request.notes}"</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
        
        {isEditing && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-4 bg-gray-50 p-4 rounded-md">
            <h4 className="font-semibold text-gray-700">Edit Permintaan #{request.id}</h4>
            
            {isAdmin ? (
              <>
                <div>
                  <label htmlFor={`status-${request.id}`} className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <Select id={`status-${request.id}`} value={editableStatus} onChange={(e) => setEditableStatus(e.target.value as Status)}>
                    {Object.values(Status).map(s => <option key={s} value={s}>{s}</option>)}
                  </Select>
                </div>
                <div>
                  <label htmlFor={`pic-${request.id}`} className="block text-sm font-medium text-gray-700 mb-1">PIC yang Ditugaskan</label>
                  <Input id={`pic-${request.id}`} type="text" value={editablePic} onChange={(e) => setEditablePic(e.target.value)} />
                </div>
                <div>
                  <label htmlFor={`notes-${request.id}`} className="block text-sm font-medium text-gray-700 mb-1">Catatan</label>
                  <Textarea id={`notes-${request.id}`} value={editableNotes} onChange={(e) => setEditableNotes(e.target.value)} rows={3}/>
                </div>
              </>
            ) : (
              <>
                <div>
                    <label htmlFor={`name-${request.id}`} className="block text-sm font-medium text-gray-700 mb-1">Nama Pengguna</label>
                    <Input id={`name-${request.id}`} name="name" value={editableName} onChange={(e) => setEditableName(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor={`category-${request.id}`} className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                    <Select id={`category-${request.id}`} name="category" value={editableCategory} onChange={(e) => setEditableCategory(e.target.value as ITRequest['category'])} required>
                        <option>Perangkat Lunak</option>
                        <option>Perangkat Keras</option>
                        <option>Jaringan</option>
                        <option>Lainnya</option>
                    </Select>
                </div>
                <div>
                    <label htmlFor={`problem-${request.id}`} className="block text-sm font-medium text-gray-700 mb-1">Jelaskan Masalahnya</label>
                    <Textarea id={`problem-${request.id}`} name="problem" value={editableProblem} onChange={(e) => setEditableProblem(e.target.value)} rows={4} required />
                </div>
              </>
            )}

            <div className="flex justify-end space-x-2">
              <Button onClick={handleCancel} variant="secondary">Batal</Button>
              <Button onClick={handleSave}>Simpan Perubahan</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ITRequestCard;