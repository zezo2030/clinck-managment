import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RtcTokenBuilder, RtcRole } from 'agora-access-token';

@Injectable()
export class AgoraService {
  constructor(private configService: ConfigService) {}

  async generateToken(channelName: string, uid: number, role: string = 'publisher') {
    const appId = this.configService.get('AGORA_APP_ID');
    const appCertificate = this.configService.get('AGORA_APP_CERTIFICATE');
    
    if (!appId || !appCertificate) {
      throw new Error('Agora credentials not configured');
    }

    // تحديد دور المستخدم
    const userRole = role === 'publisher' ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;
    
    // إنشاء token صالح لمدة ساعة
    const expirationTimeInSeconds = 3600;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    const token = RtcTokenBuilder.buildTokenWithUid(
      appId,
      appCertificate,
      channelName,
      uid,
      userRole,
      privilegeExpiredTs,
    );
    
    return {
      appId,
      channel: channelName,
      token,
      uid,
      role,
      expirationTime: privilegeExpiredTs,
    };
  }

  async generateChannelName(consultationId: number) {
    return `consultation_${consultationId}`;
  }

  async getRecordingCredentials(channelName: string) {
    return {
      channel: channelName,
      recordingConfig: {
        maxIdleTime: 30,
        streamTypes: 2,
        audioProfile: 1,
        videoStreamType: 0,
        channelType: 0,
        subscribeVideoUids: [],
        subscribeAudioUids: [],
        subscribeUidGroup: 0,
      },
    };
  }

  async validateToken(token: string, channelName: string, uid: number) {
    // في التطبيق الحقيقي، يمكن إضافة منطق التحقق من صحة الـ token
    // هنا نعيد true للتبسيط
    return true;
  }

  async getChannelInfo(channelName: string) {
    return {
      channelName,
      isActive: true,
      participantCount: 0, // يمكن ربطه بقاعدة البيانات لتتبع المشاركين
    };
  }
}
