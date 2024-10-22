import { Field, InputType } from '@nestjs/graphql';
import { IsPhoneNumber, IsString } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  @IsString()
  name: string;
  @Field(() => String)
  @IsPhoneNumber()
  phoneNumber: string;
  @Field(() => String)
  @IsString()
  password: string;
}
