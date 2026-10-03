import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}
  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @Post()
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.remove(id);
  }

  // toatl summary endpoint
  @Get(':projectId/summary')
  summary(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.projectsService.getSummary(projectId);
  }

  // weekly summary endpoint
  @Get(':projectId/weekly-summary')
  weeklySummary(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.projectsService.getWeeklySummary(projectId);
  }

  // getting detail of a project
  @Get(':projectId/details')
  getDetails(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.projectsService.getDetails(projectId);
  }
}
