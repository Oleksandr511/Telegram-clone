import { InputType, Field } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
export class AddParticipantInput {
  @Field(() => String)
  chatId: string;

  @Field(() => String)
  userId: string;

  @Field(() => Number, { nullable: true })
  @IsOptional()
  status: number;

  @Field(() => Number, { nullable: true })
  @IsOptional()
  permission: number;
}
