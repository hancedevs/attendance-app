import { Body, Delete, Get, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { BasicCommonCRUDService } from "./basic-crud.service";
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiProperty } from "@nestjs/swagger";
import { BasicCRUDDto } from "./basic-crud.dto";



export function BasicCommonCRUDController<
  Service extends InstanceType<ReturnType<typeof BasicCommonCRUDService>>
>(
  name: string,
  CreateDto: new () => BasicCRUDDto,
  UpdateDto: new () => BasicCRUDDto
) {
	class Controlelr  {
		constructor(public service: Service) {}
	
		@Post()
		@ApiOperation({ summary: `Create one ${name}` })
		@ApiBody({ type: CreateDto })
		@ApiCreatedResponse({ type: CreateDto })
		create(@Body() createCompanyDto: InstanceType<typeof CreateDto>) {
			return this.service.create(createCompanyDto);
		}
	
		@Get()
		@ApiOperation({ summary: `Get all ${name}` })
		@ApiOkResponse({ type: [CreateDto] })
		findAll() {
			return this.service.findAll();
		}
	
		@Get(':id')
		@ApiOperation({ summary: `Get one ${name} by \`id\`` })
		@ApiParam({ name: 'id' })
		@ApiOkResponse({ type: CreateDto })
		findOne(@Param('id', ParseIntPipe) id: number) {
			return this.service.findOne(id);
		}
	
		@Put(':id')
		@ApiOperation({ summary: `Edit one ${name} by \`id\`` })
		@ApiParam({ name: 'id' })
		@ApiBody({ type: UpdateDto })
		@ApiCreatedResponse({ type: CreateDto })
		update(@Param('id', ParseIntPipe) id: number, @Body() updateCompanyDto: InstanceType<typeof UpdateDto>) {
			return this.service.update(id, updateCompanyDto);
		}
	
		@Delete(':id')
		@ApiOperation({ summary: `Delete one ${name} by \`id\`` })
		@ApiParam({ name: 'id' })
		delete(@Param('id', ParseIntPipe) id: number) {
			return this.service.delete(id);
		}
	}
	return Controlelr;
}