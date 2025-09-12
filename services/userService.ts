import { User } from '../types';

// URL ini harus sama dengan yang ada di sheetService untuk menunjuk ke backend Google Apps Script Anda.
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwu-aDVWUGsW9QVt2WeTgK2jcioDEawBSK8JiAkoT_7JIrmifbps_KYhYFCC7vHz7RY/exec';

// Fungsi helper untuk menangani error dari skrip, mirip dengan sheetService
function handleScriptError(error: unknown, context: string): Error {
  console.error(`Error during ${context}:`, error);
  if (error instanceof Error) {
    const lowerCaseMessage = error.message.toLowerCase();

    // Periksa secara spesifik untuk error header yang hilang dan berikan pesan yang sangat jelas
    if (lowerCaseMessage.includes("header") && lowerCaseMessage.includes("tidak ditemukan di sheet pengguna")) {
        return new Error(
            `Kesalahan Konfigurasi Sheet "Pengguna": Pastikan sheet "Pengguna" Anda memiliki SEMUA kolom header berikut: 'id', 'name', 'division', 'role', 'username', dan 'password'. Periksa ejaan dan pastikan tidak ada spasi tambahan.`
        );
    }

    // Pesan spesifik jika skrip backend tidak mengenali aksinya (misalnya, 'login' atau 'addUser')
    if (lowerCaseMessage.includes("aksi tidak valid")) {
      return new Error(
        `Kesalahan Konfigurasi Backend: Google Apps Script Anda tidak mengenali aksi yang diminta (${context}). Ini berarti skrip backend Anda sudah usang. Harap perbarui Google Apps Script Anda dengan kode yang disediakan sebelumnya yang mencakup fungsi login dan manajemen pengguna, lalu deploy ulang.`
      );
    }

    if (error.message.includes("Cannot read properties of null")) {
      return new Error(
        `Kesalahan Server: Kemungkinan nama tab di Google Sheet Anda untuk pengguna salah. Harap pastikan ada tab bernama "Pengguna".`
      );
    }
    return new Error(`Koneksi ke server gagal: ${error.message}`);
  }
  return new Error('Koneksi ke server gagal karena kesalahan yang tidak diketahui.');
}

// Fungsi helper untuk menangani permintaan POST ke skrip
async function postToAction(action: string, body: object): Promise<any> {
  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({ action, ...body }),
      mode: 'cors',
    });
    
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Terjadi kesalahan pada skrip.');
    }
    
    return result;

  } catch (error) {
    throw handleScriptError(error, `action '${action}'`);
  }
}

export const userService = {
  async login(username: string, password_input: string): Promise<User | null> {
    try {
      const result = await postToAction('login', { username, password: password_input });
      // Skrip harus mengembalikan objek pengguna jika login berhasil
      if (result.user) {
        return {
            id: Number(result.user.id),
            username: result.user.username,
            role: result.user.role,
            name: result.user.name,
            division: result.user.division || undefined,
        };
      }
      return null;
    } catch (error) {
      // Jika login gagal karena kesalahan skrip, error akan dilempar oleh postToAction
      // Jika skrip berjalan tetapi tidak menemukan pengguna, ia tidak akan error tetapi result.user akan kosong
      // Jadi kita menangani error skrip di sini dan null/undefined user di komponen UI
      console.error("Login gagal:", error);
      throw error; // Lemparkan kembali error yang sudah diformat agar UI bisa menampilkannya
    }
  },

  async fetchUsers(): Promise<User[]> {
    try {
        const response = await fetch(`${SCRIPT_URL}?action=getUsers`, { 
            method: 'GET', 
            mode: 'cors' 
        });
        if (!response.ok) {
            throw new Error(`Respons jaringan tidak baik: ${response.statusText}`);
        }
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || 'Gagal mengambil data pengguna dari skrip.');
        }
        
        const rawUsers: any[] = result.data || [];
        return rawUsers.map(u => ({
            id: Number(u.id),
            username: u.username,
            role: u.role,
            name: u.name,
            division: u.division || undefined,
            password: u.password // Diperlukan oleh komponen
        }));
    } catch (error) {
        throw handleScriptError(error, 'fetchUsers');
    }
  },

  async addUser(newUserData: Omit<User, 'id' | 'role'> & { password: string }): Promise<User> {
    const result = await postToAction('addUser', { data: newUserData });
    // Skrip harus mengembalikan pengguna yang baru dibuat, termasuk ID barunya.
    return {
        id: Number(result.data.id),
        username: result.data.username,
        name: result.data.name,
        division: result.data.division,
        role: 'Pengguna', // Asumsikan addUser selalu membuat peran 'Pengguna'
        password: result.data.password,
    };
  },

  async deleteUser(userId: number): Promise<boolean> {
    await postToAction('deleteUser', { id: userId });
    return true;
  },
};