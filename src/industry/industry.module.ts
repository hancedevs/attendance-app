import { Module } from '@nestjs/common';
import { IndustryService } from './industry.service';
import { IndustryController } from './industry.controller';

@Module({
  providers: [IndustryService],
  controllers: [IndustryController]
})
export class IndustryModule {}
