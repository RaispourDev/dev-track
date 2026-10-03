import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateLearningSessionDto } from './dto/create-learning-session';
import { LearningSessionsService } from './learning-sessions.service';
import { UpdateLearningSessionDto } from './dto/update-learning-session';

@Controller('projects/:projectId/learning-sessions')
export class LearningSessionsController {
  constructor(
    private readonly learningSessionsService: LearningSessionsService,
  ) {}

  @Post()
  create(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() createLearningSessionDto: CreateLearningSessionDto,
  ) {
    return this.learningSessionsService.create(
      projectId,
      createLearningSessionDto,
    );
  }

  @Get()
  findAll(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.learningSessionsService.findAll(projectId);
  }

  @Get(':learningSessionId')
  findOne(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('learningSessionId', ParseIntPipe) learningSessionId: number,
  ) {
    return this.learningSessionsService.findOne(projectId, learningSessionId);
  }

  @Patch(':learningSessionId')
  update(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('learningSessionId', ParseIntPipe) learningSessionId: number,
    @Body() updateLearningSessionDto: UpdateLearningSessionDto,
  ) {
    return this.learningSessionsService.update(
      projectId,
      learningSessionId,
      updateLearningSessionDto,
    );
  }

  @Delete(':learningSessionId') remove(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('learningSessionId', ParseIntPipe) learningSessionId: number,
  ) {
    return this.learningSessionsService.remove(projectId, learningSessionId);
  }
}
