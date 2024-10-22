import { Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
export class InvitationInput {
  @Field(() => String)
  chatId: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  senderId: string;

  @Field(() => String)
  receiverId: string;
}
