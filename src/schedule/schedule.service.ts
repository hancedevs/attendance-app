import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';

@Injectable()
export class ScheduleService {

	constructor(private prisma: PrismaService) {}

	async createSchedule(userId: number, schedule: CreateScheduleDto[]){
		return await Promise.all(
			schedule.map(async (schedule) => {
				await this.prisma.schedule.deleteMany({
					where: { userId, day: schedule.day }
				});
				return await this.prisma.schedule.create({
					data: {
						userId,
						startTime: schedule.startTime,
						endTime: schedule.endTime,
						day: schedule.day,
						uniform: schedule.uniform || false
					}
				});
			})
		)
	}

	async getSchedule(userId: number){
		return (await this.prisma.schedule.findMany({ where: { userId } })).map((item) => ({
			day: item.day,
			startTime: item.startTime,
			endTime: item.endTime,
			uniform: item.uniform
		} as CreateScheduleDto));
	}

}
