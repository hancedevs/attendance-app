import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { Controller, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
@UseGuards(JwtAuthGuard)
export class EventsController {


}
