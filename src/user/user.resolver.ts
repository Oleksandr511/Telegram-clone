import { Args, Mutation, Resolver, Query, Context } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './user.entity';
import { ExecutionContext, Req, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ChatParticipant } from 'src/chat/entities/chatParticipant';

@Resolver(() => User)
@UseGuards(AuthGuard)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User])
  async getUsers() {
    return this.userService.getUsers();
  }

  @Query(() => User)
  async getUserById(@Args('id') id: string, @Context() context) {
    // const request = context.req;
    // console.log('request', request);
    return this.userService.getUser(id);
  }

  @Query(() => [ChatParticipant])
  async getUsersChatParticipants(@Context() context) {
    const request = context.req;
    return this.userService.getUsersChatParticipants(request.user.sub);
  }
}
