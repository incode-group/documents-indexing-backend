import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SignUpBodyDto } from './data-types/dtos/sign-up.dto';
import { AuthenticationDetails, CognitoUser, CognitoUserAttribute, CognitoUserPool } from 'amazon-cognito-identity-js';
import { AwsCognitoService } from 'src/libs/aws/services/aws-cognito.service';
import { SignInPayloadDto, SignInResponseDto } from './data-types/dtos/sign-in.dto';
import { ConfirmUserPayloadDto, ConfirmUserResponseDto } from './data-types/dtos/confirm-user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly cognitoService: AwsCognitoService) {}

  /**
   * Registers a new user
   * @param payload The sign-up payload containing user details.
   * @returns A message indicating successful registration.
   */
  async signUp(payload: SignUpBodyDto) {
    const { email, name, password } = payload;

    await this.cognitoService.signUp(email, password, name);

    return {
      message: 'User registered successfully. Please check your email for verification.',
    };
  }

  /**
   * Signs in a user
   * @param payload The sign-in payload containing email and password.
   * @returns access token
   */
  async signIn(payload: SignInPayloadDto): Promise<SignInResponseDto> {
    const { email, password } = payload;

    return this.cognitoService.signIn(email, password);
  }

  /**
   * Confirms a user's registration.
   * @param payload The confirmation payload containing email and code.
   * @returns A message indicating successful confirmation.
   */
  async confirmUser(payload: ConfirmUserPayloadDto): Promise<ConfirmUserResponseDto> {
    const { email, code } = payload;

    await this.cognitoService.confirmUser(email, code);

    return { message: 'User confirmed successfully.' };
  }
}
