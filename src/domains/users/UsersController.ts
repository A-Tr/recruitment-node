import { Body, Controller, Post, Route, Tags } from 'tsoa';
import { LoginRequest, LoginResponse } from './SessionModel';
import { UsersService } from './UsersService';

@Route('users')
@Tags('Users')
export class UsersController extends Controller {
  private service = new UsersService();

  @Post('login')
  async login(@Body() payload: LoginRequest): Promise<LoginResponse> {
    return this.service.login(payload.email, payload.password)
  }
}