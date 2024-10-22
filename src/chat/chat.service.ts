import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateChatInput } from './dto/create-chat.input';
import { UpdateChatInput } from './dto/update-chat.input';
import { PrismaService } from 'src/prisma.service';
import { AddParticipantInput } from './dto/add-participant.input';

// export const Status = {
//   ADMIN: 0b111,
//   MEMBER: 0b001,
//   BLOCKED: 0b000,
//   INVITED_FROM_USER: 0b010,
//   INVITED_FROM_EXIST_USER: 0b110,
//   PENDING: 0b100,
// };

// export const Permission = {
//   READ: 0b100,
//   WRITE: 0b010,
//   DELETE: 0b001,
// };
// 00000000

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}
  async createChat(createChatInput: CreateChatInput, creatorId: string) {
    if (!creatorId) {
      console.log('creatorId', creatorId);
      throw new UnauthorizedException('User not found');
    }

    const chat = await this.prisma.chat.findFirst({
      where: {
        name: createChatInput.name,
      },
    });

    if (chat) {
      throw new ConflictException('Chat already exists');
    }

    return await this.prisma.chat.create({
      data: {
        name: createChatInput.name,
        description: createChatInput?.description || null,
        type: createChatInput.type,
        image: createChatInput?.image || null,
        chatParticipants: {
          create: {
            userId: creatorId,
            status: 0b00000000,
            permission: 0b111,
          },
        },
      },
    });
  }

  async addParticipant(addParticipantInput: AddParticipantInput) {
    const chat = await this.prisma.chat.findFirst({
      where: {
        chatId: addParticipantInput.chatId,
      },
    });

    if (!chat) {
      throw new ConflictException('Chat not found');
    }

    return await this.prisma.chatParticipant.create({
      data: {
        chatId: addParticipantInput.chatId,
        userId: addParticipantInput.userId,
        status: addParticipantInput.status,
        permission: addParticipantInput.permission,
      },
    });
  }

  // async sendInvite(addParticipantInput: AddParticipantInput, senderId: string) {
  //   const chatUser = this.prisma.chatParticipant.findFirst({
  //     where: {
  //       chatId: addParticipantInput.chatId,
  //       userId: addParticipantInput.userId,
  //     },
  //   });
  //   if (chatUser) {
  //     throw new ConflictException('User already in chat');
  //   }
  //   if (senderId === addParticipantInput.userId) {
  //     addParticipantInput.status = 0b00000100; // user ask to inv
  //   } else {
  //     addParticipantInput.status = 0b00000001; //user get inv
  //   }

  //   return await this.prisma.chatParticipant.create({
  //     data: {
  //       chatId: addParticipantInput.chatId,
  //       userId: addParticipantInput.userId,
  //       status: addParticipantInput.status,
  //       permission: addParticipantInput.permission,
  //     },
  //   });
  // }

  async getChatParticipants(chatId: string) {
    return await this.prisma.chatParticipant.findMany({
      where: {
        chatId: chatId,
      },
    });
  }
}
