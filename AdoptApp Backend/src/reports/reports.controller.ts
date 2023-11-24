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

  @Get('byPost/:postId')
  async getReportsByPostId(@Param('postId', ParseUUIDPipe) postId: string) {
    return this.reportsService.getReportsByPostId(postId);
  }

  @Get(':id')
  async getReportById(@Param('id', ParseUUIDPipe) id: string) {
    return this.reportsService.getReportById(id);
  }

  @Delete(':id')
  async deleteReport(@Param('id') id: string) {
    return await this.reportsService.deleteReport(id);
  }

  @Get()
  getAllReports() {
    return this.reportsService.findAllReports();
  }
}

