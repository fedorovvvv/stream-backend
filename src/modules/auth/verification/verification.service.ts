/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import { User } from '@/prisma/generated/client';
import { TokenType } from '@/prisma/generated/enums';
import { generateToken } from '@/src/shared/utils/generate-token.util';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { getSessionMetadata } from '../../../shared/utils/session-metodata.util';
import { saveSession } from '../../../shared/utils/session.util';
import { MailService } from '../../libs/mail/mail.service';
import { VerificationInput } from './inputs/verification.input';

@Injectable()
export class VerificationService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
  ) {}

  public async verify(req: Request, input: VerificationInput, userAgent: string) {
    const { token } = input;
    const existingToken = await this.prismaService.token.findUnique({
      where: {
        token,
        type: TokenType.EMAIL_VERIFY,
      },
    });

    if (!existingToken) {
      throw new NotFoundException('Токен не найден');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const hasExpired = new Date(existingToken.expiresIn) < new Date();

    if (hasExpired) {
      throw new BadRequestException('Токен истек');
    }

    const user = await this.prismaService.user.update({
      where: {
        id: existingToken.userId,
      },
      data: {
        isEmailVerified: true,
      },
    });

    await this.prismaService.token.delete({
      where: {
        id: existingToken.id,
      },
    });

    const metadata = getSessionMetadata(req, userAgent);

    return saveSession(req, user, metadata);
  }

  public async sendVerificationToken(user: User) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const verificationToken = await generateToken(
      this.prismaService,
      user,
      TokenType.EMAIL_VERIFY,
      true,
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await this.mailService.sendVerificationToken(user.email, verificationToken.token);

    return true;
  }
}
