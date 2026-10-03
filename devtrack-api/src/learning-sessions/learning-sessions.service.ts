import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLearningSessionDto } from './dto/create-learning-session';
import { UpdateLearningSessionDto } from './dto/update-learning-session';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LearningSessionsService {
  constructor(private readonly prisma: PrismaService) {}

  //helper
  private async ensureProjectExists(projectId: number) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) {
      throw new NotFoundException('there is no project with this id');
    }
  }

  async create(
    projectId: number,
    createLearningSessionDto: CreateLearningSessionDto,
  ) {
    await this.ensureProjectExists(projectId);

    return this.prisma.learningSession.create({
      data: {
        projectId,
        durationMinutes: createLearningSessionDto.durationMinutes,
        note: createLearningSessionDto.note,
      },
    });
  }

  async findAll(projectId: number) {
    await this.ensureProjectExists(projectId);

    return this.prisma.learningSession.findMany({
      where: { projectId },
    });
  }

  async findOne(projectId: number, learningSessionId: number) {
    await this.ensureProjectExists(projectId);

    const learningSession = await this.prisma.learningSession.findFirst({
      where: {
        id: learningSessionId,
        projectId,
      },
    });

    if (!learningSession) {
      throw new NotFoundException(
        'there is no learning session with this id in this project',
      );
    }

    return learningSession;
  }

  async update(
    projectId: number,
    learningSessionId: number,
    updateLearningSessionDto: UpdateLearningSessionDto,
  ) {
    await this.findOne(projectId, learningSessionId);

    return this.prisma.learningSession.update({
      where: {
        id: learningSessionId,
      },
      data: {
        durationMinutes: updateLearningSessionDto.durationMinutes,
        note: updateLearningSessionDto.note,
      },
    });
  }
  async remove(projectId: number, learningSessionId: number) {
    const learningSession = await this.findOne(projectId, learningSessionId);

    await this.prisma.learningSession.delete({
      where: {
        id: learningSessionId,
      },
    });

    return learningSession;
  }
}
