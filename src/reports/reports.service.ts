import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './report.entity';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from 'src/users/user.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  async creteEstimate({ make, model, lng, lat, year, mileage }: GetEstimateDto) {
    let response = (await this.repo
      .createQueryBuilder()
      // .select('*')
      .select('AVG(price)', 'price')
      .where('LOWER(make)= LOWER(:make)')
      .andWhere('LOWER(model)= LOWER(:model)')
      .andWhere('lng - :lng BETWEEN -3 AND 3')
      .andWhere('lat - :lat BETWEEN -3 AND 3')
      .andWhere('year - :year BETWEEN -3 AND 3')
      .andWhere('approved IS TRUE')
      .orderBy('ABS(mileage - :mileage)', 'DESC')
      .setParameters({ make, model, lng, lat, year, mileage })
      .limit(3)
      // .getRawMany()
      .getRawOne()) as { price: number };
    if (response.price === null) return null;
    return Number(response.price.toFixed(2));
  }

  create(reportDto: CreateReportDto, user: User) {
    let report = this.repo.create(reportDto);
    report.user = user;

    return this.repo.save(report);
  }

  async changeApproval(id: string, approved: boolean) {
    const report = await this.repo.findOne({ where: { id: Number(id) } });

    if (!report) throw new NotFoundException('report not found');

    report.approved = approved;

    return this.repo.save(report);
  }

  findAll() {
    return this.repo.createQueryBuilder().select('*').getRawMany();
  }
}
