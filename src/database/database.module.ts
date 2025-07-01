import { ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import 'dotenv/config';

export const dbConfig = (configService?: ConfigService): DataSourceOptions => {
  const config = configService || new ConfigService();
  return {
    type: 'postgres',
    host: config.get('POSTGRES_HOST'),
    port: config.get('POSTGRES_PORT'),
    username: config.get('POSTGRES_USER'),
    password: config.get('POSTGRES_PASSWORD'),
    database: config.get('POSTGRES_DB'),
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: false,
    migrations: ['dist/migrations/*.js'],
    migrationsTableName: 'migrations',
  };
};

export class DatabaseModule {}

const options = dbConfig();

export const dataSource = new DataSource(options);
