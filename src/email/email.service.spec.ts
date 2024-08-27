import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailService],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send email', async () => {
    const value = await service.sendEmail('mame@localhost', 'Password Reset',
      'Here is the your one time 6-digit cide to reset yout password, It will expire in one hour:',
      `<b style="font-size: 40px">123456</b>`);
    expect(value)
    .not.toBeNull();
  })
});
