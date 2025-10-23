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
  namespace: '/messages',
})
export class MessageGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger = new Logger(MessageGateway.name);
  private connectedUsers = new Map<string, string>(); // userId -> socketId
  private typingUsers = new Map<string, Set<number>>(); // consultationId -> Set of userIds

  handleConnection(client: Socket) {
    this.logger.log(`Message client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Message client disconnected: ${client.id}`);
    
    // إزالة المستخدم من قائمة المستخدمين المتصلين
    for (const [userId, socketId] of this.connectedUsers.entries()) {
      if (socketId === client.id) {
        this.connectedUsers.delete(userId);
        break;
      }
    }

    // إزالة من قائمة الكتابة
    for (const [consultationId, userIds] of this.typingUsers.entries()) {
      for (const [userId, socketId] of this.connectedUsers.entries()) {
        if (socketId === client.id) {
          userIds.delete(parseInt(userId));
          if (userIds.size === 0) {
            this.typingUsers.delete(consultationId);
          }
          break;
        }
      }
    }
  }

  @SubscribeMessage('join-messages')
  handleJoinMessages(
    @MessageBody() data: { userId: number },
    @ConnectedSocket() client: Socket,
  ) {
    this.connectedUsers.set(data.userId.toString(), client.id);
    this.logger.log(`User ${data.userId} joined messages namespace`);
  }

  @SubscribeMessage('send-message')
  handleSendMessage(
    @MessageBody() data: { 
      consultationId: number; 
      message: string; 
      senderId: number;
      messageType?: string;
      fileUrl?: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const room = `consultation_${data.consultationId}`;
    
    // إرسال الرسالة لجميع المشاركين في الاستشارة
    this.server.to(room).emit('new-message', {
      consultationId: data.consultationId,
      message: data.message,
      senderId: data.senderId,
      messageType: data.messageType || 'TEXT',
      fileUrl: data.fileUrl,
      timestamp: new Date(),
    });

    this.logger.log(`Message sent in consultation ${data.consultationId} by user ${data.senderId}`);
  }

  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody() data: { 
      consultationId: number; 
      userId: number; 
      isTyping: boolean;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const room = `consultation_${data.consultationId}`;
    
    if (data.isTyping) {
      // إضافة المستخدم لقائمة الكتابة
      if (!this.typingUsers.has(data.consultationId.toString())) {
        this.typingUsers.set(data.consultationId.toString(), new Set());
      }
      this.typingUsers.get(data.consultationId.toString())!.add(data.userId);
    } else {
      // إزالة المستخدم من قائمة الكتابة
      if (this.typingUsers.has(data.consultationId.toString())) {
        this.typingUsers.get(data.consultationId.toString())!.delete(data.userId);
        if (this.typingUsers.get(data.consultationId.toString())!.size === 0) {
          this.typingUsers.delete(data.consultationId.toString());
        }
      }
    }

    // إرسال حالة الكتابة للمشاركين الآخرين
    client.to(room).emit('user-typing', {
      userId: data.userId,
      isTyping: data.isTyping,
      typingUsers: Array.from(this.typingUsers.get(data.consultationId.toString()) || []),
      timestamp: new Date(),
    });
  }

  @SubscribeMessage('message-read')
  handleMessageRead(
    @MessageBody() data: { 
      messageId: number; 
      userId: number;
      consultationId: number;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const room = `consultation_${data.consultationId}`;
    
    // إشعار جميع المشاركين بأن الرسالة تم قراءتها
    this.server.to(room).emit('message-read-status', {
      messageId: data.messageId,
      userId: data.userId,
      timestamp: new Date(),
    });

    this.logger.log(`Message ${data.messageId} read by user ${data.userId}`);
  }

  @SubscribeMessage('join-consultation-messages')
  handleJoinConsultationMessages(
    @MessageBody() data: { consultationId: number; userId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const room = `consultation_${data.consultationId}`;
    client.join(room);
    
    this.connectedUsers.set(data.userId.toString(), client.id);
    this.logger.log(`User ${data.userId} joined messages for consultation ${data.consultationId}`);
  }

  @SubscribeMessage('leave-consultation-messages')
  handleLeaveConsultationMessages(
    @MessageBody() data: { consultationId: number; userId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const room = `consultation_${data.consultationId}`;
    client.leave(room);
    
    this.connectedUsers.delete(data.userId.toString());
    this.logger.log(`User ${data.userId} left messages for consultation ${data.consultationId}`);
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
    this.server.to(room).emit('message-notification', notification);
  }

  // الحصول على المستخدمين الذين يكتبون في استشارة معينة
  getTypingUsers(consultationId: number): number[] {
    return Array.from(this.typingUsers.get(consultationId.toString()) || []);
  }

  // الحصول على جميع المستخدمين المتصلين
  getConnectedUsers(): string[] {
    return Array.from(this.connectedUsers.keys());
  }
}
