import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AwsModule } from 'src/libs/aws/aws.module';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [AwsModule],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
