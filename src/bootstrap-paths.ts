import { join } from 'node:path';

// Скомпилированный main лежит в dist/src — алиасы @/* должны резолвиться от dist/
process.env.TS_NODE_BASEURL = join(__dirname, '..');
