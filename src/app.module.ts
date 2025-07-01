import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { dbConfig } from './database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleModule } from './modules/ArcticleService/article.module';
import { UserModule } from './modules/User/user.module';
import { AuthModule } from './modules/Auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        ...dbConfig(configService),
      }),
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
      }),
    }),
    UserModule,
    ArticleModule,
    AuthModule,
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}
