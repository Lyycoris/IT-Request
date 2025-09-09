// Initial list of divisions
let divisions: string[] = ['Marketing', 'Komersil', 'Audit', 'General Affair'];

const simulateDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const divisionService = {
  async getDivisions(): Promise<string[]> {
    await simulateDelay(100);
    return [...divisions].sort();
  },

  async addDivision(name: string): Promise<string> {
    await simulateDelay(300);
    if (!name || name.trim() === '') {
      throw new Error('Nama divisi tidak boleh kosong.');
    }
    const formattedName = name.trim();
    if (divisions.some(d => d.toLowerCase() === formattedName.toLowerCase())) {
      throw new Error(`Divisi "${formattedName}" sudah ada.`);
    }
    divisions.push(formattedName);
    return formattedName;
  },

  async deleteDivision(name: string): Promise<string> {
    await simulateDelay(300);
    const index = divisions.findIndex(d => d.toLowerCase() === name.toLowerCase());
    if (index === -1) {
      throw new Error('Divisi tidak ditemukan.');
    }
    divisions.splice(index, 1);
    return name;
  },
};
