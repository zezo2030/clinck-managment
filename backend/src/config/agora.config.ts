import { registerAs } from '@nestjs/config';

export default registerAs('agora', () => ({
  appId: process.env.AGORA_APP_ID || '',
  appCertificate: process.env.AGORA_APP_CERTIFICATE || '',
  tokenExpirationTime: 3600, // ساعة واحدة
  defaultRole: 'publisher',
}));
