import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialDto } from './dto/auth-credential.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  createUser(@Body() requestDto: AuthCredentialDto): Promise<void> {
    return this.authService.createUser(requestDto);
  }

  @Post('/signin')
  signIn(
    @Body() signInDto: AuthCredentialDto,
  ): Promise<{ access_token: string }> {
    return this.authService.signIn(signInDto);
  }
}
