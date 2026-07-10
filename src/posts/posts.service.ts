import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostsModel } from './entities/post.entity';
import { Repository, QueryRunner } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginatePostDto } from './dto/post-paginate.dto';
import { CommonService } from '../common/common.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsModel)
    private readonly postsRepo: Repository<PostsModel>,
    private readonly commonService: CommonService,
  ) {}

  async paginate(dto: PaginatePostDto) {
    return this.commonService.paginate(dto, this.postsRepo, {}, 'posts');
  }

  // async generatePosts(userId: number) {
  //   for (let i = 0; i < 100; i++) {
  //     await this.createPost(userId, {
  //       title: `임의로 생성된 포스트 제목 ${i}`,
  //       content: `임의로 생성된 포스트 내용 ${i}`,
  //     });
  //   }
  // }

  async findByOnePost(id: number, qr?: QueryRunner) {
    const repository = this.getRepository(qr);

    const post = await repository.findOne({
      where: {
        id,
      },
    });

    if (!post) {
      throw new NotFoundException('존재하지 않는 게시글 입니다.');
    }

    return post;
  }

  getRepository(qr?: QueryRunner) {
    return qr
      ? qr.manager.getRepository<PostsModel>(PostsModel)
      : this.postsRepo;
  }

  async createPost(authorId: number, dto: CreatePostDto, qr?: QueryRunner) {
    const repository = this.getRepository(qr);

    const post = repository.create({
      author: {
        id: authorId,
      },
      ...dto,
    });

    const newPost = await repository.save(post);

    return newPost;
  }

  async updatePost(postId: number, dto: UpdatePostDto, qr?: QueryRunner) {
    const post = await this.postsRepo.findOne({
      relations: {
        author: true,
      },
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new NotFoundException(
        '정책에의해 삭제되었거나 없는 게시글 입니다.',
      );
    }

    if (dto.title !== undefined) {
      post.title = dto.title;
    }

    if (dto.content !== undefined) {
      post.content = dto.content;
    }

    const newPost = await this.postsRepo.save(post);

    return newPost;
  }

  async removePost(id: number) {
    const post = await this.postsRepo.findOne({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('존재하지 않는 게시글 입니다.');
    }

    await this.postsRepo.delete(id);

    return post;
  }
}
