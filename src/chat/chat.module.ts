import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatResolver } from './chat.resolver';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { InvitationService } from './invitation.service';

@Module({
  providers: [
    ChatResolver,
    ChatService,
    InvitationService,
    PrismaService,
    JwtService,
  ],
})
export class ChatModule {}
