import { Module } from '@nestjs/common';
import { AgoraService } from './agora.service';
import { AgoraController } from './agora.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [AgoraController],
  providers: [AgoraService],
  exports: [AgoraService],
})
export class AgoraModule {}
