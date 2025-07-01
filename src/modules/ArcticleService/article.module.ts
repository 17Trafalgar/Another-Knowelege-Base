import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { ArticleEntity } from 'src/models/article/article.entity';
import { UserEntity } from 'src/models/user/user.entity';
import { TagEntity } from 'src/models/tag/tag.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ArticleEntity, UserEntity, TagEntity]),
    ConfigModule,
  ],
  providers: [ArticleService],
  controllers: [ArticleController],
})
export class ArticleModule {}
