import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { LearningSessionsController } from './learning-sessions.controller';
import { LearningSessionsService } from './learning-sessions.service';

@Module({
  imports: [PrismaModule],
  controllers: [LearningSessionsController],
  providers: [LearningSessionsService],
})
export class LearningSessionsModule {}
