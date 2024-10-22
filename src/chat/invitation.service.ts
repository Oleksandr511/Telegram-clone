import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { InvitationInput } from './dto/invitation-input.dto';
import { Invitation } from '@prisma/client';

@Injectable()
export class InvitationService {
  constructor(private prisma: PrismaService) {}
  async createInvitation(data: InvitationInput): Promise<Invitation> {
    let inviteStatus = 0b00000000;
    if (data.senderId === data.receiverId) {
      inviteStatus = 0b00000110; // status pending and someone in chat have to react on it
    } else if (data.senderId !== data.receiverId) {
      inviteStatus = 0b00000101; // status pending and user have to react on it
    }
    return await this.prisma.invitation.create({
      data: {
        chatId: data.chatId,
        senderId: data.senderId,
        receiverId: data.receiverId,
        status: inviteStatus,
      },
    });
  }

  async getInvitations(id: string): Promise<Invitation[]> {
    const chatInvitations = await this.prisma.invitation.findMany({
      where: {
        chatId: id,
      },
    });
    const b = chatInvitations[0].status;
    console.log(b.toString(2));
    console.log(b);
    return chatInvitations;
  }

  async respondToInvitation(
    accept: boolean,
    invitationId,
    // userId,
  ): Promise<Invitation> {
    const invitation = await this.prisma.invitation.findFirst({
      where: {
        id: invitationId,
      },
    });
    if (!invitation) {
      throw new BadRequestException('Invitation not found');
    }
    return await this.prisma.invitation.update({
      where: {
        id: invitationId,
      },
      data: {
        status: accept ? 0b00001000 : 0b00010000,
      },
    });
  }
}
