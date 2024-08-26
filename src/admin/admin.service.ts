import { AttendanceService } from '@/attendance/attendance.service';
import { FeedbackService } from '@/feedback/feedback.service';
import { PrismaService } from '@/prisma/prisma.service';
import { RequestsService } from '@/requests/requests.service';
import { CreateScheduleDto } from '@/schedule/dto/create-schedule.dto';
import { ScheduleService } from '@/schedule/schedule.service';
import { UsersService } from '@/users/users.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Attendance, AttendType, Feedback, FeedbackStatus, Industry, StaffRequestStatus } from '@prisma/client';
import { CreateIPDto } from './dto/create-ip.dto';

@Injectable()
export class AdminService {
	constructor(
		private prisma: PrismaService,
		private attendance: AttendanceService,
		private users: UsersService,
		private requests: RequestsService,
		private schedules: ScheduleService,
		private feedbacks: FeedbackService,
	) { }

	async getAttachment(id: number){
		return await this.attendance.getAttachment(id);
	}

	async getAttendance(username: string, startDate?: string, endDate?: string) {
		const user = await this.users.findOneByUsername(username);
		if (!user) {
			throw new NotFoundException('User not found');
		}
		return await this.attendance.getAll(user.id, startDate, endDate);
	}

	async getAllRequests({
		status,
		username
	}: {
		status?: StaffRequestStatus,
		username?: string
	}) {
		let userId: number | undefined = undefined;

		if (username) {
			const user = await this.users.findOneByUsername(username);

			if (!user) throw new NotFoundException('User not found');

			userId = user.id;
		}

		if (status) {
			return userId
				? await this.requests.getAllFrom(userId, status)
				: await this.requests.getAllByStatus(status);
		}

		return userId
			? await this.requests.getAllFrom(userId)
			: await this.requests.getAll();
	}

	async getRequestById(id: number) {
		return await this.requests.getOne(id);
	}

	async changeRequestStatus(id: number, status: StaffRequestStatus) {
		return await this.requests.setStatus(id, status);
	}

	async createSchedule(userId: number, schedule: CreateScheduleDto[]){
		return await this.schedules.createSchedule(userId, schedule);
	}

	async fetchFeedbackAnalytics(searchParams: {
		userId: number,
		industryId: number,
		companyId: number,
		startDate?: string,
		endDate?: string,
		includeFeedbacks?: boolean
	}){
		const feedbacks = await this.feedbacks.searchFeedback(searchParams);
    const totalFeedbacks = feedbacks.length;

    const industryFeedbacks = feedbacks.reduce((acc, feedback) => {
      const industryId = feedback.company?.industryId;
      if (industryId) {
        if (!acc[industryId]) {
          acc[industryId] = {
            industry: feedback.company.industry,
            status: Object.fromEntries(Object.entries(FeedbackStatus).map((i) => [i[0], 0])),
            feedbacks: [],
          };
        }
        acc[industryId].status[feedback.status]++;
        if (searchParams.includeFeedbacks) {
          acc[industryId].feedbacks.push(feedback);
        }
      }
      return acc;
    }, {} as Record<number, { industry: Industry, status: Record<string, number>, feedbacks: Feedback[] }>);

    const industryAnalytics = Object.values(industryFeedbacks);

    return {
      totalFeedbacks,
      industryAnalytics,
    };
	}

	async getAllIPAddress(){
		return await this.prisma.iPAddress.findMany();
	}

	async addIPAddress(address: CreateIPDto){
		return await this.prisma.iPAddress.create({
			data: address
		});
	}

	async rmIPAddress(id: number){
		return await this.prisma.iPAddress.delete({
			where: { id }
		});
	}

}
