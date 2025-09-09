export enum Status {
  Open = 'Terbuka',
  InProgress = 'Sedang Dikerjakan',
  Done = 'Selesai',
}

export interface ITRequest {
  id: number;
  timestamp: string; // ISO string for date
  name: string;
  division: string;
  problem: string;
  category: 'Perangkat Keras' | 'Perangkat Lunak' | 'Jaringan' | 'Lainnya';
  pic: string;
  status: Status;
  notes?: string;
}

export type NewRequestData = Omit<ITRequest, 'id' | 'timestamp' | 'status' | 'pic' | 'notes'>;

// New types for authentication
export type Role = 'Admin' | 'Pengguna';

export interface User {
  id: number;
  username: string;
  role: Role;
  name: string; // Full name for display
  division?: string; // Users are tied to a division
  password?: string;
}