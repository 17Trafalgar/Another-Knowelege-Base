import { ArticleEntity } from 'src/models/article/article.entity';
import { TagResponseSchema, transformToTagSchema } from './tag.response.schema';
import {
  transformToUserSchema,
  UserResponseSchema,
} from './user.response.schema';

export class ArticleResponseSchema {
  id: number;
  createdAt: Date;
  title: string;
  text: string;
  tags: TagResponseSchema[] | undefined;
  isPublic: boolean;
  user: UserResponseSchema;
}

export function transformToArticleSchema(
  article: ArticleEntity,
): ArticleResponseSchema {
  const { id, title, text, createdAt, tags, isPublic, user } = article;

  const schema: ArticleResponseSchema = {
    id,
    title,
    createdAt,
    text,
    tags:
      tags && tags.length
        ? tags.map((tag) => transformToTagSchema(tag))
        : undefined,
    user: transformToUserSchema(user),
    isPublic,
  };

  return schema;
}
