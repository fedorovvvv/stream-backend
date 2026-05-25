import { Module } from '@nestjs/common';
import { TelegramModule } from '../../libs/telegram/telegram.module';
import { PasswordRecoveryResolver } from './password-recovery.resolver';
import { PasswordRecoveryService } from './password-recovery.service';

@Module({
  imports: [TelegramModule],
  providers: [PasswordRecoveryResolver, PasswordRecoveryService],
})
export class PasswordRecoveryModule {}
