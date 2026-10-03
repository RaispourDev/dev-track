import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateTaskDto } from './dto/update-task-dto';

@Injectable()
export class TasksService {
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

  async create(projectId: number, createTaskDto: CreateTaskDto) {
    await this.ensureProjectExists(projectId);
    return this.prisma.task.create({
      data: {
        projectId,
        title: createTaskDto.title,
      },
    });
  }

  async findAll(projectId: number) {
    await this.ensureProjectExists(projectId);
    return this.prisma.task.findMany({
      where: { projectId },
    });
  }

  async findOne(projectId: number, taskId: number) {
    await this.ensureProjectExists(projectId);

    const task = await this.prisma.task.findFirst({
      where: { id: taskId, projectId },
    });
    if (!task) {
      throw new NotFoundException(
        'there is no task with this id in this project',
      );
    }
    return task;
  }

  async update(
    projectId: number,
    taskId: number,
    updateTaskDto: UpdateTaskDto,
  ) {
    await this.findOne(projectId, taskId);
    return this.prisma.task.update({
      where: {
        projectId,
        id: taskId,
      },
      data: {
        title: updateTaskDto.title,
        completed: updateTaskDto.completed,
      },
    });
  }

  async remove(projectId: number, taskId: number) {
    const task = await this.findOne(projectId, taskId);
    await this.prisma.task.delete({ where: { id: taskId } });
    return task;
  }
}
