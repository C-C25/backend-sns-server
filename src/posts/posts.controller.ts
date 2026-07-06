import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAccessGuard } from '../auth/guard/jwt-access.auth.guard';
import { User } from '../users/decorator/user.decorator';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getPosts() {
    return this.postsService.findAllPost();
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
