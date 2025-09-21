import { io, Socket } from 'socket.io-client';

// Use NEXT_PUBLIC_API_BASE_URL from environment or fallback to localhost
// For socket connections, we need the base URL without /api
const SOCKET_BASE_URL = typeof window !== 'undefined' 
  ? (process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '') || 'http://localhost:3002')
  : (process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '') || 'http://localhost:3002');

console.log('Socket Base URL (determined at runtime):', SOCKET_BASE_URL); // Debug log

class SocketService {
  private socket: Socket | null = null;
  private userId: string | null = null;

  connect(userId: string) {
    console.log('Attempting to connect to socket with userId:', userId); // Debug log
    
    if (this.socket?.connected && this.userId === userId) {
      console.log('Socket already connected with same userId'); // Debug log
      return;
    }

    // Disconnect existing socket if userId changed
    if (this.socket && this.userId !== userId) {
      console.log('Disconnecting existing socket due to userId change'); // Debug log
      this.disconnect();
    }

    this.userId = userId;
    
    // Initialize socket connection
    this.socket = io(SOCKET_BASE_URL, {
      transports: ['websocket', 'polling'],
      withCredentials: true
    });

    this.socket.on('connect', () => {
      console.log('Connected to socket server with ID:', this.socket?.id);
      // Join the user room
      this.socket?.emit('join', userId);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }

  disconnect() {
    console.log('Disconnecting socket'); // Debug log
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.userId = null;
    }
  }

  onDashboardUpdate(callback: (data: any) => void) {
    console.log('Setting up dashboard update listener'); // Debug log
    this.socket?.on('dashboardUpdate', (data) => {
      console.log('Received dashboard update:', data); // Debug log
      callback(data);
    });
  }

  offDashboardUpdate(callback: (data: any) => void) {
    console.log('Removing dashboard update listener'); // Debug log
    this.socket?.off('dashboardUpdate', callback);
  }

  onApplicationUpdate(callback: (data: any) => void) {
    console.log('Setting up application update listener'); // Debug log
    this.socket?.on('applicationUpdate', (data) => {
      console.log('Received application update:', data); // Debug log
      callback(data);
    });
  }

  offApplicationUpdate(callback: (data: any) => void) {
    console.log('Removing application update listener'); // Debug log
    this.socket?.off('applicationUpdate', callback);
  }

  isConnected(): boolean {
    return !!this.socket?.connected;
  }
}

// Export singleton instance
export const socketService = new SocketService();