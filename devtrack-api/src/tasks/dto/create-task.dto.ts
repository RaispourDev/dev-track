import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({
    example: 'DevTrack',
    description: 'Name of the project',
  })
  @IsString()
  @IsNotEmpty()
  title!: string;
}
