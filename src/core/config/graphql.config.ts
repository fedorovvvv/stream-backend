import type { ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { join } from 'path';
import { isDev } from '../../shared/utils/is-dev.util';

export function getGraphQLConfig(configService: ConfigService): ApolloDriverConfig {
  return {
    // Иначе Playground не шлёт Cookie → logout уничтожает «чужой» session id, ключ логина в Redis остаётся
    playground: isDev(configService)
      ? {
          settings: {
            'request.credentials': 'same-origin',
          },
        }
      : false,
    path: configService.getOrThrow<string>('GRAPHQL_PREFIX'),
    autoSchemaFile: join(process.cwd(), 'src/core/graphql/shema.gql'),
    sortSchema: true,
    context: ({ req, res }: { req: Request; res: Response }) => ({ req, res }),
    installSubscriptionHandlers: true,
  };
}
