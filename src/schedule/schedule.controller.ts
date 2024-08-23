import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ScheduleEntity } from './entities/schedule.entity';
import { Day, User } from '@prisma/client';

@ApiTags('schedule')
@Controller('schedule')
@UseGuards(JwtAuthGuard)
export class ScheduleController {
	constructor(private service: ScheduleService) {}

	@Get()
	@ApiOperation({ summary: 'Get all schedules for the current user' })
	@ApiOkResponse({ type: [ScheduleEntity] })
	async getSchedules(
		@Req() req: { user: User }
	){
		const daysOfWeek = Object.keys(Day);
		return (await this.service.getSchedule(req.user.id)).sort((a, b) => {
			return daysOfWeek.indexOf(a.day) - daysOfWeek.indexOf(b.day);
		});
	}
}
