import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodosModule } from './module/todos.module';
import { AuthModule } from './module/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TodosModule,
    AuthModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'postgres',
          host: config.get<string>('DB_HOST') || 'localhost',
          port: Number(config.get<string>('DB_PORT')) || 5432,
          username: config.get<string>('DB_USERNAME'),
          password: config.get<string>('DB_PASSWORD'),
          database: config.get<string>('DB_DATABASE'),
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),
  ],
})
export class AppModule {}
