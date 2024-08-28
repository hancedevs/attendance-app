import { EventsGateway } from '@/events/events.gateway';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateScheduleDto } from '@/schedule/dto/create-schedule.dto';
import { ScheduleService } from '@/schedule/schedule.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { Attachment, Attendance, AttendType, Day } from '@prisma/client';
import { subDays, startOfWeek, endOfWeek, startOfMonth, addDays, endOfMonth } from 'date-fns'; // Assumes you have date-fns for date manipulation

@Injectable()
export class AttendanceService {
	constructor(
		private prisma: PrismaService,
		private scheduleService: ScheduleService
	) { }

	async checkIpAddress(ip: string){
		return await this.prisma.iPAddress.findFirst({
			where: { address: ip, enabled: true }
		}) ? true : await this.prisma.iPAddress.count({
			where: { enabled: true }
		}) < 1;
	}

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

	mapStatus(attendances: Attendance[]) {
		let hours = [];
		let currentPair = [];
		let totalMilliseconds = 0;

		const userId = attendances[0]?.userId;
		const date = attendances[0]?.date.toDateString();

		attendances.forEach((entry) => {
			if (entry.status === AttendType.IN || entry.status === AttendType.RESUME) {
				if (currentPair.length > 0) {
					currentPair.unshift(entry.date);
					hours.push([...currentPair]);

					totalMilliseconds += currentPair[1] - currentPair[0];
					currentPair = [];
				}
			} else if (entry.status === AttendType.PAUSE || entry.status === AttendType.OUT) {
				currentPair.push(entry.date);
			}
		});

		const checkedIn = attendances.find(attachment => attachment.status == AttendType.IN);
		const checkedOut = attendances.find(attachment => attachment.status == AttendType.OUT);

		const totalSeconds = Math.floor(totalMilliseconds / 1000);
		const minutes = Math.floor(totalSeconds / 60);
		const seconds = totalSeconds % 60;
		const hoursValue = Math.floor(minutes / 60);
		const minutesValue = minutes % 60;

		const wasAbsent = checkedOut && !checkedIn;

		return wasAbsent ? {
			date,
			wasAbsent,
			absenceAttachment: checkedOut.attachmentId
		} : {
			date,
			time: wasAbsent ? {} : {
				in: checkedIn?.date.getTime(),
				out: checkedOut?.date.getTime()
			},
			attandances: attendances.map(a => a.id),
			hours: hours.map(pair => pair.map((date: Date) => date.toLocaleTimeString())),
			totalTime: totalSeconds, // Total time in seconds
			totalMinutes: `${minutesValue.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`, // MM:SS
			totalHours: `${hoursValue.toString().padStart(2, '0')}:${minutesValue.toString().padStart(2, '0')}`, // HH:MM
			totalHoursNumber: parseFloat(((totalSeconds / 60) / 60).toFixed(2)),
			wasAbsent
		};
	}

	fixAttendances(data: Attendance[], schedules: CreateScheduleDto[]) {
		if(!data[0]) return [];
		const userId = data[0].userId;
		const scheduleAttendances: Attendance[] = [];
		const checkedWeeks: Set<string> = new Set();

		const today = new Date().toLocaleDateString();

		const formatDate = (date: Date): string => date.toISOString().split('T')[0];

		const getDateForDay = (weekStart: Date, dayOffset: number): Date => {
			return addDays(weekStart, dayOffset);
		};

		const scheduleDays = new Set(schedules.filter(schedule => schedule.uniform).map(schedule => schedule.day.toLowerCase()));

		let lastAttachmentId = null;

		for (const attendance of data) {
			const weekStart = startOfWeek(attendance.date, { weekStartsOn: 1 });
			const weekEnd = endOfWeek(attendance.date, { weekStartsOn: 1 });
			const weekKey = `${formatDate(weekStart)}-${formatDate(weekEnd)}`;

			if (attendance.attachmentId) {
				lastAttachmentId = attendance.attachmentId;
			} else {
				lastAttachmentId = null;
			}

			if (checkedWeeks.has(weekKey)) continue;

			for (let i = 0; i < 7; i++) {
				const dayDate = getDateForDay(weekStart, i);
				if (today == dayDate.toLocaleDateString()) continue;
				const formattedDay = formatDate(dayDate);

				const dayOfWeek = Object.keys(Day)[i];

				if (!dayOfWeek || !scheduleDays.has(dayOfWeek.toLowerCase() as any)) continue;

				const exists = data.some(att => formatDate(att.date) === formattedDay);

				if (!exists) {
					scheduleAttendances.push({
						id: -12,
						date: dayDate,
						status: AttendType.OUT,
						userId: userId,
						attachmentId: lastAttachmentId
					});
				}
			}

			checkedWeeks.add(weekKey);

		}

		const allAttendances = [...data, ...scheduleAttendances]
		.filter(data => new Date(data.date).getTime() < addDays(new Date(today), 1).getTime());

		const groupedByDate = this.groupByDate(allAttendances as any);

		return Object.keys(groupedByDate)
			.map(date => this.mapStatus(groupedByDate[date]))
			.sort((a, b) => {
				const dateA = new Date(a.date);
				const dateB = new Date(b.date);

				const weekStartA = startOfWeek(dateA, { weekStartsOn: 1 });
				const weekStartB = startOfWeek(dateB, { weekStartsOn: 1 });

				if (weekStartA.getTime() !== weekStartB.getTime()) {
					return weekStartB.getTime() - weekStartA.getTime();
				}

				return dateB.getDay() - dateA.getDay();
			});
	}

