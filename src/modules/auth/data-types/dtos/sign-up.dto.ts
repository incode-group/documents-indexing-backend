import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class SignUpBodyDto {
  @IsEmail()
  email: string;

  @IsString({ message: 'password must be a string' })
  @IsNotEmpty({ message: 'password cannot be empty' })
  @MinLength(8, { message: 'password must be at least 8 characters long' })
  @MaxLength(64, { message: 'password must be at most 64 characters long' })
  password: string;

  @IsString({ message: 'name must be a string' })
  @IsNotEmpty({ message: 'name cannot be empty' })
  @MinLength(1, { message: 'name must be at least 1 character long' })
  name: string;
}

export class SignUpPayloadDto extends SignUpBodyDto {}

export class SignUpResponseDto {
  accessToken: string;
}
