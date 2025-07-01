import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from 'src/models/article/article.entity';
import { UserEntity } from 'src/models/user/user.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateArticleDto } from './dto/create.dto';
import { UpdateArticleDto } from './dto/update.dto';
import { SuccessResponse } from './response/succes.response';
import {
  ArticleResponseSchema,
  transformToArticleSchema,
} from './response/article.response.schema';
import { TagEntity } from 'src/models/tag/tag.entity';
import { TagFilterDto } from './response/tags.filter.response';
import {
  TagResponseSchema,
  transformToTagSchema,
} from './response/tag.response.schema';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    user: UserEntity,
    dto: CreateArticleDto,
  ): Promise<ArticleResponseSchema> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const tags: TagEntity[] = [];

      if (dto.tags && dto.tags.length) {
        await Promise.all(
          dto.tags.map(async (tag) => {
            const newTag = await this.tagRepository.save({
              title: tag,
            });

            tags.push(newTag);
          }),
        );
      }

      const newArticle = await this.articleRepository.save({
        title: dto.title,
        text: dto.text,
        tags,
        user_id: user.id,
        isPublic: dto.isPublic,
      });

      await queryRunner.commitTransaction();

      const article = await this.articleRepository.findOne({
        where: { id: newArticle.id },
        relations: { tags: true, user: true },
      });

      if (!article) {
        throw new NotFoundException('Не удалось найти статью');
      }

      return transformToArticleSchema(article);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
      throw new BadRequestException('Не удалось создать статью', error);
    } finally {
      await queryRunner.release();
    }
  }

  async update(
    id: number,
    dto: UpdateArticleDto,
  ): Promise<ArticleResponseSchema> {
    const article = await this.articleRepository.findOne({
      where: { id },
    });

    if (!article) {
      throw new NotFoundException('Не удалось найти статью');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const tags: TagEntity[] = [];

      await Promise.all(
        dto.tags.map(async (tag) => {
          const oldTag = await this.tagRepository.findOne({
            where: { title: tag },
          });

          if (!oldTag) {
            const newTag = await this.tagRepository.save({
              title: tag,
            });

            tags.push(newTag);
          }
        }),
      );

      await this.articleRepository.update(id, {
        tags: tags,
      });

      await queryRunner.commitTransaction();

      const updatedArticle = await this.articleRepository.findOne({
        where: { id },
        relations: { tags: true, user: true },
      });

      return transformToArticleSchema(updatedArticle!);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
      throw new BadRequestException('Не удалось обновить статью', error);
    } finally {
      await queryRunner.release();
    }
  }

  async delete(id: number): Promise<SuccessResponse> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const article = await this.articleRepository.findOne({
      where: { id },
    });

    if (!article) {
      throw new NotFoundException('Не удалось найти статью');
    }

    try {
      await this.articleRepository.delete(id);

      return { success: true };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
      throw new BadRequestException('Не удалось удалить статью', error);
    } finally {
      await queryRunner.release();
    }
  }

  async getById(id: number, user?: UserEntity): Promise<ArticleResponseSchema> {
    let article: ArticleEntity | null = null;

    if (user) {
      article = await this.articleRepository.findOne({
        where: { id },
        relations: { tags: true, user: true },
      });
    } else {
      article = await this.articleRepository.findOne({
        where: { id, isPublic: true },
        relations: { tags: true, user: true },
      });
    }

    if (!article) {
      throw new NotFoundException('Не удалось найти статью');
    }

    return transformToArticleSchema(article);
  }

  async getAll(
    query: TagFilterDto,
    user?: UserEntity,
  ): Promise<ArticleResponseSchema[]> {
    const tagIds = Array.isArray(query.tags)
      ? query.tags.map(Number)
      : query.tags
        ? [Number(query.tags)]
        : [];

    const qb = this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.user', 'user')
      .leftJoinAndSelect('article.tags', 'tag');

    if (tagIds.length > 0) {
      qb.andWhere('tag.id IN (:...tag_ids)', { tag_ids: tagIds });
    }

    if (!user) {
      qb.andWhere(`article.isPublic = :isPublic`, { isPublic: true });
    }

    const articles = await qb.getMany();

    return articles.map(transformToArticleSchema);
  }

  async getTags(): Promise<TagResponseSchema[]> {
    const tags = await this.tagRepository.find();

    return tags.map((tag) => transformToTagSchema(tag));
  }

  async getTagById(id: number): Promise<TagResponseSchema> {
    const tag = await this.tagRepository.findOne({ where: { id } });

    if (!tag) {
      throw new NotFoundException('Не удалось найти тэг');
    }

    return transformToTagSchema(tag);
  }
}
