import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import dotenv from 'dotenv';
import { ChannelChats } from './src/entities/ChannelChats';
import { ChannelMembers } from './src/entities/ChannelMembers';
import { Channels } from './src/entities/Channels';
import { DMs } from './src/entities/DMs';
import { Mentions } from './src/entities/Mentions';
import { Users } from './src/entities/Users';
import { WorkspaceMembers } from './src/entities/WorkspaceMembers';
import { Workspaces } from './src/entities/Workspaces';
import path from 'path';

dotenv.config();
const config: TypeOrmModuleOptions = {
  // type: 'postgres',
  // host: process.env.DB_HOST,
  // port: parseInt(process.env.DB_PORT),
  // username: process.env.DB_USERNAME,
  // password: process.env.DB_PASSWORD,
  // database: process.env.DB_DATABASE,
  type: 'sqlite',
  database: `${path.resolve(__dirname)}/data/db.sqlite`,
  entities: [
    ChannelChats,
    ChannelMembers,
    Channels,
    DMs,
    Mentions,
    Users,
    WorkspaceMembers,
    Workspaces,
  ],
  migrations: [__dirname + '/src/migrations/*.ts'],
  cli: { migrationsDir: 'src/migrations' },
  autoLoadEntities: true,
  synchronize: false, // 개발중에만 사용. 엔티티를 DB에 반영
  logging: true,
  keepConnectionAlive: true, // hot reloading 사용중 커넥션 끊어지지 않게 하기 위해
};

export = config;
