import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post('adopt/:userId/:postId')
  async createAdoptReport(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('postId', ParseUUIDPipe) postId: string,
    @Body() createReportDto: CreateReportDto,
  ) {
    return this.reportsService.createAdoptReport(userId, postId, createReportDto);
  }

  @Post('lost/:userId/:postId')
  async createLostReport(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('postId', ParseUUIDPipe) postId: string,
    @Body() createReportDto: CreateReportDto,
  ) {
    return this.reportsService.createLostReport(userId, postId, createReportDto);
  }

  @Post('informative/:userId/:postId')
  async createInformativeReport(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('postId', ParseUUIDPipe) postId: string,
    @Body() createReportDto: CreateReportDto,
  ) {
    return this.reportsService.createInformativeReport(userId, postId, createReportDto);
  }
}

