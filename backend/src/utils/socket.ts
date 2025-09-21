// Define the interfaces directly in this file since we can't import them from frontend
interface ApplicationStats {
  totals: {
    certificates: number;
    schemes: number;
    grievances: number;
    total: number;
  };
  statuses: {
    certificates: Record<string, number>;
    schemes: Record<string, number>;
    grievances: Record<string, number>;
  };
}

interface RecentActivity {
  id: string;
  title: string;
  date: string;
  status: string;
  type: string;
  details: string;
}

import { Server } from 'socket.io';

// Declare global io variable
declare global {
  var io: Server;
}

// Store socket connections by user ID (imported from server.ts)
declare global {
  var userSockets: Map<string, string>;
}

/**
 * Emit a real-time update event to a specific user
 * @param userId - The ID of the user to send the update to
 * @param event - The event name
 * @param data - The data to send
 */
export const emitToUser = (userId: string, event: string, data: any) => {
  if (global.io && global.userSockets) {
    const socketId = global.userSockets.get(userId);
    if (socketId) {
      global.io.to(socketId).emit(event, data);
    }
  }
};

/**
 * Emit a dashboard update event to a specific user
 * @param userId - The ID of the user whose dashboard needs updating
 * @param stats - Updated application statistics
 * @param recentActivity - Updated recent activity
 */
export const emitDashboardUpdate = (userId: string, stats: ApplicationStats, recentActivity: RecentActivity[]) => {
  emitToUser(userId, 'dashboardUpdate', {
    stats,
    recentActivity
  });
};

/**
 * Emit an application status update event
 * @param userId - The ID of the user to notify
 * @param applicationId - The ID of the application that was updated
 * @param serviceType - The type of service (Certificates, Schemes, Grievances, etc.)
 * @param status - The new status
 * @param message - Additional message
 */
export const emitApplicationUpdate = (userId: string, applicationId: string, serviceType: string, status: string, message: string) => {
  emitToUser(userId, 'applicationUpdate', {
    applicationId,
    serviceType,
    status,
    message
  });
};