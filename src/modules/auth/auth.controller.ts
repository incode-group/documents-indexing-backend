import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignUpBodyDto } from "./data-types/dtos/sign-up.dto";
import { SignInBodyDto } from "./data-types/dtos/sign-in.dto";
import { ConfirmUserBodyDto } from "./data-types/dtos/confirm-user.dto";
import { JwtGuard } from "./guards/jwt.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("sign-up")
  async signUp(@Body() body: SignUpBodyDto) {
    return this.authService.signUp(body);
  }

  @Post("sign-in")
  async signIn(@Body() body: SignInBodyDto) {
    return this.authService.signIn(body);
  }

  @Post("confirm")
  async confirm(@Body() body: ConfirmUserBodyDto) {
    return this.authService.confirmUser(body);
  }

  @UseGuards(JwtGuard)
  @Get("me")
  async me(@Req() req){
    return req.user;
  }
}
