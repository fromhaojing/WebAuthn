import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post( 'register-challenge')
  getRegisterChallenge(@Body() body: any,@Req() req: any) {
    return this.appService.getRegisterChallenge(body,req);
  }

  @Post( 'register-response')
  getRegisterResponse(@Body() body: any, @Req() req: any) {
    return this.appService.getRegisterResponse(body, req);
  }
  @Post( 'login-challenge')
  getLoginChallenge(@Body() body: any, @Req() req: any) {
    return this.appService.getLoginChallenge(body, req);
  }

  @Post( 'login-response')
  getLoginResponse(@Body() body: any, @Req() req: any) {
    return this.appService.getLoginResponse(body, req);
  }
}
