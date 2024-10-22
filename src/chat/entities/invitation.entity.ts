import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Invitation {
  @Field(() => String)
  chatId: string;
  @Field(() => String)
  senderId: string;
  @Field(() => String)
  receiverId: string;
  @Field(() => Int)
  status: number;
}
