import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificationType } from '@/prisma/generated/client';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { MailService } from '../libs/mail/mail.service';
import { TelegramService } from '../libs/telegram/telegram.service';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  public constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
    private readonly notificationService: NotificationService,
    private readonly telegramService: TelegramService,
  ) {}

  //@Cron('*/10 * * * * *')
  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  public async deleteDeactivateAccounts() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const deactivateAccounts = await this.prismaService.user.findMany({
      where: {
        isDeactivated: true,
        deactivatedAt: {
          lte: sevenDaysAgo,
        },
      },
      include: {
        notificationSettings: true,
      },
    });

    for (const user of deactivateAccounts) {
      await this.mailService.sendAccountDeletion(user.email);

      if (user.notificationSettings?.telegramNotifications && user.telegramId) {
        await this.telegramService.sendAccountDeletion(user.telegramId);
      }
    }

    console.log('Deactivated accounts: ', deactivateAccounts);

    await this.prismaService.user.deleteMany({
      where: {
        isDeactivated: true,
        deactivatedAt: {
          lte: sevenDaysAgo,
        },
      },
    });
  }

  @Cron('0 0 */4 * *')
  public async notifyUsersEnableTwoFactor() {
    const fourDaysAgo = new Date();
    fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);

    const users = await this.prismaService.user.findMany({
      where: {
        isTotpEnabled: false,
        isDeactivated: false,
        notifications: {
          none: {
            type: NotificationType.ENABLE_TWO_FACTOR,
            createdAt: {
              gte: fourDaysAgo,
            },
          },
        },
      },
      include: {
        notificationSettings: true,
      },
    });

    for (const user of users) {
      try {
        await this.mailService.sendEnableTwoFactor(user.email);
      } catch (error) {
        this.logger.error(`Failed to send 2FA reminder to ${user.email}`, error);
      }

      if (user.notificationSettings?.siteNotifications) {
        await this.notificationService.createEnableTwoFactor(user.id);
      }

      if (user.notificationSettings?.telegramNotifications && user.telegramId) {
        try {
          await this.telegramService.sendEnableTwoFactor(user.telegramId);
        } catch (error) {
          this.logger.error(`Failed to send Telegram 2FA reminder to ${user.telegramId}`, error);
        }
      }
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  public async verifyChannel() {
    const users = await this.prismaService.user.findMany({
      include: {
        notificationSettings: true,
      },
    });

    for (const user of users) {
      const followersCount = await this.prismaService.follow.count({
        where: {
          followingId: user.id,
        },
      });

      if (followersCount > 10 && !user.isVerified) {
        await this.prismaService.user.update({
          where: {
            id: user.id,
          },
          data: {
            isVerified: true,
          },
        });

        await this.mailService.sendVerifyChannel(user.email);

        if (user.notificationSettings?.siteNotifications) {
          await this.notificationService.createVerifyChannel(user.id);
        }

        if (user.notificationSettings?.telegramNotifications && user.telegramId) {
          try {
            await this.telegramService.sendVerifyChannel(user.telegramId);
          } catch (error) {
            this.logger.error(`Failed to send Telegram 2FA reminder to ${user.telegramId}`, error);
          }
        }
      }
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  public async deleteOldNotifications() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    await this.prismaService.notification.deleteMany({
      where: {
        createdAt: {
          lte: sevenDaysAgo,
        },
      },
    });
  }
}
