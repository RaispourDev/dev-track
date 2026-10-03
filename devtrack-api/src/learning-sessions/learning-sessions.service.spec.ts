import { Test, TestingModule } from '@nestjs/testing';
import { LearningSessionsService } from './learning-sessions.service';
import { PrismaService } from '../prisma/prisma.service';

describe('LearningSessionsService', () => {
  let service: LearningSessionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LearningSessionsService,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<LearningSessionsService>(LearningSessionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
