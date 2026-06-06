import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(
    private readonly configService: ConfigService,
    @Inject('CUSTOM_PROVIDER') private readonly custom,
    @Inject('CUSTOM_VAL') private readonly val,
  ) {}

  getHello(): string {
    // return process.env.SECRET;
    return (
      this.configService.get('SECRET2') + ` ${this.custom.a}` + `${this.val}`
    );
  }
}