	async checkToday(userId: number, status: AttendType) {
		const startOfDay = new Date();
		startOfDay.setHours(0, 0, 0, 0);

		const endOfDay = new Date();
		endOfDay.setHours(23, 59, 59, 999);

		if (status !== AttendType.PAUSE && status !== AttendType.RESUME) {

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

			if(status === AttendType.OUT) {
				const inToday = await this.prisma.attendance.findFirst({
					where: {
						userId,
						status: AttendType.OUT,
						date: {
							gte: startOfDay,
							lte: endOfDay,
						},
					},
				});

				if (inToday) {
					throw new ForbiddenException(`You have not registered IN today.`);
				}
			}

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
			
			const outToday = await this.prisma.attendance.findFirst({
				where: {
					userId,
					status: AttendType.OUT,
					date: {
						gte: startOfDay,
						lte: endOfDay,
					},
				},
			});

			if (outToday) {
				throw new ForbiddenException(`You have already registered OUT today.`);
			}

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
				date: 'desc'
			}
		}), await this.scheduleService.getSchedule(userId));
	}

	async getAttendanceSummaryFrom(
		userId: number,
		startDate: Date,
		endDate: Date,
		includeDailySummaries = false
	) {
		const attendances = await this.prisma.attendance.findMany({
			where: {
				userId,
				date: {
					gte: startDate,
					lt: endDate,
				}
			},
			orderBy: {
				date: 'desc',
			}
		});

		const dailySummaries = attendances.length ? this.fixAttendances(attendances, await this.scheduleService.getSchedule(userId)) : [];

		const totalDurationSeconds = dailySummaries.reduce((acc, day) => acc + (day.totalTime || 0), 0);
		const totalDurationMinutes = Math.floor(totalDurationSeconds / 60);
		const durationSecondsRemainder = totalDurationSeconds % 60;
		const totalDurationHours = Math.floor(totalDurationMinutes / 60);
		const durationMinutesRemainder = totalDurationMinutes % 60;

		return {
			dailySummaries: includeDailySummaries ? dailySummaries : [],
			totalDays: dailySummaries.length,
			totalTime: totalDurationSeconds,
			totalMinutes: `${durationMinutesRemainder.toString().padStart(2, '0')}:${durationSecondsRemainder.toString().padStart(2, '0')}`, // MM:SS
			totalHours: `${totalDurationHours.toString().padStart(2, '0')}:${durationMinutesRemainder.toString().padStart(2, '0')}` // HH:MM
		};
	}

	async getAttachment(attachmentId: number, userId?: number) {
		return await this.prisma.attachment.findUnique({
			where: {
				id: attachmentId, Attendance: userId ? {
					some: {
						userId
					}
				} : undefined,
			}
		});
	}

	async getWeeklyAttendance(userId: number, includeDailySummaries = false) {
		const startOfWeekDate = startOfWeek(new Date(), { weekStartsOn: 1 }); // Assuming week starts on Monday
		const endOfWeekDate = endOfWeek(new Date(), { weekStartsOn: 1 });

		return await this.getAttendanceSummaryFrom(
			userId,
			startOfWeekDate,
			endOfWeekDate,
			includeDailySummaries
		);
	}

	async getMonthlyAttendance(userId: number, includeDailySummaries = false) {
		const startOfMonthDate = startOfMonth(new Date());
		const endOfMonthDate = endOfMonth(new Date());

		return await this.getAttendanceSummaryFrom(
			userId,
			startOfMonthDate,
			endOfMonthDate,
			includeDailySummaries
		);
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

	async getAdmins(){
		return (await this.prisma.admin.findMany({
			include: {
				user: true
			}
		})).map(admin => admin.user);
	}
}
