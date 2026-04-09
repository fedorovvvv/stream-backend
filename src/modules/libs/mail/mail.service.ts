import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { render } from '@react-email/components';
import type { SessionMetadata } from '@/src/shared/types/session-metadata.type';
import { PasswordRecoveryTemplate } from './templates/password-recovery.template';
import { VerificationTemplate } from './templates/verification.template';

@Injectable()
export class MailService {
  public constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  public async sendVerificationToken(email: string, token: string) {
    const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN');
    const html = await render(VerificationTemplate({ domain, token }));

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.sendMail(email, 'Верификация аккаунта', html);
  }

  public async sendPasswordResetToken(email: string, token: string, metadata: SessionMetadata) {
    const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN');
    const html = await render(PasswordRecoveryTemplate({ domain, token, metadata }));

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.sendMail(email, 'Верификация аккаунта', html);
  }

  private sendMail(email: string, subject: string, html: string) {
    return this.mailerService.sendMail({
      to: email,
      subject,
      html,
    });
  }
}
