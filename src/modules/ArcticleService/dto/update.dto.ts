import { IsArray, IsString } from 'class-validator';

export class UpdateArticleDto {
  @IsArray()
  @IsString({ each: true })
  tags: string[];
}
