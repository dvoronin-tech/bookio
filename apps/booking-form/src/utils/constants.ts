export const API_URL = import.meta.env.DEV
    ? 'http://localhost:4041'
    : typeof window !== 'undefined'
      ? window.location.origin
      : import.meta.env.VITE_API_URL || 'https://bookio-backend.vercel.app';
