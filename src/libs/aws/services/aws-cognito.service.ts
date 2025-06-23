import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
    AuthenticationDetails,
    CognitoUser,
    CognitoUserAttribute,
    CognitoUserPool,
    ISignUpResult,
} from "amazon-cognito-identity-js";
import { CognitoIdentityServiceProvider } from "aws-sdk";
import * as crypto from "crypto";
import { SignInResponseDto } from "src/modules/auth/data-types/dtos/sign-in.dto";

@Injectable()
export class AwsCognitoService {
    private readonly CLIENT_ID: string;
    private readonly USER_POOL_ID: string;

    private readonly cognitoProvider: CognitoIdentityServiceProvider =
        new CognitoIdentityServiceProvider();
    private readonly userPool: CognitoUserPool;

    constructor(private readonly configService: ConfigService) {
        this.CLIENT_ID = configService.get<string>("COGNITO_CLIENT_ID")!;
        this.USER_POOL_ID = configService.get<string>("COGNITO_USER_POOL_ID")!;

        this.userPool = new CognitoUserPool({
            UserPoolId: this.USER_POOL_ID,
            ClientId: this.CLIENT_ID,
        });
    }

    generateSecretHash(
        username: string,
        clientId: string,
        clientSecret: string,
    ): string {
        return crypto
            .createHmac("SHA256", clientSecret)
            .update(username + clientId)
            .digest("base64");
    }

    async signUp(
        email: string,
        password: string,
        name: string,
    ): Promise<ISignUpResult> {
        return new Promise((resolve, reject) => {
            this.userPool.signUp(
                email,
                password,
                [
                    new CognitoUserAttribute({ Name: "email", Value: email }),
                    new CognitoUserAttribute({ Name: "name", Value: name }),
                ],
                [],
                (err, result) => {
                    if (err) {
                        return reject(new BadRequestException(err.message));
                    }

                    resolve(result!);
                },
            );
        });
    }

    async signIn(email: string, password: string): Promise<SignInResponseDto> {
        return new Promise((resolve, reject) => {
            const user = new CognitoUser({
                Username: email,
                Pool: this.userPool,
            });

            const authDetails = new AuthenticationDetails({
                Username: email,
                Password: password,
            });

            user.authenticateUser(authDetails, {
                onSuccess: (session) =>
                    resolve({
                        accessToken: session.getIdToken().getJwtToken(),
                    }),
                onFailure: (err) =>
                    reject(new UnauthorizedException(err.message)),
            });
        });
    }

    async confirmUser(email: string, code: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const user = new CognitoUser({
                Username: email,
                Pool: this.userPool,
            });

            user.confirmRegistration(code, true, (err) => {
                if (err) {
                    return reject(new BadRequestException(err.message));
                }
                resolve();
            });
        });
    }
}
