import { io, Socket } from 'socket.io-client';

// Use NEXT_PUBLIC_API_BASE_URL from environment or fallback to localhost
// Remove /api from the end since we need the base URL for socket connection
const SOCKET_BASE_URL = typeof window !== 'undefined' 
  ? (process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '') || 'http://localhost:3002')
  : (process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '') || 'http://localhost:3002');

console.log('Socket Base URL (determined at runtime):', SOCKET_BASE_URL); // Debug log

class SocketService {
  private socket: Socket | null = null;
  private userId: string | null = null;

  connect(userId: string) {
    if (this.socket?.connected && this.userId === userId) {
      return;
    }

    // Disconnect existing socket if userId changed
    if (this.socket && this.userId !== userId) {
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
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.userId = null;
    }
  }

  onDashboardUpdate(callback: (data: any) => void) {
    this.socket?.on('dashboardUpdate', callback);
  }

  offDashboardUpdate(callback: (data: any) => void) {
    this.socket?.off('dashboardUpdate', callback);
  }

  onApplicationUpdate(callback: (data: any) => void) {
    this.socket?.on('applicationUpdate', callback);
  }

  offApplicationUpdate(callback: (data: any) => void) {
    this.socket?.off('applicationUpdate', callback);
  }

  isConnected(): boolean {
    return !!this.socket?.connected;
  }
}

// Export singleton instance
export const socketService = new SocketService();