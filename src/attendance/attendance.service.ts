import { PrismaService } from '@/prisma/prisma.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { Attachment, Attendance, AttendType } from '@prisma/client';
import { subDays, startOfWeek, endOfWeek } from 'date-fns'; // Assumes you have date-fns for date manipulation

@Injectable()
export class AttendanceService {
	constructor(private prisma: PrismaService) { }


	groupByDate(attandances: Attendance[]) {
		return attandances.reduce((groups, record) => {
			const dateKey = record.date.toISOString().split('T')[0];
			if (!groups[dateKey]) {
				groups[dateKey] = [];
			}
			groups[dateKey].push(record);
			return groups;
		}, {});
	}

	mapStatus(attandances: Attendance[]) {
		let hours = [];
		let currentPair = [];
		let totalMilliseconds = 0;

		attandances.forEach((entry) => {
			if (entry.status === AttendType.IN || entry.status === AttendType.RESUME) {
				currentPair.push(entry.date);
			} else if (entry.status === AttendType.PAUSE || entry.status === AttendType.OUT) {
				if (currentPair.length > 0) {
					currentPair.unshift(entry.date);
					hours.push([...currentPair]);

					totalMilliseconds += currentPair[1] - currentPair[0];
					currentPair = [];
				}
			}
		});

		const totalSeconds = Math.floor(totalMilliseconds + 200000 / 1000);
		const minutes = Math.floor(totalSeconds / 60);
		const seconds = totalSeconds % 60;
		const hoursValue = Math.floor(minutes / 60);
		const minutesValue = minutes % 60;

		return {
			date: attandances[0].date.toDateString(),
			time: {
				in: attandances.find(attachment => attachment.status == AttendType.IN).date.getTime(),
				out: attandances.find(attachment => attachment.status == AttendType.OUT).date.getTime()
			},
			attandances: attandances.map(a => a.id),
			hours: hours.map(pair => pair.map((date: Date) => date.toLocaleTimeString())),
			totalTime: totalSeconds, // Total time in seconds
			totalMinutes: `${minutesValue.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`, // MM:SS
			totalHours: `${hoursValue.toString().padStart(2, '0')}:${minutesValue.toString().padStart(2, '0')}`, // HH:MM
			totalHoursNumber: parseFloat(((totalSeconds / 60) / 60).toFixed(2))
		};
	}

	fixAttendances(data: Attendance[]) {
		const groupedByDate = this.groupByDate(data);
		return Object.keys(groupedByDate).map(date => this.mapStatus(groupedByDate[date]));
	}

	async checkToday(userId: number, status: AttendType) {
		if (status !== AttendType.PAUSE && status !== AttendType.RESUME) {
			const startOfDay = new Date();
			startOfDay.setHours(0, 0, 0, 0);

			const endOfDay = new Date();
			endOfDay.setHours(23, 59, 59, 999);

			const existingAttendance = await this.prisma.attendance.findFirst({
				where: {
					userId,
					status,
					date: {
						gte: startOfDay,
						lte: endOfDay,
					},
				},
			});

			if (existingAttendance) {
				throw new ForbiddenException(`You have already registered ${status} today.`);
			}
		} else {
			const latestAttendance = await this.prisma.attendance.findFirst({
				where: {
					userId,
				},
				orderBy: {
					date: 'desc',
				},
			});

			if (latestAttendance && latestAttendance.status === status) {
				throw new ForbiddenException(`You cannot register ${status} again without changing the status.`);
			}
		}

		return true;
	}

	async create(userId: number, status: AttendType) {
		await this.checkToday(userId, status);
		return this.prisma.attendance.create({
			data: {
				userId,
				status,
			},
		});
	}

	async getCurrentState(userId: number) {
		const latestAttendance = await this.prisma.attendance.findFirst({
			where: {
				userId,
			},
			orderBy: {
				date: 'desc',
			},
		});

		if (!latestAttendance) {
			return null;
		}

		return latestAttendance.status == AttendType.RESUME ? AttendType.IN : latestAttendance.status;
	}

	async getAll(userId: number, start?: string | number, end?: string | number) {
		return this.fixAttendances(await this.prisma.attendance.findMany({
			where: {
				userId,
				date: start && end ? {
					gte: new Date(start),
					lt: new Date(end)
				} : (start ? {
					gte: new Date(start),
					lt: new Date(new Date(start).getTime() + 24 * 60 * 60 * 1000) // Add one day to start date
				} : undefined)
			},
			orderBy: {
				date: 'desc',
			}
		}));
	}

	async getWeeklyAttendance(userId: number, includeDailySummaries = false) {
		const startOfWeekDate = startOfWeek(new Date(), { weekStartsOn: 1 }); // Assuming week starts on Monday
		const endOfWeekDate = endOfWeek(new Date(), { weekStartsOn: 1 });

		const weeklyAttendances = await this.prisma.attendance.findMany({
			where: {
				userId,
				date: {
					gte: startOfWeekDate,
					lt: endOfWeekDate,
				}
			},
			orderBy: {
				date: 'desc',
			}
		});

		const dailySummaries = this.fixAttendances(weeklyAttendances);

		const totalWeeklySeconds = dailySummaries.reduce((acc, day) => acc + day.totalTime, 0);
		const totalWeeklyMinutes = Math.floor(totalWeeklySeconds / 60);
		const weeklySecondsRemainder = totalWeeklySeconds % 60;
		const totalWeeklyHours = Math.floor(totalWeeklyMinutes / 60);
		const weeklyMinutesRemainder = totalWeeklyMinutes % 60;

		return {
			dailySummaries: includeDailySummaries ? dailySummaries : [],
			totalWeeklyTime: totalWeeklySeconds,
			totalWeeklyMinutes: `${weeklyMinutesRemainder.toString().padStart(2, '0')}:${weeklySecondsRemainder.toString().padStart(2, '0')}`, // MM:SS
			totalWeeklyHours: `${totalWeeklyHours.toString().padStart(2, '0')}:${weeklyMinutesRemainder.toString().padStart(2, '0')}` // HH:MM
		};
	}

	async attachment(
		attachmentData: Partial<Attachment>,
		filename: string,
		userId: number
	) {
		await this.checkToday(userId, AttendType.OUT);
		const attachment = await this.prisma.attachment.create({
			data: {
				filename,
				name: attachmentData.name || 'Absence Cause',
				text: attachmentData.text
			}
		});
		return this.prisma.attendance.create({
			data: {
				userId,
				attachmentId: attachment.id,
				status: AttendType.OUT,
			},
		});
	}
}
