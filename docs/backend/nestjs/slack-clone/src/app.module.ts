import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { UsersModule } from './users/users.module';
import { WorkspacesModule } from './workspaces/workspaces.module';
import { ChannelsModule } from './channels/channels.module';
import { DmsModule } from './dms/dms.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as ormconfig from '../ormconfig';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';

// 외부로부터 설정값을 페치해올 수 있다.
const getEnv = async () => {
  // const res = await axios.get('/비밀키요청');
  return {
    SECRET2: '김현진바보',
  };
};

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [getEnv] }), // @nestjs/config 적용. .env를 사용할 수 있도록 하기 위함
    TypeOrmModule.forRoot(ormconfig),
    UsersModule,
    WorkspacesModule,
    ChannelsModule,
    DmsModule,
    AuthModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [
    // 원형
    {
      provide: AppService, // 고유한 키, 클래스를 넣으면 클래스의 이름을 키로 사용한다.
      useClass: AppService,
    },
    {
      provide: 'CUSTOM_PROVIDER',
      useFactory: () => {
        return {
          a: 'b',
        };
      },
    },
    {
      provide: 'CUSTOM_VAL',
      useValue: 123,
    },
    // 간편한 형태
    ConfigService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*'); // logger 미들웨어 적용하기
  }
}
