import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class SignInBodyDto {
  @IsEmail()
  email: string;

  @IsString({ message: 'password must be a string' })
  @IsNotEmpty({ message: 'password cannot be empty' })
  @MinLength(8, { message: 'password must be at least 8 characters long' })
  @MaxLength(64, { message: 'password must be at most 64 characters long' })
  password: string;
}

export class SignInPayloadDto extends SignInBodyDto {}

export class SignInResponseDto {
  accessToken: string;
}
