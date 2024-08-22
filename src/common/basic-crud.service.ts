import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

export function BasicCommonCRUDService<CreateDto, UpdateDto>(tableName: string){
	return class Service {
		constructor(public prisma: PrismaService) {}
		includes = {}
	
		async create(data: CreateDto) {
			return this.prisma[tableName].create({ data });
		}
	
		async findAll() {
			return this.prisma[tableName].findMany({
				include: this.includes,
			});
		}
	
		async findOne(id: number) {
			return this.prisma[tableName].findUnique({
				where: { id },
				include: this.includes,
			});
		}
	
		async update(id: number, data: UpdateDto) {
			return this.prisma[tableName].update({
				where: { id },
				data,
			});
		}
	
		async delete(id: number) {
			return this.prisma[tableName].delete({
				where: { id },
			});
		}
	};
}