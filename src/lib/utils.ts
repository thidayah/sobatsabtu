import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateUniqueCode() {
  const prefix = "SS";

  // Ambil 2 digit terakhir tahun
  const year = new Date().getFullYear().toString().slice(-2);

  // Karakter yang digunakan (A-Z + 0-9)
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  // Generate 9 karakter random
  let randomPart = "";
  for (let i = 0; i < 9; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    randomPart += chars[randomIndex];
  }

  return `${prefix}${year}-${randomPart}`;
}

// export function generateUniqueCodeSecure() {
//   const prefix = "SS";
//   const year = new Date().getFullYear().toString().slice(-2);
//   const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

//   const array = new Uint8Array(6);
//   crypto.getRandomValues(array);

//   const randomPart = Array.from(array)
//     .map((x) => chars[x % chars.length])
//     .join("");

//   return `${prefix}${year}-${randomPart}`;
// }

// Helper function to generate slug from name
export function generateSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/--+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
}

export function checkUUID(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    weekday: 'long'
  });
};

export function formatTime(timeString: string) {
  return timeString.substring(0, 5) + ' WIB';
};

export function formatDiff(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMilliseconds = now.getTime() - date.getTime();
  const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSeconds < 60) {
    return "Just now";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
};

export function normalizePhoneNumber(phone: string) {
  if (!phone) return '';

  // remove all characters except numbers
  let cleaned = phone.replace(/\D/g, '');

  // first 0 → 62
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.slice(1);
  }

  else if (cleaned.startsWith('62')) {
    return cleaned;
  }

  else if (cleaned.startsWith('8')) {
    cleaned = '62' + cleaned;
  }

  return cleaned;
}