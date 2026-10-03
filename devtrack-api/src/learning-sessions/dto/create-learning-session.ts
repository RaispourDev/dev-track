import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateLearningSessionDto {
  @ApiProperty({
    example: 90,
    description: 'Duration of the learning session in minutes',
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  durationMinutes!: number;

  @ApiPropertyOptional({
    example: 'Worked on NestJS and Prisma',
    description: 'Optional note about the learning session',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  note?: string;
}
