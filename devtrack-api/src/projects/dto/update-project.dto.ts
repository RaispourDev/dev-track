import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';

import { CreateProjectDto } from './create-project.dto';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  @ApiPropertyOptional({
    example: 'COMPLETED',
    description: 'Project status',
    enum: ['ACTIVE', 'COMPLETED'],
  })
  @IsOptional()
  @IsIn(['ACTIVE', 'COMPLETED'])
  status?: 'ACTIVE' | 'COMPLETED';
}
