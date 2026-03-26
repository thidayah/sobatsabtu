import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.NEXT_PUBLIC_AUTH_SECRET || 'your-secret-key';

export interface User {
  id: string;
  name: string;
  email: string;
  token: string;
  expiresIn: string;
}

// Client-side only functions
export const saveAuth = (user: User) => {
  if (typeof window === 'undefined') return;
  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(user), SECRET_KEY).toString();
  localStorage.setItem('auth', encrypted);
};

export const getAuth = (): User | null => {
  if (typeof window === 'undefined') return null;
  
  const encrypted = localStorage.getItem('auth');
  if (!encrypted) return null;
  
  try {
    const decrypted = CryptoJS.AES.decrypt(encrypted, SECRET_KEY).toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch {
    return null;
  }
};

export const clearAuth = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auth');
};

export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  const auth = getAuth();
  return !!auth;
};