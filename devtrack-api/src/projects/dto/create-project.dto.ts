import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({
    example: 'DevTrack',
    description: 'Name of the project',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;
}
