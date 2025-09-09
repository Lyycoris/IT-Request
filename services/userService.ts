import { User } from '../types';

const users: User[] = [
  { id: 1, username: 'admin', role: 'Admin', name: 'Administrator Sistem' },
  { id: 2, username: 'marketing', role: 'Pengguna', name: 'Divisi Marketing', division: 'Marketing' },
  { id: 3, username: 'komersil', role: 'Pengguna', name: 'Divisi Komersil', division: 'Komersil' },
  { id: 4, username: 'audit', role: 'Pengguna', name: 'Divisi Audit', division: 'Audit' },
  { id: 5, username: 'general_affair', role: 'Pengguna', name: 'Divisi General Affair', division: 'General Affair' },
];

// In a real app, passwords would be hashed. Here we use a simple map for demonstration.
const passwords: Record<string, string> = {
  admin: 'admin123',
  marketing: 'marketing123',
  komersil: 'komersil123',
  audit: 'audit123',
  general_affair: 'generalaffair123'
};

const simulateDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const userService = {
  async login(username: string, password_input: string): Promise<User | null> {
    await simulateDelay(500);
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (user && passwords[user.username] === password_input) {
      return user;
    }
    return null;
  },

  async fetchUsers(): Promise<User[]> {
    await simulateDelay(300);
    // Return all users except the admin itself, sorted by name, with their passwords
    const regularUsers = users
      .filter(u => u.role !== 'Admin')
      .map(u => ({
        ...u,
        password: passwords[u.username], // Add password here
      }));
      
    return regularUsers.sort((a, b) => a.name.localeCompare(b.name));
  },

  async addUser(newUserData: Omit<User, 'id' | 'role'> & { password: string }): Promise<User> {
    await simulateDelay(500);

    if (users.some(u => u.username.toLowerCase() === newUserData.username.toLowerCase())) {
      throw new Error('Username sudah ada. Harap gunakan username lain.');
    }
    if (!newUserData.password || newUserData.password.length < 6) {
        throw new Error('Password harus terdiri dari minimal 6 karakter.');
    }

    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const newUser: User = {
      id: newId,
      username: newUserData.username,
      name: newUserData.name,
      division: newUserData.division,
      role: 'Pengguna',
    };

    users.push(newUser);
    passwords[newUser.username] = newUserData.password;
    
    return newUser;
  },

  async deleteUser(userId: number): Promise<boolean> {
    await simulateDelay(400);
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('Pengguna tidak ditemukan.');
    }
    if (users[userIndex].role === 'Admin') {
      throw new Error('Akun admin tidak dapat dihapus.');
    }
    
    const userToDelete = users[userIndex];
    delete passwords[userToDelete.username];
    users.splice(userIndex, 1);
    
    return true;
  },
};