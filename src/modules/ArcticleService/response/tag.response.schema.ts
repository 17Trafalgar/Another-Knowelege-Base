import { TagEntity } from 'src/models/tag/tag.entity';

export class TagResponseSchema {
  id: number;
  title: string;
}

export function transformToTagSchema(tag: TagEntity): TagResponseSchema {
  const { id, title } = tag;

  const schema: TagResponseSchema = {
    id,
    title,
  };

  return schema;
}
