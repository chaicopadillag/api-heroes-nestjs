import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  register(@Body() createAuthDto: CreateUserDto) {
    return this.authService.register(createAuthDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Request() req) {
    console.log(req.authUser);
    return this.authService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('verify-token')
  async verifyToken(@Request() req) {
    const authUser = req.authUser;
    const token = await this.authService.generarToken({ id: authUser._id });
    return {
      user: authUser,
      token,
    };
  }

  @Post('seed')
  seed() {
    return this.authService.seed();
  }
}
