import { Injectable, NotAcceptableException } from '@nestjs/common';
import { Request } from 'express';
import { TokenType } from '@/prisma/generated/enums';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { generateToken } from '@/src/shared/utils/generate-token.util';
import { getSessionMetadata } from '@/src/shared/utils/session-metodata.util';
import { MailService } from '../../libs/mail/mail.service';
import { ResetPasswordInput } from './inputs/reset-passwort.input';

@Injectable()
export class PasswordRecoveryService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
  ) {}

  public async resetPassword(req: Request, input: ResetPasswordInput, userAgent: string) {
    const { email } = input;

    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotAcceptableException('Пользователь не найден');
    }

    const resetToken = await generateToken(this.prismaService, user, TokenType.PASSWORD_RESET);

    const metadata = getSessionMetadata(req, userAgent);

    await this.mailService.sendPasswordResetToken(user.email, resetToken.token, metadata);

    return true;
  }
}
