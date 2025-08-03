import { Module } from '@nestjs/common';
import { ServeStaticModule } from "@nestjs/serve-static";
import { MongooseModule } from '@nestjs/mongoose';
import * as path from "node:path";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { configProvider } from "./app.config.provider";
import { FilmsModule } from './films/films.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI') || 'mongodb://localhost:27017/afisha',
      }),
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public'),
      serveRoot: '/content/afisha',
    }),
    FilmsModule,
    OrderModule,
  ],
  controllers: [],
  providers: [
    configProvider
  ],
})
export class AppModule {}