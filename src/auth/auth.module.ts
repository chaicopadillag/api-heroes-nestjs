import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from 'src/config/configuration';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User, UserSchema } from './entities/user.entity';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [configuration.KEY],
      useFactory: ({ jwt }: ConfigType<typeof configuration>) => ({
        global: true,
        secret: jwt.secret,
        signOptions: { expiresIn: '12h' },
      }),
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
