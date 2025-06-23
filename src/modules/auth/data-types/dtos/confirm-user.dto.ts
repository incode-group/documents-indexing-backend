import { IsEmail, IsNotEmpty, IsString, Length, MaxLength, MinLength } from 'class-validator';
import { SuccessResponseDto } from 'src/data-types/dtos/success-response.dto';

export class ConfirmUserBodyDto {
  @IsEmail()
  email: string;

  @IsString({ message: 'code must be a string' })
  @Length(6, 6, { message: 'code must be exactly 6 characters long' })
  code: string;
}

export class ConfirmUserPayloadDto extends ConfirmUserBodyDto {}

export class ConfirmUserResponseDto extends SuccessResponseDto {}
