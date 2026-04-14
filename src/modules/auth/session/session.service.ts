/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { verify } from 'argon2';
import type { Request } from 'express';
import { TOTP } from 'otpauth';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { RedisService } from '../../../core/redis/redis.service';
import { getSessionMetadata } from '../../../shared/utils/session-metodata.util';
import { destroySession, saveSession } from '../../../shared/utils/session.util';
import { VerificationService } from '../verification/verification.service';
import { LoginInput } from './inputs/login.input';

/** Сессия connect-redis в JSON + id из ключа Redis после фильтра по userId */
type UserSessionListItem = {
  id: string;
  userId?: string;
  createdAt?: number;
};

type RedisSessionJson = Omit<UserSessionListItem, 'id'>;

@Injectable()
export class SessionService {
  private readonly logger = new Logger(SessionService.name);

  public constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly verificationService: VerificationService,
  ) {}

  public async findByUser(req: Request) {
    const userId = req.session.userId;

    if (!userId) {
      throw new NotFoundException('Пользователь не обнаружен в сессии');
    }

    const prefix = this.configService.getOrThrow<string>('SESSION_FOLDER');
    const keys = await this.redisService.client.keys(`${prefix}*`);

    const userSessions: UserSessionListItem[] = [];

    for (const key of keys) {
      const sessionData = await this.redisService.get(key);

      if (sessionData) {
        const session = JSON.parse(sessionData) as RedisSessionJson;

        if (session.userId === userId) {
          userSessions.push({
            ...session,
            id: key.split(':')[1] ?? '',
          });
        }
      }
    }

    userSessions.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));

    return userSessions.filter((session) => session.id !== req.session.id);
  }

  public async findCurrent(req: Request) {
    const sessionId = req.session.id;

    const sessionData = await this.redisService.get(
      `${this.configService.getOrThrow<string>('SESSION_FOLDER')}${sessionId}`,
    );
    if (sessionData === null) {
      throw new NotFoundException('Сессия не найдена в хранилище');
    }
    const session = JSON.parse(sessionData);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return {
      ...session,
      id: sessionId,
    };
  }

  public async login(req: Request, input: LoginInput, userAgent: string) {
    const { login, password, pin } = input;

    const user = await this.prismaService.user.findFirst({
      where: {
        OR: [{ username: { equals: login } }, { email: { equals: login } }],
      },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const isPasswordValid = await verify(user.password, password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверный пароль');
    }

    if (!user.isEmailVerified) {
      await this.verificationService.sendVerificationToken(user);

      throw new BadRequestException(
        'Аккаунт не верифицирован. Пожалуйста, проверьте свою электронную почту для подтверждения.',
      );
    }

    if (user.isTotpEnabled) {
      if (!user.totpSecret) {
        throw new BadRequestException(' ');
      }

      if (!pin) {
        return {
          message: 'Необходим код для завершения авторизации',
        };
      }

      const totp = new TOTP({
        issuer: 'TeaStream',
        label: `${user.email}`,
        algorithm: 'SHA1',
        digits: 6,
        secret: user.totpSecret,
      });

      const delta = totp.validate({ token: pin });

      if (delta === null) {
        throw new BadRequestException('Неверный код');
      }
    }

    const metadata = getSessionMetadata(req, userAgent);

    return saveSession(req, user, metadata);
  }

  public async logout(req: Request) {
    return destroySession(req, this.configService);
  }

  public async clearSession(req: Request) {
    req.res?.clearCookie(this.configService.getOrThrow<string>('SESSION_NAME'));

    return true;
  }

  public async remove(req: Request, id: string) {
    if (req.session.id === id) {
      throw new ConflictException('Невозможно удалить текущую сессию');
    }

    await this.redisService.client.del(
      `${this.configService.getOrThrow<string>('SESSION_FOLDER')}${id}`,
    );

    return true;
  }
}
