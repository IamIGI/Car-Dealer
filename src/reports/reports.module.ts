import { Module } from '@nestjs/common';
import { UsersController } from './users/users.controller';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';

@Module({
  controllers: [UsersController, ReportsController],
  providers: [ReportsService]
})
export class ReportsModule {}
