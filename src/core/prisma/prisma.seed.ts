import { BadRequestException, Logger } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { hash } from 'argon2';
import { PrismaClient } from '@/prisma/generated/client';
import { CATEGORIES } from './data/categories.data';
import { STREAMS } from './data/streams.data';
import { USERNAMES } from './data/users.data';

const connectionString = process.env.DATABASE_URL ?? process.env.POSTGRES_URI;
if (!connectionString) {
  throw new Error('Задайте DATABASE_URL или POSTGRES_URI для подключения Prisma к PostgreSQL.');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main() {
  try {
    Logger.log('Начало заполнения базы данных...');

    await prisma.$transaction([
      prisma.user.deleteMany(),
      prisma.socialLink.deleteMany(),
      prisma.stream.deleteMany(),
      prisma.category.deleteMany(),
    ]);

    await prisma.category.createMany({
      data: CATEGORIES,
    });

    Logger.log('Категории успешно созданы');

    const categories = await prisma.category.findMany();

    const categoriesBySlug = Object.fromEntries(
      categories.map((category) => [category.slug, category]),
    );

    await prisma.$transaction(async (tx) => {
      for (const username of USERNAMES) {
        const randomCategory =
          categoriesBySlug[
            Object.keys(categoriesBySlug)[
              Math.floor(Math.random() * Object.keys(categoriesBySlug).length)
            ]
          ];

        const userExists = await tx.user.findUnique({
          where: {
            username,
          },
        });

        if (!userExists) {
          const createdUser = await tx.user.create({
            data: {
              email: `${username}@gmail.com`,
              password: await hash('12345678'),
              username,
              displayName: username,
              isEmailVerified: true,
              socialLinks: {
                createMany: {
                  data: [
                    {
                      title: 'Telegram',
                      url: `https://t.me/${username}`,
                      position: 1,
                    },
                    {
                      title: 'YouTube',
                      url: `https://youtube.com/@${username}`,
                      position: 2,
                    },
                  ],
                },
              },
              notificationSettings: {
                create: {},
              },
            },
          });
          const randomTitles = STREAMS[randomCategory.slug] ?? [`Стрим ${randomCategory.title}`];
          const randomTitle = randomTitles[Math.floor(Math.random() * randomTitles.length)];

          await tx.stream.create({
            data: {
              title: randomTitle,
              user: {
                connect: {
                  id: createdUser.id,
                },
              },
              category: {
                connect: {
                  id: randomCategory.id,
                },
              },
            },
          });

          Logger.log(`Пользователь "${createdUser.username}" и его стрим успешно созданы`);
        }
      }
    });

    Logger.log('Заполнение базы данных завершено успешно');
  } catch (error) {
    Logger.log(error);
    throw new BadRequestException('Ошибка при заполнении базы данных');
  } finally {
    Logger.log('Закрытие соединения с базой данных...');
    await prisma.$disconnect();
    Logger.log('Соединение с базой данных успешно закрыто');
  }
}

void main();
