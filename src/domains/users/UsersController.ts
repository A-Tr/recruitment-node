import { Body, Controller, Get, Post, Route, Tags } from 'tsoa';
import { LoginRequest, LoginResponse } from './UserModel';
import { UsersService } from './UsersService';

@Route('users')
@Tags('users')
export class UsersController extends Controller {
  private service = new UsersService();

  @Post('login')
  async login(@Body() requestBody: LoginRequest): Promise<LoginResponse> {
    return this.service.login(requestBody.email, requestBody.password)
  }
}