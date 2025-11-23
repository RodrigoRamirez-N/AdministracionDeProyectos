// --- Interfaces para el Directorio ---
export interface Phone {
  id: number;
  number: string;
}

export interface Contact {
  id: number;
  name: string;
  title: string;
  email: string;
  phones: Phone[];
}

export interface Faculty {
  id: number;
  name: string;
  contacts: Contact[];
}

// --- Interface para Campos Deportivos ---
export interface SportField {
  id: number;
  name: string;
  location: string;
  images: SportFieldImage[];
}

// --- Interfaces para la Biblioteca ---
export interface LibraryInfo {
  name: string;
  schedule: string;
  location: string;
  contact_phone: string;
  contact_email: string;
  website_url: string;
}

export interface LibraryRoom {
  id: number;
  name: string;
  capacity: string;
  equipment: string;
  image_url?: string;
}

export interface LibraryData {
  info_general: LibraryInfo;
  salas_y_espacios: LibraryRoom[];
}

// --- Interface para Números Importantes ---
export interface ImportantNumber {
  id: number;
  name: string;
  person_name: string;
  phone: string;
  email: string;
}

export interface SportFieldImage {
  id: number;
  url: string;
  alt_text: string;
}