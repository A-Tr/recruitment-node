import { Body, Controller, Post, Route, Tags } from 'tsoa';
import { inject, injectable } from 'tsyringe';
import { LoginRequest, LoginResponse } from './SessionModel';
import { UsersService } from './UsersService';

@injectable()
@Route('users')
@Tags('Users')
export class UsersController extends Controller {
  constructor(@inject(UsersService) private service: UsersService) {
    super();
  }

  @Post('login')
  async login(@Body() payload: LoginRequest): Promise<LoginResponse> {
    return this.service.login(payload.email, payload.password);
  }
}
