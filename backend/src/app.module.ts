import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'node:path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FilmsController } from './films/films.controller';
import { OrderController } from './order/order.controller';
import { FilmsService } from './films/films.service';
import { OrderService } from './order/order.service';
import { configProvider } from './app.config.provider';

import { Film } from './films/entities/film.entity';
import { Schedule } from './films/entities/schedule.entity';
import { Order } from './order/entities/order.entity';
import { FilmsRepository } from './repository/films.repository';
import { OrdersRepository } from './repository/order.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),

    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public', 'content', 'afisha'),
      serveRoot: '/content/afisha',
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const driver = configService.get<string>('DATABASE_DRIVER') || 'postgres';
        if (driver === 'postgres') {
          return {
            type: 'postgres',
            host: configService.get('DATABASE_HOST', 'localhost'),
            port: parseInt(configService.get('DATABASE_PORT', '5432')),
            username: configService.get('DATABASE_USERNAME', 'postgres'),
            password: configService.get('DATABASE_PASSWORD', 'postgres'),
            database: configService.get('DATABASE_NAME', 'film_nest'),
            entities: [Film, Schedule, Order],
            synchronize: true,
          };
        }
        throw new Error(`Unsupported DATABASE_DRIVER: ${driver}`);
      },
    }),

    TypeOrmModule.forFeature([Film, Schedule, Order]),
  ],
  controllers: [FilmsController, OrderController],
  providers: [
    FilmsRepository,
    OrdersRepository,
    FilmsService,
    OrderService,
    configProvider,
  ],
})
export class AppModule {}
