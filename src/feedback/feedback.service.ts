import { BasicCommonCRUDService } from '@/common/basic-crud.service';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateFeedbackDto, UpdateFeedbackDto } from './dto/feedback.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class FeedbackService
	extends BasicCommonCRUDService<CreateFeedbackDto, UpdateFeedbackDto>('feedback') {
	constructor(public prisma: PrismaService) {
		super(prisma);
	}
	includes = { company: { include: { industry: true } } };

	async create(data: CreateFeedbackDto): Promise<any>;
  async create(userId: number, data: CreateFeedbackDto): Promise<any>;
  async create(userIdOrData: number | CreateFeedbackDto, data?: CreateFeedbackDto): Promise<any> {
    if (typeof userIdOrData === 'number') {
			data.userId = userIdOrData;
      return super.create(data!);
    } else {
      return super.create(userIdOrData);
    }
  }

	async findAllBy(userId: number) {
		return this.prisma.feedback.findMany({
			where: { userId },
			include: this.includes,
			orderBy: {
				createdAt: 'desc'
			}
		});
	}

	async searchFeedback(searchParams: {
		userId?: number,
		industryId?: number,
		companyId?: number,
		startDate?: string,
		endDate?: string
	}){
		const { userId, industryId, companyId, startDate, endDate } = searchParams;

		return this.prisma.feedback.findMany({
			where: {
				...(userId && { userId }),
				...(companyId && { companyId }),
				...(industryId && { company: { industryId } }),
				createdAt: startDate && endDate ? {
					gte: new Date(startDate),
					lte: new Date(endDate),
				} : undefined,
			},
			include: {
				user: true,
				attachment: true,
				company: {
          include: {
            industry: true, // Include related industry data if needed
          },
        }, 
			},
		});
	}

	// Since feedbacks are useful data
	// We can't delete feedbacks. But we can
	// Move them to another user
	async deleteFor(userId: number){
		let otherUser = (await this.prisma.user.findFirst({
			where: {
				role: UserRole.SALES,
				OR: [
					{
						role: UserRole.MARKETING
					}
				]
			}
		}))?.id;
		if(!otherUser) {
			otherUser = (await this.prisma.admin.findFirst({}))?.id
		}
		if(!otherUser) {
			otherUser = (await this.prisma.user.findFirst())?.id
		}
		return await this.prisma.feedback.updateMany({
			where: { userId },
			data: { userId: otherUser }
		});
	}
}
