import { ITRequest, Status, NewRequestData } from '../types';

// TODO: GANTI DENGAN URL WEB APP GOOGLE APPS SCRIPT ANDA
// Ini adalah URL yang Anda dapatkan setelah men-deploy skrip di Bagian 1.
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwu-aDVWUGsW9QVt2WeTgK2jcioDEawBSK8JiAkoT_7JIrmifbps_KYhYFCC7vHz7RY/exec';

// Fungsi helper untuk menangani error spesifik dari skrip Google
function handleScriptError(error: unknown, context: string): Error {
  console.error(`Error during ${context}:`, error);
  if (error instanceof Error) {
    // Cek pesan error yang umum terjadi jika nama sheet salah
    if (error.message.includes("Cannot read properties of null")) {
      return new Error(
        `Kesalahan Konfigurasi Backend: Nama sheet yang dikonfigurasi di Google Apps Script Anda (variabel REQUEST_SHEET_NAME) tidak cocok dengan nama tab yang sebenarnya di Google Sheet Anda. Harap periksa keduanya.`
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
        'Content-Type': 'text/plain;charset=utf-8', // Gunakan text/plain untuk menghindari preflight CORS
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
    // Lemparkan kembali error yang sudah diformat agar bisa ditangkap oleh komponen UI
    throw handleScriptError(error, `action '${action}'`);
  }
}

// Fungsi helper untuk mem-parsing status dari data sheet dengan aman
function parseStatus(statusValue: any): Status {
  const valueAsString = String(statusValue || '').trim();

  // Pencocokan langsung
  if (Object.values(Status).includes(valueAsString as Status)) {
    return valueAsString as Status;
  }

  // Pencocokan tanpa membedakan huruf besar/kecil untuk status umum
  const lowerCaseValue = valueAsString.toLowerCase();
  if (lowerCaseValue.includes('dikerjakan') || lowerCaseValue.includes('progress')) {
      return Status.InProgress;
  }
  if (lowerCaseValue.includes('selesai') || lowerCaseValue.includes('done')) {
      return Status.Done;
  }
  if (lowerCaseValue.includes('terbuka') || lowerCaseValue.includes('open')) {
      return Status.Open;
  }
  
  // Fallback default untuk nilai tak terduga lainnya
  return Status.Open;
}


export const sheetService = {
  async fetchRequests(): Promise<ITRequest[]> {
    try {
        const response = await fetch(SCRIPT_URL, { method: 'GET', mode: 'cors' });
        if (!response.ok) {
            throw new Error(`Respons jaringan tidak baik: ${response.statusText}`);
        }
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || 'Gagal mengambil data dari skrip.');
        }
        
        // Data dari Google Sheet bisa memiliki casing kunci yang tidak konsisten dari Apps Script.
        // Kita akan menangani variasi umum (misalnya, huruf besar, huruf kecil) dan memastikan tipe yang benar.
        const rawData: any[] = result.data || [];
        const mappedData: ITRequest[] = rawData.map(item => ({
            id: Number(item.Id || item.id),
            timestamp: item.Timestamp || item.timestamp,
            name: item.Nama || item.nama,
            division: item.Divisi || item.divisi,
            problem: item.Masalah || item.masalah,
            category: item.Kategori || item.kategori,
            pic: item.PIC || item.pic,
            status: parseStatus(item.Status || item.status), // Gunakan fungsi parsing yang kuat
            notes: item.Catatan || item.catatan || item.Notes || item.notes || undefined,
        })).filter(r => r.id && r.timestamp); // Filter baris yang tidak dapat di-parse dengan benar (misalnya, tidak ada ID atau timestamp)

        return mappedData;
    } catch (error) {
        throw handleScriptError(error, 'fetchRequests');
    }
  },

  async addRequest(newRequestData: NewRequestData): Promise<ITRequest> {
    const result = await postToAction('addRequest', { data: newRequestData });
    // Skrip menangani pembuatan objek permintaan penuh, jadi kita hanya mengonfirmasi keberhasilan
    // Untuk menyegarkan UI, komponen akan memanggil fetchRequests() lagi.
    // Mengembalikan objek dummy untuk memenuhi tipe, meskipun tidak akan digunakan secara langsung.
    return { 
      ...newRequestData, 
      id: result.id, 
      timestamp: new Date().toISOString(), 
      status: Status.Open,
      pic: 'Belum Ditugaskan',
    };
  },

  async updateRequest(id: number, updates: Partial<ITRequest>): Promise<ITRequest | null> {
    await postToAction('updateRequest', { id: id, data: updates });
    // Sama seperti add, kita mengandalkan penyegaran data untuk melihat pembaruan.
    // Mengembalikan null karena kita tidak mendapatkan objek yang diperbarui kembali.
    return null;
  },

  async deleteRequest(id: number): Promise<boolean> {
    await postToAction('deleteRequest', { id: id });
    return true;
  },
};