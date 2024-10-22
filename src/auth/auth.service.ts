import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthInput } from './dto/create-auth.input';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginAuthInput } from './dto/login-auth.input';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(createAuthInput: CreateAuthInput) {
    const user = await this.prismaService.user.findFirst({
      where: { phoneNumber: createAuthInput.phoneNumber },
    });
    if (user) {
      throw new UnauthorizedException('User already exists');
    }
    const hashedPassword = await bcrypt.hash(createAuthInput.password, 10);
    const newUser = await this.prismaService.user.create({
      data: {
        name: createAuthInput.name,
        phoneNumber: createAuthInput.phoneNumber,
        password: hashedPassword,
      },
    });
    const { accessToken, refreshToken } = await this.createTokens(
      newUser.userId,
    );
    await this.updateRefreshToken(newUser.userId, refreshToken);
    return { user: newUser, accessToken, refreshToken };
  }

  async login(loginAuthInput: LoginAuthInput) {
    const user = await this.prismaService.user.findFirst({
      where: { phoneNumber: loginAuthInput.phoneNumber },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const valid = await bcrypt.compare(loginAuthInput.password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid password');
    }
    const { accessToken, refreshToken } = await this.createTokens(user.userId);
    await this.updateRefreshToken(user.userId, refreshToken);
    return { user, accessToken, refreshToken };
  }

  async updateTokens(oldRefreshToken: string) {
    const payload = await this.jwt.verify(oldRefreshToken, {
      secret: process.env.REFRESH_TOKEN_SECRET,
    });
    if (!payload.sub) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    console.log(payload.sub); // user id
    const { accessToken, refreshToken } = await this.createTokens(payload.sub);

    await this.updateRefreshToken(payload.sub, refreshToken);
    return { accessToken, refreshToken };
  }

  async createTokens(id: string) {
    const accessToken = await this.jwt.signAsync(
      { sub: id },
      { secret: process.env.ACCESS_TOKEN_SECRET, expiresIn: '15m' },
    );
    const refreshToken = await this.jwt.signAsync(
      { sub: id },
      { secret: process.env.REFRESH_TOKEN_SECRET, expiresIn: '7d' },
    );
    return { accessToken, refreshToken };
  }

  async updateRefreshToken(id: string, refreshToken: string) {
    return this.prismaService.user.update({
      where: { userId: id },
      data: { refreshToken },
    });
  }
}
