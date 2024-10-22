import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async createUser(data: {
    password: string;
    name: string;
    phoneNumber: string;
  }): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        password: data.password,
        name: data.name,
        phoneNumber: data.phoneNumber,
      },
    });

    return {
      userId: user.userId,
      name: user.name,
      phoneNumber: user.phoneNumber,
    };
  }

  async getUsers(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  async getUser(id: string): Promise<User> {
    return await this.prisma.user.findUnique({
      where: { userId: id },
    });
  }

  async getUsersChatParticipants(userId: string) {
    return await this.prisma.chatParticipant.findMany({
      where: {
        userId: userId,
      },
    });
  }
}
