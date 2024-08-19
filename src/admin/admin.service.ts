import { AttendanceService } from '@/attendance/attendance.service';
import { PrismaService } from '@/prisma/prisma.service';
import { RequestsService } from '@/requests/requests.service';
import { UsersService } from '@/users/users.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Attendance, AttendType, StaffRequestStatus } from '@prisma/client';

@Injectable()
export class AdminService {
	constructor(
		private prisma: PrismaService,
		private attendance: AttendanceService,
		private users: UsersService,
		private requests: RequestsService,
	) { }


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
}
