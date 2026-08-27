import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isConnected = false;
let connectionError: string | null = null;

// Event listeners for mongoose connection lifecycle
mongoose.connection.on('connected', () => {
  isConnected = true;
  connectionError = null;
  console.log(`[MongoDB Atlas] Connected successfully to host: ${mongoose.connection.host}, database: ${mongoose.connection.name}`);
});

mongoose.connection.on('error', (err) => {
  isConnected = false;
  connectionError = err.message;
  console.error('[MongoDB Atlas] Connection runtime error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.warn('[MongoDB Atlas] Connection disconnected.');
});

export async function connectDB(): Promise<boolean> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.log('[MongoDB Atlas] No MONGODB_URI found in server environment. Using in-memory fallback store.');
    isConnected = false;
    return false;
  }

  // Hide credentials when logging URI for security
  const sanitizedUri = uri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');
  console.log(`[MongoDB Atlas] Connecting to database using URI: ${sanitizedUri}`);

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 45000,
      autoIndex: true,
    });

    isConnected = true;
    connectionError = null;
    console.log(`[MongoDB Atlas] Database connection established successfully. Active state: ${mongoose.connection.readyState}`);
    return true;
  } catch (error: any) {
    isConnected = false;
    connectionError = error.message;
    console.error('[MongoDB Atlas] Initial connection failed:', error.message);
    console.log('[MongoDB Atlas] Operating with in-memory resilient fallback document store.');
    return false;
  }
}

export function isDbConnected(): boolean {
  return isConnected && mongoose.connection.readyState === 1;
}

export function getDbStatus() {
  return {
    connected: isDbConnected(),
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host || null,
    name: mongoose.connection.name || null,
    error: connectionError,
    hasMongoUri: !!process.env.MONGODB_URI,
    hasJwtSecret: !!process.env.JWT_SECRET,
  };
}
