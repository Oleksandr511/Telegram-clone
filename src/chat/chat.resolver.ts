import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { ChatService } from './chat.service';
import { Chat } from './entities/chat.entity';
import { CreateChatInput } from './dto/create-chat.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { ChatParticipant } from './entities/chatParticipant';
import { AddParticipantInput } from './dto/add-participant.input';
import { Invitation as InvitationEntity } from './entities/invitation.entity';
import { InvitationService } from './invitation.service';
import { InvitationInput } from './dto/invitation-input.dto';
import { Invitation } from '@prisma/client';

@Resolver(() => Chat)
@Resolver(() => ChatParticipant)
@Resolver(() => InvitationEntity)
@UseGuards(AuthGuard)
export class ChatResolver {
  constructor(
    private readonly chatService: ChatService,
    private readonly invitationService: InvitationService,
  ) {}

  @Mutation(() => Chat)
  createChat(
    @Args('createChatInput') createChatInput: CreateChatInput,
    @Context() context,
  ) {
    const request = context.req;
    return this.chatService.createChat(createChatInput, request.user.sub);
  }

  // @Query(() => [Chat])
  // findAllUserChats(@Context() context) {
  //   const request = context.req;
  //   return this.chatService.findAllUserChats(request.user.sub);
  // }

  @Mutation(() => [ChatParticipant])
  createChatParticipant(
    @Args('addParticipantInput') addParticipantInput: AddParticipantInput,
  ) {
    return this.chatService.addParticipant(addParticipantInput);
  }

  // @Mutation(() => ChatParticipant)
  // sendInvite(
  //   @Args('addParticipantInput') addParticipantInput: AddParticipantInput, // chat id, user id
  //   @Context() context,
  // ) {
  //   const request = context.req;
  //   return this.chatService.sendInvite(addParticipantInput, request.user.sub);
  // }

  @Query(() => [ChatParticipant])
  getChatParticipants(@Args('chatId') chatId: string) {
    return this.chatService.getChatParticipants(chatId);
  }
  //-----------------------------------

  @Mutation(() => InvitationEntity)
  createInvitation(
    @Args('InvitationInput') inviteInput: InvitationInput,
    @Context() context,
  ): Promise<Invitation> {
    inviteInput.senderId = context.req.user.sub;
    return this.invitationService.createInvitation(inviteInput);
  }

  @Query(() => [InvitationEntity])
  getChatInvitations(@Args('chatId') chatId: string): Promise<Invitation[]> {
    return this.invitationService.getInvitations(chatId);
  }

  @Mutation(() => InvitationEntity)
  async respondToInvitation(
    @Args('accept') accept: boolean,
    @Args('invitationId') invitationId: string,
    @Context() context,
  ) {
    const response = await this.invitationService.respondToInvitation(
      accept,
      invitationId,
      // context.req.user.sub,
    );
    const acceptance_mask = 1 << 4;
    if (response.status & acceptance_mask) {
      const newChatParticipant = await this.chatService.addParticipant({
        chatId: response.chatId,
        userId: context.req.user.sub,
        status: 0b00000001,
        permission: 0b111,
      });
      return newChatParticipant;
    } else {
      throw new Error('Invitation not accepted');
    }
  }
}
