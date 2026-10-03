import { Test, TestingModule } from '@nestjs/testing';
import { LearningSessionsController } from './learning-sessions.controller';
import { LearningSessionsService } from './learning-sessions.service';

describe('LearningSessionsController', () => {
  let controller: LearningSessionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LearningSessionsController],
      providers: [
        {
          provide: LearningSessionsService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<LearningSessionsController>(
      LearningSessionsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
