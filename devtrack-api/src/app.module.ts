import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProjectsModule } from './projects/projects.module';
import { PrismaModule } from './prisma/prisma.module';
import { TasksModule } from './tasks/tasks.module';
import { LearningSessionsModule } from './learning-sessions/learning-sessions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ProjectsModule,
    TasksModule,
    PrismaModule,
    LearningSessionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
