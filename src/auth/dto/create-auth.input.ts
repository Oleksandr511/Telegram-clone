import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

@InputType()
export class CreateAuthInput {
  @Field(() => String)
  @IsString()
  name: string;
  @Field(() => String)
  @IsPhoneNumber()
  phoneNumber: string;
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  password: string;
}
