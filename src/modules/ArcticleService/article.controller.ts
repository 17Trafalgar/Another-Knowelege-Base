import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create.dto';
import { UserEntity } from 'src/models/user/user.entity';
import { JwtAuthGuard } from '../Auth/guard/auth.guard';
import { UpdateArticleDto } from './dto/update.dto';
import { SuccessResponse } from './response/succes.response';
import { ArticleResponseSchema } from './response/article.response.schema';
import { TagFilterDto } from './response/tags.filter.response';
import { TagResponseSchema } from './response/tag.response.schema';
import { JwtAuthOptionalGuard } from '../Auth/guard/auth.optional.guard';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() body: CreateArticleDto,
    @Req() req: Request & { user: UserEntity },
  ): Promise<ArticleResponseSchema> {
    return this.articleService.create(req.user, body);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: number,
    @Body() body: UpdateArticleDto,
  ): Promise<ArticleResponseSchema> {
    return this.articleService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: number): Promise<SuccessResponse> {
    return this.articleService.delete(id);
  }

  @Get('tags')
  async getAllTags(): Promise<TagResponseSchema[]> {
    return this.articleService.getTags();
  }

  @Get('tag/:id')
  async getTagById(@Param('id') id: number): Promise<TagResponseSchema> {
    return this.articleService.getTagById(id);
  }

  @Get()
  @UseGuards(JwtAuthOptionalGuard)
  async getAll(
    @Req() req: Request & { user: UserEntity },
    @Query() query: TagFilterDto,
  ): Promise<ArticleResponseSchema[]> {
    return this.articleService.getAll(query, req.user);
  }

  @Get(':id')
  @UseGuards(JwtAuthOptionalGuard)
  async getById(
    @Req() req: Request & { user: UserEntity },
    @Param('id') id: number,
  ): Promise<ArticleResponseSchema> {
    return this.articleService.getById(id, req.user);
  }
}
