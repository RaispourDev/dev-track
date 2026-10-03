import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.project.findMany();
  }

  create(createProjectDto: CreateProjectDto) {
    return this.prisma.project.create({
      data: { name: createProjectDto.name },
    });
  }

  async findOne(id: number) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) {
      throw new NotFoundException('there is no project with this id');
    }
    return project;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    await this.findOne(id);

    return this.prisma.project.update({
      where: {
        id,
      },
      data: {
        name: updateProjectDto.name,
        status: updateProjectDto.status,
      },
    });
  }

  async remove(id: number) {
    const project = await this.findOne(id);
    await this.prisma.project.delete({ where: { id } });
    return project;
  }

  // toatl summary endpoints
  async getSummary(projectId: number) {
    await this.findOne(projectId);
    const tasksCounts = await this.prisma.task.count({
      where: { projectId },
    });
    const completedTasksCounts = await this.prisma.task.count({
      where: { projectId, completed: true },
    });
    const learningMinutes = await this.prisma.learningSession.aggregate({
      where: { projectId },
      _sum: {
        durationMinutes: true,
      },
    });
    return {
      projectId,
      TotalTasks: tasksCounts,
      completedTasks: completedTasksCounts,
      pendingTasks: tasksCounts - completedTasksCounts,
      totalLearningMinutes: learningMinutes._sum.durationMinutes ?? 0,
    };
  }

  // weekly summary endpoint
  async getWeeklySummary(projectId: number) {
    await this.findOne(projectId);

    const now = new Date();
    const day = now.getDay();
    const daysSinceSaturday = (day + 1) % 7;
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - daysSinceSaturday);
    startOfWeek.setHours(0, 0, 0, 0);

    const weeklySessions = await this.prisma.learningSession.aggregate({
      where: {
        projectId,
        createdAt: {
          gte: startOfWeek,
        },
      },
      _count: {
        _all: true,
      },
      _sum: {
        durationMinutes: true,
      },
    });

    return {
      projectId,
      sessionsCount: weeklySessions._count._all,
      totalLearningMinutes: weeklySessions._sum.durationMinutes ?? 0,
    };
  }

  // get project details
  async getDetails(projectId: number) {
    const project = await this.prisma.project.findUnique({
      where: {
        id: projectId,
      },
      include: {
        tasks: true,
        learningSessions: true,
      },
    });
    if (!project) {
      throw new NotFoundException('there is no project with this id');
    }
    return project;
  }
}
