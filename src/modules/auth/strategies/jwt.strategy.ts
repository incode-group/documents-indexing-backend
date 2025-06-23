import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { passportJwtSecret } from "jwks-rsa";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            issuer: `https://cognito-idp.eu-north-1.amazonaws.com/eu-north-1_dv2tQZf6g`,
            audience: configService.get("COGNITO_CLIENT_ID"),
            secretOrKeyProvider: passportJwtSecret({
                cache: true,
                rateLimit: true,
                jwksRequestsPerMinute: 5,
                jwksUri: `https://cognito-idp.eu-north-1.amazonaws.com/eu-north-1_dv2tQZf6g/.well-known/jwks.json`,
            }),

            algorithms: ["RS256"],
        });
    }
    async validate(payload: any) {
        return { userId: payload.sub, email: payload.email };
    }
}
