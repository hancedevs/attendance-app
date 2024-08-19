import { PrismaService } from '@/prisma/prisma.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { Attachment, AttendType } from '@prisma/client';

@Injectable()
export class AttendanceService {
	constructor(private prisma: PrismaService) {}

	async checkToday(userId: number, status: AttendType){
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

	async getAll(userId: number){
		return await this.prisma.attendance.findMany({
			where: {
				userId
			},
			orderBy: {
				date: 'desc',
			}
		})
	}

	async attachment(
		attachmentData: Partial<Attachment>,
		filename: string,
		userId: number
	){
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
