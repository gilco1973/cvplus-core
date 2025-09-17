// @ts-ignore - Export conflicts
/**
 * CORS Configuration for CVPlus Platform
 */
export const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://cvplus.app',
    'https://cvplus.web.app',
    'https://cvplus.firebaseapp.com'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};