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
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAccessGuard } from '../auth/guard/jwt-access.auth.guard';
import { User } from '../users/decorator/user.decorator';
import { UpdatePostDto } from './dto/update-post.dto';
import { UsersModel } from '../users/entities/user.entity';
import { PaginatePostDto } from './dto/post-paginate.dto';

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

  // TODO 예비군 다녀와서 트랜잭션 적용
  @Post()
  @UseGuards(JwtAccessGuard)
  postPosts(@User('sub') authorId: number, @Body() dto: CreatePostDto) {
    return this.postsService.createPost(authorId, dto);
  }

  // POST /posts/random
  @Post('random')
  @UseGuards(JwtAccessGuard)
  async postPostsRandom(@User('sub') userId: number) {
    await this.postsService.generatePosts(userId);

    return true;
  }

  // TODO 예비군 다녀와서 트랜잭션 적용
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
