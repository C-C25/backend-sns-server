import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { CommonController } from './common.controller';

@Module({
  imports: [],
  exports: [CommonService],
  controllers: [CommonController],
  providers: [CommonService],
})
export class CommonModule {}
