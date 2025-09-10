import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { AlertTriangleIcon, WrenchIcon, CheckCircleIcon, ServerIcon, DatabaseIcon, BoxIcon, CodeIcon } from './ui/Icons';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const user = await userService.login(username, password);
      if (user) {
        login(user);
      } else {
        setError('Nama pengguna atau kata sandi tidak valid.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login gagal karena kesalahan yang tidak diketahui.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 min-h-screen flex items-center justify-center p-4 lg:p-8">
      
      {/* Decorative background IT icons */}
      <ServerIcon className="absolute top-10 left-10 w-48 h-48 text-white/10 transform -rotate-12 pointer-events-none" />
      <DatabaseIcon className="absolute bottom-10 right-10 w-64 h-64 text-white/10 transform rotate-12 pointer-events-none" />
      {/* The rotating box in the middle */}
      <BoxIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 text-white/10 pointer-events-none animate-spin-slow" />
      {/* The rotating wrench in the upper right */}
      <WrenchIcon className="absolute top-24 right-24 w-40 h-40 text-white/10 pointer-events-none animate-spin-slow" />
      {/* New code icon in the bottom left */}
      <CodeIcon className="absolute bottom-20 left-20 w-32 h-32 text-white/10 pointer-events-none transform rotate-12" />


      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-16 items-center z-10">
        
        {/* Left Column: Login Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 w-full relative order-last md:order-first">
          {/* Logo / Brand */}
          <div className="flex justify-center mb-6">
            <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center">
              <WrenchIcon className="h-8 w-8" />
            </div>
          </div>
          
          <h2 className="text-center text-2xl font-bold text-gray-800 mb-8">Selamat Datang di IT Request</h2>
          
          <form onSubmit={handleLogin}>
            <div className="mb-5">
              <label htmlFor="username" className="block text-gray-600 mb-2">Username</label>
              <Input 
                id="username" 
                type="text" 
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password-input" className="block text-gray-600 mb-2">Password</label>
              <Input 
                id="password-input"
                type="password" 
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="flex items-start text-sm text-red-600 bg-red-50 p-3 rounded-md mb-6">
                <AlertTriangleIcon className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0"/>
                <span>{error}</span>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Masuk...' : 'Login'}
            </Button>
          </form>
        </div>

        {/* Right Column: App Description */}
        <div className="text-white p-4 hidden md:block">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Sistem IT Request
          </h1>
          <p className="text-blue-200 mb-6 text-lg leading-relaxed">
            Selamat datang di platform terpusat untuk semua kebutuhan dukungan IT Anda.
          </p>
           <ul className="space-y-4">
            <li className="flex items-start">
              <CheckCircleIcon className="h-6 w-6 text-green-400 mr-3 mt-1 flex-shrink-0" />
              <span><span className="font-semibold">Kirim Permintaan Cepat:</span> Laporkan masalah teknis Anda dalam hitungan detik.</span>
            </li>
            <li className="flex items-start">
              <CheckCircleIcon className="h-6 w-6 text-green-400 mr-3 mt-1 flex-shrink-0" />
              <span><span className="font-semibold">Lacak Status Real-time:</span> Pantau kemajuan permintaan Anda dari dasbor Anda.</span>
            </li>
            <li className="flex items-start">
              <CheckCircleIcon className="h-6 w-6 text-green-400 mr-3 mt-1 flex-shrink-0" />
              <span><span className="font-semibold">Manajemen Terpusat:</span> Admin dapat mengelola semua permintaan dari satu tempat.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// FIX: Added a default export to the component.
export default Login;