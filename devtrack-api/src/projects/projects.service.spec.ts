import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('ProjectsService', () => {
  const prismaMock = {
    project: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  };
  let service: ProjectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all projects', async () => {
    const projects = [
      {
        id: 1,
        name: 'Learn NestJS',
        createdAt: new Date(),
      },
    ];
    prismaMock.project.findMany.mockResolvedValue(projects);
    const result = await service.findAll();
    expect(result).toEqual(projects);
    expect(prismaMock.project.findMany).toHaveBeenCalledTimes(1);
  });

  it('should return all projects', async () => {
    const project = {
      id: 1,
      name: 'Learn NestJS',
      createdAt: new Date(),
    };
    prismaMock.project.findUnique.mockResolvedValue(project);
    const result = await service.findOne(1);
    expect(result).toEqual(project);
    expect(result.id).toBe(1);
  });

  it('should throw NotFoundException when project does not exist', async () => {
    prismaMock.project.findUnique.mockResolvedValue(null);
    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });
});
