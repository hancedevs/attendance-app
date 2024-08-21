import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateRequestDto } from './dto/create-request.dto';
import { Attachment, StaffRequest, StaffRequestStatus } from '@prisma/client';

@Injectable()
export class RequestsService {
	constructor(private prisma: PrismaService){}

	async create(data: Partial<StaffRequest>){
		return await this.prisma.staffRequest.create({
			data: data as StaffRequest
		});
	}
	
	async getAttachment(attachmentId: number, userId?: number){
		return await this.prisma.attachment.findUnique({
			where: { id: attachmentId, Attendance: userId ? {
				some: {
					userId
				}
			} : undefined, }
		});
	}

	async attachment(filename: string, attachmentData: Partial<Attachment>){
		return await this.prisma.attachment.create({
			data: {
				filename,
				name: attachmentData.name || 'Absence Cause',
				text: attachmentData.text
			}
		});
	}

	async getAllFrom(userId: number, status?: StaffRequestStatus, attachments = false){
		return await this.prisma.staffRequest.findMany({
			where: { userId, status },
			include: {
				attachment: attachments
			}
		});
	}

	async getAll(){
		return await this.prisma.staffRequest.findMany({});
	}


	async getOne(id: number){
		return await this.prisma.staffRequest.findUnique({
			where: { id },
			include: {
				attachment: true
			}
		});
	}

	async setStatus(id: number, status: StaffRequestStatus){
		return await this.prisma.staffRequest.update({
			where: { id },
			data: {
				status
			}
		});
	}

	async getAllByStatus(status: StaffRequestStatus){
		return await this.prisma.staffRequest.findMany({
			where: {
				status
			}
		});
	}

	async deleteWhere(id: number, userId: number){
		return await this.prisma.staffRequest.deleteMany({
			where: { id, userId }
		});
	}
}
