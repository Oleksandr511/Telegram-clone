import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class ChatParticipant {
  @Field(() => String)
  chatId: string;
  @Field(() => String)
  userId: string;
  @Field(() => Int)
  status: number;
  @Field(() => Int)
  permission: number;
}
