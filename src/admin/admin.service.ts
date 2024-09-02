import { AttendanceService } from '@/attendance/attendance.service';
import { FeedbackService } from '@/feedback/feedback.service';
import { PrismaService } from '@/prisma/prisma.service';
import { RequestsService } from '@/requests/requests.service';
import { CreateScheduleDto } from '@/schedule/dto/create-schedule.dto';
import { ScheduleService } from '@/schedule/schedule.service';
import { UsersService } from '@/users/users.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Attachment, Attendance, AttendType, Feedback, FeedbackStatus, Industry, StaffRequestStatus } from '@prisma/client';
import { CreateIPDto, EditIPDto } from './dto/create-ip.dto';
import { ChatsService } from '@/chats/chats.service';

@Injectable()
export class AdminService {
	constructor(
		private prisma: PrismaService,
		private attendance: AttendanceService,
		private users: UsersService,
		private requests: RequestsService,
		private schedules: ScheduleService,
		private feedbacks: FeedbackService,
		private chats: ChatsService,
	) { }

	/**
	 * A method to get only the attachment
	 * @param {number} id Attachment ID
	 * @returns {Promise<Attachment>} An attachment
	 */
	async getAttachment(id: number): Promise<Attachment> {
		return await this.attendance.getAttachment(id);
	}

	/**
	 * Fetch all attendances of a user
	 * 
	 * @param {string} username Username of the user
	 * @param {string?} startDate All attendances from this date
	 * @param {string?} endDate All attendances to this date
	 */
	async getAttendance(username: string, startDate?: string, endDate?: string) {
		const user = await this.users.findOneByUsername(username);
		if (!user) {
			throw new NotFoundException('User not found');
		}
		return await this.attendance.getAll(user.id, startDate, endDate);
	}

	/**
	 * Fetch all requests as an admin
	 * 
	 * @param {{ status?: StaffRequestStatus, username?: string }} options Optional parameters to filter Requests 
	 * @returns 
	 */
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

	/**
	 * Fetch a singular request.
	 * 
	 * @param id The request ID
	 * @returns 
	 */
	async getRequestById(id: number) {
		return await this.requests.getOne(id);
	}

	async changeRequestStatus(id: number, status: StaffRequestStatus) {
		return await this.requests.setStatus(id, status);
	}

	async createSchedule(userId: number, schedule: CreateScheduleDto[]){
		return await this.schedules.createSchedule(userId, schedule);
	}

	/**
	 * Fetch all feedbacks analytics
	 * @param searchParams Search parameters
	 * @returns 
	 */
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

		const total = Object.values(industryFeedbacks).reduce((acc, industry) => {
			Object.entries(industry.status).forEach(([status, count]) => {
				if (!acc[status]) {
					acc[status] = 0;
				}
				acc[status] += count;
			});
			return acc;
		}, {} as Record<string, number>);

    return {
      totalFeedbacks,
      industryAnalytics,
			total,
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

	async updateIPAddress(id: number, address: EditIPDto){
		return await this.prisma.iPAddress.update({
			where: { id },
			data: address
		});
	}

	async rmIPAddress(id: number){
		return await this.prisma.iPAddress.delete({
			where: { id }
		});
	}

	async deleteUser(id: number){
		const chatConversations = await this.chats.getAllConversationsFor(id, false);
		for(let conv of chatConversations){
			await this.chats.deletePrivateConversation(conv.id);
		}
		await this.attendance.deleteFor(id);
		await this.requests.deleteFor(id);
		// Move the user of feedbacks
		await this.feedbacks.deleteFor(id);
		// Delete User
		await this.users.delete(id);
		return { success: true };
	}

}
