import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './reports.entity';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from 'src/users/users.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private readonly repo: Repository<Report>,
  ) {}

  create(reportDto: CreateReportDto, user: User) {
    const report = this.repo.create(reportDto);
    report.user = user;
    return this.repo.save(report);
  }
  async changeApproval(id: number, approved: boolean) {
    const report = await this.repo.findOne(id);
    if (!report) {
      throw new NotFoundException('Report not found');
    }
    report.approved = approved;
    return this.repo.save(report);
  }

  async createEstimate({
    make,
    model,
    lat,
    lng,
    year,
    mileage,
  }: GetEstimateDto) {
    return this.repo
      .createQueryBuilder()
      .select('AVG(price)', 'price ')
      .where('make=:make', { make: make })
      .andWhere('model=:model', { model: model })
      .andWhere('lat-:lat BETWEEN -5 AND 5', { lat: lat })
      .andWhere('lng-:lng BETWEEN -5 AND 5', { lng: lng })
      .andWhere('year-:year BETWEEN -3 AND 3', { year: year })
      .andWhere('approved=:approved', { approved: true })
      .orderBy('mileage-:mileage', 'DESC')
      .setParameters({ mileage })
      .limit(3)
      .getRawOne();
  }
}
