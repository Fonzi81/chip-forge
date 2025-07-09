export const saveDesign = (projectId: string, design: string) => {
  try {
    localStorage.setItem(`chipforge-design-${projectId}`, design);
  } catch (error) {
    console.error('Failed to save design to localStorage:', error);
  }
};

export const loadDesign = (projectId: string): string | null => {
  try {
    return localStorage.getItem(`chipforge-design-${projectId}`);
  } catch (error) {
    console.error('Failed to load design from localStorage:', error);
    return null;
  }
};

export const listDesigns = (): string[] => {
  try {
    return Object.keys(localStorage)
      .filter((key) => key.startsWith('chipforge-design-'))
      .map((key) => key.replace('chipforge-design-', ''));
  } catch (error) {
    console.error('Failed to list designs from localStorage:', error);
    return [];
  }
};

export const deleteDesign = (projectId: string) => {
  try {
    localStorage.removeItem(`chipforge-design-${projectId}`);
  } catch (error) {
    console.error('Failed to delete design from localStorage:', error);
  }
};

// Additional utility functions for HDL designs
export interface HDLDesign {
  id: string;
  name: string;
  description: string;
  verilog: string;
  io: Array<{ name: string; direction: 'input' | 'output'; width: number }>;
  createdAt: string;
  updatedAt: string;
}

export const saveHDLDesign = (design: HDLDesign) => {
  try {
    const key = `chipforge-hdl-${design.id}`;
    localStorage.setItem(key, JSON.stringify(design));
  } catch (error) {
    console.error('Failed to save HDL design to localStorage:', error);
  }
};

export const loadHDLDesign = (designId: string): HDLDesign | null => {
  try {
    const key = `chipforge-hdl-${designId}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to load HDL design from localStorage:', error);
    return null;
  }
};

export const listHDLDesigns = (): HDLDesign[] => {
  try {
    return Object.keys(localStorage)
      .filter((key) => key.startsWith('chipforge-hdl-'))
      .map((key) => {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
      })
      .filter((design): design is HDLDesign => design !== null)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  } catch (error) {
    console.error('Failed to list HDL designs from localStorage:', error);
    return [];
  }
};

export const deleteHDLDesign = (designId: string) => {
  try {
    const key = `chipforge-hdl-${designId}`;
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to delete HDL design from localStorage:', error);
  }
}; 