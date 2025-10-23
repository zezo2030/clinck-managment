import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/consultation',
})
export class ConsultationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger = new Logger(ConsultationGateway.name);
  private connectedUsers = new Map<string, string>(); // userId -> socketId
  private consultationRooms = new Map<number, Set<string>>(); // consultationId -> Set of socketIds

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    
    // إزالة المستخدم من قائمة المستخدمين المتصلين
    for (const [userId, socketId] of this.connectedUsers.entries()) {
      if (socketId === client.id) {
        this.connectedUsers.delete(userId);
        break;
      }
    }

    // إزالة العميل من جميع الغرف
    for (const [consultationId, socketIds] of this.consultationRooms.entries()) {
      if (socketIds.has(client.id)) {
        socketIds.delete(client.id);
        if (socketIds.size === 0) {
          this.consultationRooms.delete(consultationId);
        }
      }
    }
  }

  @SubscribeMessage('join-consultation')
  handleJoinConsultation(
    @MessageBody() data: { consultationId: number; userId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const room = `consultation_${data.consultationId}`;
    client.join(room);
    
    // تتبع المستخدمين المتصلين
    this.connectedUsers.set(data.userId.toString(), client.id);
    
    // تتبع الغرف
    if (!this.consultationRooms.has(data.consultationId)) {
      this.consultationRooms.set(data.consultationId, new Set());
    }
    this.consultationRooms.get(data.consultationId)!.add(client.id);
    
    // إشعار المشاركين الآخرين
    client.to(room).emit('user-joined', {
      userId: data.userId,
      timestamp: new Date(),
    });

    this.logger.log(`User ${data.userId} joined consultation ${data.consultationId}`);
  }

  @SubscribeMessage('leave-consultation')
  handleLeaveConsultation(
    @MessageBody() data: { consultationId: number; userId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const room = `consultation_${data.consultationId}`;
    client.leave(room);
    
    // إزالة من التتبع
    this.connectedUsers.delete(data.userId.toString());
    
    if (this.consultationRooms.has(data.consultationId)) {
      this.consultationRooms.get(data.consultationId)!.delete(client.id);
      if (this.consultationRooms.get(data.consultationId)!.size === 0) {
        this.consultationRooms.delete(data.consultationId);
      }
    }
    
    // إشعار المشاركين الآخرين
    client.to(room).emit('user-left', {
      userId: data.userId,
      timestamp: new Date(),
    });

    this.logger.log(`User ${data.userId} left consultation ${data.consultationId}`);
  }

  @SubscribeMessage('start-consultation')
  handleStartConsultation(
    @MessageBody() data: { consultationId: number; userId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const room = `consultation_${data.consultationId}`;
    this.server.to(room).emit('consultation-started', {
      consultationId: data.consultationId,
      startedBy: data.userId,
      timestamp: new Date(),
    });

    this.logger.log(`Consultation ${data.consultationId} started by user ${data.userId}`);
  }

  @SubscribeMessage('end-consultation')
  handleEndConsultation(
    @MessageBody() data: { consultationId: number; userId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const room = `consultation_${data.consultationId}`;
    this.server.to(room).emit('consultation-ended', {
      consultationId: data.consultationId,
      endedBy: data.userId,
      timestamp: new Date(),
    });

    this.logger.log(`Consultation ${data.consultationId} ended by user ${data.userId}`);
  }

  @SubscribeMessage('user-typing')
  handleUserTyping(
    @MessageBody() data: { consultationId: number; userId: number; isTyping: boolean },
    @ConnectedSocket() client: Socket,
  ) {
    const room = `consultation_${data.consultationId}`;
    client.to(room).emit('user-typing', {
      userId: data.userId,
      isTyping: data.isTyping,
      timestamp: new Date(),
    });
  }

  // إرسال إشعارات للمستخدمين
  sendNotificationToUser(userId: number, notification: any) {
    const socketId = this.connectedUsers.get(userId.toString());
    if (socketId) {
      this.server.to(socketId).emit('notification', notification);
    }
  }

  // إرسال إشعارات لغرفة الاستشارة
  sendNotificationToConsultation(consultationId: number, notification: any) {
    const room = `consultation_${consultationId}`;
    this.server.to(room).emit('consultation-notification', notification);
  }

  // الحصول على عدد المشاركين في الاستشارة
  getConsultationParticipants(consultationId: number): number {
    return this.consultationRooms.get(consultationId)?.size || 0;
  }

  // الحصول على جميع المستخدمين المتصلين
  getConnectedUsers(): string[] {
    return Array.from(this.connectedUsers.keys());
  }
}
