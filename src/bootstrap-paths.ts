import { join } from 'node:path';
import { register } from 'tsconfig-paths';

const distDir = join(__dirname, '..');
const rootDir = join(distDir, '..');

// Скомпилированный код в dist/src, Prisma — в prisma/ у корня репозитория
register({
  baseUrl: rootDir,
  paths: {
    '@/prisma/generated/*': ['prisma/generated/*'],
    '@/src/*': ['dist/src/*'],
    '@prisma/generated': ['prisma/generated'],
    '@prisma/generated/*': ['prisma/generated/*'],
    'prisma/generated/*': ['prisma/generated/*'],
  },
});
