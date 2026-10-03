import { PartialType } from '@nestjs/swagger';
import { CreateLearningSessionDto } from './create-learning-session';

export class UpdateLearningSessionDto extends PartialType(
  CreateLearningSessionDto,
) {}
