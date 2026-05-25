/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/await-thenable */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { TransactionStatus } from '@/prisma/generated/enums';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { LivekitService } from '../libs/livekit/livekit.service';
import { StripeService } from '../libs/stripe/stripe.service';
import { TelegramService } from '../libs/telegram/telegram.service';
import { NotificationService } from '../notification/notification.service';

type StripeClient = InstanceType<typeof Stripe>;
type StripeWebhookEvent = ReturnType<StripeClient['webhooks']['constructEvent']>;
type StripeCheckoutSession = Extract<
  StripeWebhookEvent['data']['object'],
  { object: 'checkout.session' }
>;

@Injectable()
export class WebhookService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly livekitService: LivekitService,
    private readonly notificationService: NotificationService,
    private readonly telegramService: TelegramService,
    private readonly stripeService: StripeService,
    private readonly configService: ConfigService,
  ) {}

  public async receiveWebhookLivekit(body: string, authorization: string) {
    const event = await this.livekitService.receiver.receive(body, authorization, true);

    if (event.event === 'ingress_started') {
      const stream = await this.prismaService.stream.update({
        where: {
          ingressId: event.ingressInfo?.ingressId,
        },
        data: {
          isLive: true,
        },
        include: {
          user: true,
        },
      });

      const followers = await this.prismaService.follow.findMany({
        where: {
          followingId: stream.user.id,
          follower: {
            isDeactivated: false,
          },
        },
        include: {
          follower: {
            include: {
              notificationSettings: true,
            },
          },
        },
      });

      for (const follow of followers) {
        const follower = follow.follower;

        if (follower.notificationSettings?.siteNotifications) {
          await this.notificationService.createStreamStart(follower.id, stream.user);
        }

        if (follower.notificationSettings?.telegramNotifications && follower.telegramId) {
          await this.telegramService.sendStreamStart(follower.telegramId, stream.user);
        }
      }
    }

    if (event.event === 'ingress_ended') {
      const stream = await this.prismaService.stream.update({
        where: {
          ingressId: event.ingressInfo?.ingressId,
        },
        data: {
          isLive: false,
        },
      });

      await this.prismaService.chatMessage.deleteMany({
        where: {
          streamId: stream.id,
        },
      });
    }
  }

  public async receiveWebhookStripe(event: StripeWebhookEvent) {
    const session = event.data.object as StripeCheckoutSession;

    if (event.type == 'checkout.session.completed') {
      const metadata = session.metadata;
      if (!metadata?.planId || !metadata.userId || !metadata.channelId) {
        return;
      }

      const { planId, userId, channelId } = metadata;

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDay() + 30);

      const sponsorshipSubscription = await this.prismaService.sponsorshipSubscription.create({
        data: {
          expiresAt,
          planId,
          userId,
          channelId,
        },
        include: {
          plan: true,
          user: true,
          channel: {
            include: {
              notificationSettings: true,
            },
          },
        },
      });

      await this.prismaService.transaction.updateMany({
        where: {
          stripeSubscriptionId: session.id,
          status: TransactionStatus.PENDING,
        },
        data: {
          status: TransactionStatus.SUCCESS,
        },
      });

      const { plan, user, channel } = sponsorshipSubscription;
      if (!plan || !user || !channel) {
        return;
      }

      if (channel.notificationSettings?.siteNotifications) {
        await this.notificationService.createNewSponsorship(channel.id, plan, user);
      }

      if (channel.notificationSettings?.telegramNotifications && channel.telegramId) {
        await this.telegramService.sendNewSponsorship(channel.telegramId, plan, user);
      }
    }

    if (event.type === 'checkout.session.expired') {
      await this.prismaService.transaction.updateMany({
        where: {
          stripeSubscriptionId: session.id,
        },
        data: {
          status: TransactionStatus.EXPIRES,
        },
      });
    }

    if (event.type === 'checkout.session.async_payment_failed') {
      await this.prismaService.transaction.updateMany({
        where: {
          stripeSubscriptionId: session.id,
        },
        data: {
          status: TransactionStatus.FAILED,
        },
      });
    }
  }

  public constuctStripeEvent(payload: any, signature: any): StripeWebhookEvent {
    return this.stripeService.webhooks.constructEvent(
      payload,
      signature,
      this.configService.getOrThrow<string>('STRIPE_WEBHOOK_SECRET'),
    );
  }
}
