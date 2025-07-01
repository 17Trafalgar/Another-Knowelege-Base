import { IsOptional, IsString } from 'class-validator';

export class TagFilterDto {
  @IsOptional()
  @IsString({ each: true })
  tags?: string | string[];
}
