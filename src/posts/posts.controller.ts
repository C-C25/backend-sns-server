import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import type { QueryRunner as QR } from 'typeorm';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAccessGuard } from '../auth/guard/jwt-access.auth.guard';
import { User } from '../users/decorator/user.decorator';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginatePostDto } from './dto/post-paginate.dto';
import { TransactionInterceptor } from '../common/interceptor/transaction.interceptor';
import { QueryRunner } from '../common/decorator/query-runner.decorator';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getPosts(@Query() query: PaginatePostDto) {
    return this.postsService.paginate(query);
  }

  @Get(':id')
  getPost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findByOnePost(id);
  }

  @Post()
  @UseInterceptors(TransactionInterceptor)
  @UseGuards(JwtAccessGuard)
  async postPosts(
    @User('sub') authorId: number,
    @Body() dto: CreatePostDto,
    @QueryRunner() qr: QR,
  ) {
    const post = await this.postsService.createPost(authorId, dto, qr);
    return this.postsService.findByOnePost(post.id, qr);
  }

  // @Post('random')
  // @UseGuards(JwtAccessGuard)
  // async postPostsRandom(@User('sub') userId: number) {
  //   await this.postsService.generatePosts(userId);

  //   return true;
  // }

  @Patch(':id')
  @UseGuards(JwtAccessGuard)
  patchPost(
    @Param('id', ParseIntPipe) postId: number,
    @User('sub') authorId: number,
    @Body() dto: UpdatePostDto,
  ) {
    return this.postsService.updatePost(postId, dto);
  }

  // TODO 예비군 다녀와서 보완 예정
  @Delete(':id')
  @UseGuards(JwtAccessGuard)
  deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.removePost(id);
  }
}
