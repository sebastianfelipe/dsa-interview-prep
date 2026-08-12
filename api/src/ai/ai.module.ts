import { Module } from '@nestjs/common';
import { ProblemsModule } from '../problems/problems.module';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';

@Module({
  imports: [ProblemsModule],
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}
