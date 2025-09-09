import React, { useState, useEffect } from 'react';
import { NewRequestData } from '../types';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Textarea } from './ui/Textarea';
import { Button } from './ui/Button';
import { Card, CardHeader, CardContent, CardTitle } from './ui/Card';
import { useAuth } from '../context/AuthContext';
import { ComboBox } from './ui/ComboBox';

interface ITRequestFormProps {
  onSubmit: (data: NewRequestData) => Promise<void>;
  divisionOptions: string[];
}

const ITRequestForm: React.FC<ITRequestFormProps> = ({ onSubmit, divisionOptions }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<NewRequestData>({
    name: '',
    division: '',
    problem: '',
    category: 'Perangkat Lunak',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      const initialDivision = user.division || '';
      setFormData(prev => ({
        ...prev,
        name: user.name,
        division: initialDivision,
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value as any }));
  };

  const handleDivisionChange = (value: string) => {
    setFormData(prev => ({ ...prev, division: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name || !formData.division || !formData.problem) {
      alert('Harap isi semua kolom yang wajib diisi.');
      return;
    }
    setIsSubmitting(true);
    await onSubmit(formData);
    // Reset hanya masalah dan kategori setelah pengiriman
    setFormData(prev => ({ ...prev, problem: '', category: 'Perangkat Lunak' }));
    setIsSubmitting(false);
  };

  const isUserRole = user?.role === 'Pengguna';

  return (
    <Card className="shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle className="text-xl">Kirim Permintaan Baru</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nama Anda</label>
            <Input id="name" name="name" type="text" value={formData.name} onChange={handleChange} placeholder="contoh: Budi" required />
          </div>
          <div>
            <label htmlFor="division" className="block text-sm font-medium text-gray-700 mb-1">Divisi / Departemen</label>
             {isUserRole ? (
                <Input 
                    id="division" 
                    name="division" 
                    type="text" 
                    value={formData.division} 
                    required 
                    disabled
                />
            ) : (
                <ComboBox
                    options={divisionOptions}
                    value={formData.division}
                    onChange={handleDivisionChange}
                    placeholder="Pilih atau ketik divisi"
                    required
                />
            )}
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
            <Select id="category" name="category" value={formData.category} onChange={handleChange} required>
              <option>Perangkat Lunak</option>
              <option>Perangkat Keras</option>
              <option>Jaringan</option>
              <option>Lainnya</option>
            </Select>
          </div>
          <div>
            <label htmlFor="problem" className="block text-sm font-medium text-gray-700 mb-1">Jelaskan Masalahnya</label>
            <Textarea id="problem" name="problem" value={formData.problem} onChange={handleChange} placeholder="Harap berikan detail sebanyak mungkin..." rows={4} required />
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Mengirim...' : 'Kirim Permintaan'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ITRequestForm;
