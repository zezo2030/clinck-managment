import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AgoraService } from './agora.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('agora')
@UseGuards(JwtAuthGuard)
export class AgoraController {
  constructor(private agoraService: AgoraService) {}

  @Post('token')
  async generateToken(@Body() body: { channelName: string; uid: number; role?: string }) {
    return this.agoraService.generateToken(body.channelName, body.uid, body.role);
  }

  @Post('channel')
  async createChannel(@Body() body: { consultationId: number }) {
    const channelName = await this.agoraService.generateChannelName(body.consultationId);
    return { channelName };
  }

  @Post('recording')
  async startRecording(@Body() body: { channelName: string }) {
    return this.agoraService.getRecordingCredentials(body.channelName);
  }

  @Post('validate')
  async validateToken(@Body() body: { token: string; channelName: string; uid: number }) {
    return this.agoraService.validateToken(body.token, body.channelName, body.uid);
  }

  @Post('channel-info')
  async getChannelInfo(@Body() body: { channelName: string }) {
    return this.agoraService.getChannelInfo(body.channelName);
  }
}
